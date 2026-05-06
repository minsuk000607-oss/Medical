import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { WikiDocument } from "@/types/wiki";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export function getAllDocuments(): WikiDocument[] {
  const files = fs.readdirSync(DOCS_DIR).filter((file) => file.endsWith(".md"));

  return files.map((file) => {
    const fullPath = path.join(DOCS_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const parsed = matter(raw);

    const slug = file.replace(/\.md$/, "");

    return {
      id: parsed.data.id,
      slug,
      title: parsed.data.title,
      category: parsed.data.category ?? "uncategorized",
      tags: parsed.data.tags ?? [],
      content: parsed.content,
    };
  });
}

export function getDocumentBySlug(slug: string): WikiDocument | null {
  return getAllDocuments().find((doc) => doc.slug === slug) ?? null;
}

export function getDocumentById(id: string): WikiDocument | null {
  return getAllDocuments().find((doc) => doc.id === id) ?? null;
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllDocuments().map((doc) => doc.category)));
}
