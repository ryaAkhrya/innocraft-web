export type RecruitmentStatus = "open" | "closed";

export interface RecruitmentJob {
  id: string;
  position: string;
  employmentType: string;
  location: string;
  shortDescription: string;
  status: RecruitmentStatus;

  // CMS-driven fields (no more mock data)
  jobDescription: string;
  requirements: string[];
  benefits: string[];
  workLocation: string;
}

export interface RecruitmentModalPayload {
  job: RecruitmentJob;
}