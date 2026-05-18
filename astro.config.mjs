import { defineConfig } from "astro/config";
import { remarkMermaid } from "./src/lib/remark-mermaid.mjs";

export default defineConfig({
  site: process.env.SITE ?? "https://brad-edwards.com",
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-light",
    },
    remarkPlugins: [remarkMermaid],
  },
});
