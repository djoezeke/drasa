// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
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
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../app/docs/index.mdx?collection=docs"), "release-notes.mdx": () => import("../app/docs/release-notes.mdx?collection=docs"), "versioning.mdx": () => import("../app/docs/versioning.mdx?collection=docs"), "about/index.mdx": () => import("../app/docs/about/index.mdx?collection=docs"), }),
};
export default browserCollections;