// @ts-nocheck
import * as __fd_glob_5 from "../app/docs/about/index.mdx?collection=docs"
import * as __fd_glob_4 from "../app/docs/versioning.mdx?collection=docs"
import * as __fd_glob_3 from "../app/docs/release-notes.mdx?collection=docs"
import * as __fd_glob_2 from "../app/docs/index.mdx?collection=docs"
import { default as __fd_glob_1 } from "../app/docs/about/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../app/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
} & {
  DocData: {
    docs: {
      /**
       * Last modified date of document file, obtained from version control.
       *
       */
      lastModified?: Date;
    },
  }
}>({"doc":{"passthroughs":["extractedReferences","lastModified"]}});

export const docs = await create.docs("docs", "app/docs", {"meta.json": __fd_glob_0, "about/meta.json": __fd_glob_1, }, {"index.mdx": __fd_glob_2, "release-notes.mdx": __fd_glob_3, "versioning.mdx": __fd_glob_4, "about/index.mdx": __fd_glob_5, });