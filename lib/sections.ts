/** Seções da home, na ordem em que aparecem. Os ids são usados como âncoras. */
export const SECTIONS = [
  { id: "about", key: "about", number: "01" },
  { id: "manifesto", key: "manifesto", number: "02" },
  { id: "projects", key: "projects", number: "03" },
  { id: "stack", key: "stack", number: "04" },
  { id: "github", key: "github", number: "05" },
  { id: "contact", key: "contact", number: "06" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
