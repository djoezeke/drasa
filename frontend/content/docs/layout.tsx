import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/docs/source";
import { baseOptions } from "@/components/docs/layout";
import { getSection } from "@/lib/docs/section";
import { Header } from "@/components/docs/header";

export default function Layout({ children }: LayoutProps<"/docs/[[..slug]]">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{
        defaultOpenLevel: 1,
        collapsible: true,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;
            const color = `var(--${getSection(meta.path)}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      "--tab-color": color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
      {...baseOptions()}
    >
      <Header />
      {children}
    </DocsLayout>
  );
}
