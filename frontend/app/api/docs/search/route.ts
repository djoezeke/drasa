import { source } from "@/lib/docs";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source, {
    language: "english",
});