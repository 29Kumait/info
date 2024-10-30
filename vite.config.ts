import mdx from "@mdx-js/rollup";
import {vitePlugin as remix} from "@remix-run/dev";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";


export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
      ],
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },

    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: ["@remix-run/*"],
    external: ["node:crypto"],
  },
  optimizeDeps: {
    exclude: ["node:crypto"],
  },
});
