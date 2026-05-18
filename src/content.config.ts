import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { existsSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const postsDir = fileURLToPath(new URL("./content/posts", import.meta.url));

function hasPostFiles(dir: string): boolean {
  if (!existsSync(dir)) return false;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && hasPostFiles(path)) return true;
    if (entry.isFile() && [".md", ".mdx"].includes(extname(entry.name))) return true;
  }

  return false;
}

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    collection: z.string().default("notes"),
  }),
});

export const collections = hasPostFiles(postsDir) ? { posts } : {};
