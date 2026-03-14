import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { Card, Cards } from "fumadocs-ui/components/card";
import { findSiblings } from "fumadocs-core/page-tree";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  PageLastUpdate,
} from "fumadocs-ui/layouts/docs/page";

import { getMDXComponents } from "@/components/docs/mdx";
import { Footer } from "@/components/docs/footer";
import { source } from "@/lib/docs/source";

type PageProps = {
  params: Promise<{ version: string; slug?: string[] }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  // const { body: Mdx, toc, lastModified } = await page.data.load();

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{
        enabled: true,
        component: Footer(),
      }}
      tableOfContent={{
        style: "clerk",
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <EditOnGitHub />
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        {/* {page.data.index ? <DocsCategory url={page.url} /> : null} */}
      </DocsBody>
      {/* {lastModified && <PageLastUpdate date={lastModified} />} */}
    </DocsPage>
  );
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {findSiblings(source.getPageTree(), url).map((item) => {
        if (item.type === "separator") return;
        if (item.type === "folder") {
          if (!item.index) return;
          item = item.index;
        }

        return (
          <Card key={item.url} title={item.name} href={item.url}>
            {item.description}
          </Card>
        );
      })}
    </Cards>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
