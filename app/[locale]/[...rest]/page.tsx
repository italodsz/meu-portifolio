import { notFound } from "next/navigation";

/** Qualquer rota desconhecida dentro de /pt ou /en cai no not-found localizado. */
export default function CatchAll() {
  notFound();
}
