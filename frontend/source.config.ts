import { defineCollections, defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from 'fumadocs-mdx/plugins/last-modified';

export const docs = defineDocs({
    dir: "app/docs",
});

export default defineConfig({
    mdxOptions: {
        rehypeCodeOptions: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
        },
    },
    plugins: [
        lastModified(),
    ],
});
