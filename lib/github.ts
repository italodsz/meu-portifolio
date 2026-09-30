import "server-only";

import { cache } from "react";
import { siteConfig } from "@/config/site";
import fallback from "@/data/github-fallback.json";

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;
const TIMEOUT_MS = 6000;

export type GitHubLanguageStat = {
  name: string;
  bytes: number;
  /** 0–100, com uma casa decimal. */
  percent: number;
};

export type GitHubRepo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
};

export type GitHubData = {
  username: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string;
  /** Todas as linguagens, ordenadas por bytes (maior primeiro). */
  languages: GitHubLanguageStat[];
  recentRepos: GitHubRepo[];
  source: "live" | "fallback";
  fetchedAt: string;
};

type ApiUser = {
  public_repos: number;
  followers: number;
  created_at: string;
  html_url: string;
};

type ApiRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  languages_url: string;
};

type ApiLanguages = Record<string, number>;

async function gh<T>(url: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} em ${url}`);
  }
  return (await response.json()) as T;
}

export function toLanguageStats(totals: ApiLanguages): GitHubLanguageStat[] {
  const entries = Object.entries(totals).filter(([, bytes]) => bytes > 0);
  const sum = entries.reduce((acc, [, bytes]) => acc + bytes, 0);
  if (sum === 0) return [];
  return entries
    .map(([name, bytes]) => ({ name, bytes, percent: Math.round((bytes / sum) * 1000) / 10 }))
    .sort((a, b) => b.bytes - a.bytes);
}

function fallbackData(): GitHubData {
  const username = siteConfig.github.username;
  return {
    username,
    profileUrl: `https://github.com/${username}`,
    publicRepos: fallback.publicRepos,
    followers: fallback.followers,
    createdAt: fallback.createdAt,
    languages: toLanguageStats(
      Object.fromEntries(fallback.languages.map((language) => [language.name, language.bytes])),
    ),
    recentRepos: fallback.recentRepos.slice(0, 6),
    source: "fallback",
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchLive(): Promise<GitHubData> {
  const username = siteConfig.github.username;
  const [user, repos] = await Promise.all([
    gh<ApiUser>(`${API}/users/${username}`),
    gh<ApiRepo[]>(`${API}/users/${username}/repos?per_page=100&type=owner&sort=pushed`),
  ]);

  const own = repos.filter((repo) => !repo.fork);

  // Soma os bytes de cada linguagem em todos os repositórios (um request por repo).
  const perRepo = await Promise.all(
    own.map((repo) => gh<ApiLanguages>(repo.languages_url).catch(() => ({}) as ApiLanguages)),
  );
  const totals: ApiLanguages = {};
  for (const languages of perRepo) {
    for (const [name, bytes] of Object.entries(languages)) {
      totals[name] = (totals[name] ?? 0) + bytes;
    }
  }

  const recentRepos = [...own]
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      pushedAt: repo.pushed_at,
    }));

  return {
    username,
    profileUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    createdAt: user.created_at,
    languages: toLanguageStats(totals),
    recentRepos,
    source: "live",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Dados do GitHub usados no hero e na seção "GitHub ao vivo".
 * Cache de 1 hora (ISR); se a API falhar, devolve os dados locais de fallback.
 */
export const getGitHubData = cache(async (): Promise<GitHubData> => {
  if (!siteConfig.features.githubLive) return fallbackData();
  try {
    return await fetchLive();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[github] usando fallback:", error instanceof Error ? error.message : error);
    }
    return fallbackData();
  }
});
