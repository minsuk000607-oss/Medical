import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAllDocuments, getDocumentBySlug } from "@/lib/documents";
import { getGeneratedInsight } from "@/lib/generated";
import { GeneratedInsightBlock } from "@/components/wiki/GeneratedInsightBlock";
import { GenerateInsightButton } from "@/components/wiki/GenerateInsightButton";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllDocuments().map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function WikiPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);

  if (!doc) {
    notFound();
  }

  const insight = getGeneratedInsight(doc.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-gray-500">{doc.category}</p>
      <h1 className="mt-2 text-3xl font-bold">{doc.title}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {doc.tags.map((tag) => (
          <span key={tag} className="rounded-full border px-3 py-1 text-xs">
            {tag}
          </span>
        ))}
      </div>

      <GenerateInsightButton documentId={doc.id} />

      <article className="prose prose-neutral mt-8 max-w-none">
        <ReactMarkdown>{doc.content}</ReactMarkdown>
      </article>

      <GeneratedInsightBlock insight={insight} />
    </main>
  );
}
