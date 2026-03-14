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
  docs: create.doc("docs", {"(drasa)/index.mdx": () => import("../content/docs/(drasa)/index.mdx?collection=docs"), "(drasa)/release-notes.mdx": () => import("../content/docs/(drasa)/release-notes.mdx?collection=docs"), "(drasa)/versioning.mdx": () => import("../content/docs/(drasa)/versioning.mdx?collection=docs"), "about/index.mdx": () => import("../content/docs/about/index.mdx?collection=docs"), "ui/index.mdx": () => import("../content/docs/ui/index.mdx?collection=docs"), }),
};
export default browserCollections;