import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpen, Github } from "lucide-react";
import Link from "next/link";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <span>Drasa Docs</span>,
    },
    links: [
      {
        type: "main",
        text: "Documentation",
        url: "/docs",
      },
      {
        type: "icon",
        icon: <Github className="size-4" />,
        text: "GitHub",
        url: "https://github.com",
        external: true,
      },
    ],
    searchToggle: {
      enabled: true,
    },
    themeSwitch: {
      enabled: true,
      mode: "light-dark-system",
    },
  };
}
