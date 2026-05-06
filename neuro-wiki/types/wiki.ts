export type WikiDocument = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
};

export type StructuredInsight = {
  mechanism: string[];
  clinical_pattern: string[];
  ans_pattern: string[];
  fascial_relation: string[];
  differential_points: string[];
  contraindications: string[];
  research_gaps: string[];
};
