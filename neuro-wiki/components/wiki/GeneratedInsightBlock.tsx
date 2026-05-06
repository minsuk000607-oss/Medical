import type { StructuredInsight } from "@/lib/generated";

type GeneratedInsightBlockProps = {
  insight: StructuredInsight | null;
};

const labels: Record<keyof StructuredInsight, string> = {
  mechanism: "기전",
  clinical_pattern: "임상 패턴",
  ans_pattern: "자율신경계 패턴",
  fascial_relation: "근막 관계",
  differential_points: "감별 포인트",
  contraindications: "금기 및 주의사항",
  research_gaps: "연구 공백",
};

export function GeneratedInsightBlock({
  insight,
}: GeneratedInsightBlockProps) {
  if (!insight) {
    return null;
  }

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          AI Generated Insight
        </p>
        <h2 className="mt-1 text-xl font-bold">AI 인사이트</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          원문 Markdown을 수정하지 않고 생성된 보조 해석입니다.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {(Object.keys(labels) as Array<keyof StructuredInsight>).map((key) => (
          <div key={key}>
            <h3 className="font-semibold">{labels[key]}</h3>

            {insight[key].length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {insight[key].map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">내용 없음</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
