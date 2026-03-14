// @ts-nocheck
import * as __fd_glob_8 from "../content/docs/ui/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/about/index.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/(drasa)/versioning.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/(drasa)/release-notes.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/(drasa)/index.mdx?collection=docs"
import { default as __fd_glob_3 } from "../content/docs/ui/meta.json?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/(drasa)/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/about/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
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

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "about/meta.json": __fd_glob_1, "(drasa)/meta.json": __fd_glob_2, "ui/meta.json": __fd_glob_3, }, {"(drasa)/index.mdx": __fd_glob_4, "(drasa)/release-notes.mdx": __fd_glob_5, "(drasa)/versioning.mdx": __fd_glob_6, "about/index.mdx": __fd_glob_7, "ui/index.mdx": __fd_glob_8, });