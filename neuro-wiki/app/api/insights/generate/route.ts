import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { getDocumentById } from "@/lib/documents";
import type { StructuredInsight } from "@/types/wiki";

const client = new Anthropic();

const INSIGHTS_DIR = path.join(
  process.cwd(),
  "content",
  "generated",
  "insights"
);

const SYSTEM_PROMPT = `당신은 신경학, 근막, 자율신경계 전문 의료 지식 분석가입니다.
주어진 의학 문서를 분석하여 구조화된 임상 인사이트를 생성합니다.

분석 기준:
- mechanism: 병태생리학적 기전 및 신경생물학적 메커니즘
- clinical_pattern: 임상에서 관찰되는 패턴 및 증상 양상
- ans_pattern: 자율신경계 관련 패턴 (교감/부교감 불균형, HRV 변화 등)
- fascial_relation: 근막 연결성, 텐세그리티, 근막 경선 관련 사항
- differential_points: 유사 질환과의 감별 포인트
- contraindications: 치료 시 금기사항 및 주의해야 할 상황
- research_gaps: 현재 연구에서 부족하거나 추가 연구가 필요한 부분

각 항목은 임상적으로 유의미한 구체적 내용으로 채워주세요.
내용이 없거나 해당 없는 경우 빈 배열로 반환하세요.`;

const insightTool: Anthropic.Tool = {
  name: "generate_structured_insight",
  description:
    "의학 문서에서 구조화된 임상 인사이트를 추출하여 반환합니다.",
  input_schema: {
    type: "object",
    properties: {
      mechanism: {
        type: "array",
        items: { type: "string" },
        description: "병태생리학적 기전 및 메커니즘 목록",
      },
      clinical_pattern: {
        type: "array",
        items: { type: "string" },
        description: "임상 패턴 및 증상 양상 목록",
      },
      ans_pattern: {
        type: "array",
        items: { type: "string" },
        description: "자율신경계 패턴 목록",
      },
      fascial_relation: {
        type: "array",
        items: { type: "string" },
        description: "근막 관계 및 연결성 목록",
      },
      differential_points: {
        type: "array",
        items: { type: "string" },
        description: "감별 진단 포인트 목록",
      },
      contraindications: {
        type: "array",
        items: { type: "string" },
        description: "금기사항 및 주의사항 목록",
      },
      research_gaps: {
        type: "array",
        items: { type: "string" },
        description: "연구 공백 및 추가 연구 필요 사항 목록",
      },
    },
    required: [
      "mechanism",
      "clinical_pattern",
      "ans_pattern",
      "fascial_relation",
      "differential_points",
      "contraindications",
      "research_gaps",
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body as { id: string };

    if (!id) {
      return NextResponse.json(
        { error: "Document id is required" },
        { status: 400 }
      );
    }

    const doc = getDocumentById(id);

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [insightTool],
      tool_choice: { type: "tool", name: "generate_structured_insight" },
      messages: [
        {
          role: "user",
          content: `다음 의학 문서를 분석하여 구조화된 인사이트를 생성해주세요.\n\n제목: ${doc.title}\n카테고리: ${doc.category}\n태그: ${doc.tags.join(", ")}\n\n${doc.content}`,
        },
      ],
    });

    const toolBlock = response.content.find(
      (b) => b.type === "tool_use"
    ) as Anthropic.ToolUseBlock | undefined;

    if (!toolBlock) {
      return NextResponse.json(
        { error: "No tool use block in response" },
        { status: 500 }
      );
    }

    const insight = toolBlock.input as StructuredInsight;

    fs.mkdirSync(INSIGHTS_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(INSIGHTS_DIR, `${id}.insight.json`),
      JSON.stringify(insight, null, 2),
      "utf8"
    );

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
