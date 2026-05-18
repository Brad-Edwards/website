import { getCollection } from "astro:content";
import { existsSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const postsDir = fileURLToPath(new URL("../content/posts", import.meta.url));

function hasPostFiles(dir: string): boolean {
  if (!existsSync(dir)) return false;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && hasPostFiles(path)) return true;
    if (entry.isFile() && [".md", ".mdx"].includes(extname(entry.name))) return true;
  }

  return false;
}

export async function getPublishedPosts() {
  if (!hasPostFiles(postsDir)) return [];

  const entries = await getCollection("posts", ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function groupByTag(entries: Awaited<ReturnType<typeof getPublishedPosts>>) {
  const tags = new Map<string, typeof entries>();

  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      const list = tags.get(tag) ?? [];
      list.push(entry);
      tags.set(tag, list);
    }
  }

  return [...tags.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function groupByCollection(
  entries: Awaited<ReturnType<typeof getPublishedPosts>>,
) {
  const collections = new Map<string, typeof entries>();

  for (const entry of entries) {
    const list = collections.get(entry.data.collection) ?? [];
    list.push(entry);
    collections.set(entry.data.collection, list);
  }

  return [...collections.entries()].sort(([a], [b]) => a.localeCompare(b));
}
