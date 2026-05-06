import type { StructuredInsight } from "@/types/wiki";

const labels: Record<keyof StructuredInsight, string> = {
  mechanism: "기전",
  clinical_pattern: "임상 패턴",
  ans_pattern: "자율신경계 패턴",
  fascial_relation: "근막 관계",
  differential_points: "감별 포인트",
  contraindications: "주의 및 금기",
  research_gaps: "연구 공백",
};

type Props = {
  insight: StructuredInsight | null;
};

export function GeneratedInsightBlock({ insight }: Props) {
  if (!insight) {
    return (
      <section className="mt-12 rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">AI 인사이트</h2>
        <p className="mt-3 text-sm text-gray-500">
          아직 생성된 인사이트가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 rounded-2xl border p-6">
      <h2 className="text-xl font-semibold">AI 인사이트</h2>
      <p className="mt-2 text-sm text-gray-500">
        이 영역은 Markdown 원문에서 파생된 AI 생성 레이어입니다.
      </p>

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
