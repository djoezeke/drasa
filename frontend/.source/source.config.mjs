// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
var docs = defineDocs({
  dir: "app/docs"
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  },
  plugins: [
    lastModified()
  ]
});
export {
  source_config_default as default,
  docs
};
