import Link from "next/link";
import { getAllDocuments, getAllCategories } from "@/lib/documents";

export default function HomePage() {
  const docs = getAllDocuments();
  const categories = getAllCategories();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-bold">Neuro Wiki</h1>
      <p className="mt-3 text-gray-500">
        Markdown 기반 신경·근막·자율신경 통합 위키
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">문서 수</p>
          <p className="mt-2 text-3xl font-bold">{docs.length}</p>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">카테고리</p>
          <p className="mt-2 text-3xl font-bold">{categories.length}</p>
        </div>

        <div className="rounded-2xl border p-5">
          <p className="text-sm text-gray-500">Source</p>
          <p className="mt-2 text-3xl font-bold">Markdown</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">문서 목록</h2>

        <div className="mt-4 divide-y rounded-2xl border">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/wiki/${doc.slug}`}
              className="block p-5 hover:bg-gray-50"
            >
              <h3 className="font-medium">{doc.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {doc.category} · {doc.tags.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
