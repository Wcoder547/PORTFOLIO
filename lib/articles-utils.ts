export function calcReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export function extractTOC(content: string): { id: string; title: string }[] {
  const lines = content.split("\n");
  const toc: { id: string; title: string }[] = [];

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    const match = h2 || h3;
    if (match) {
      const title = match[1].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      toc.push({ id, title });
    }
  }
  return toc;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
