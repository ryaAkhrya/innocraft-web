export type RecruitmentStatus = "open" | "closed";

export type RecruitmentEmploymentType =
  | "Part-time"
  | "Full-time"
  | "Contract"
  | "Internship";

export type RecruitmentWorkLocation =
  | "Jakarta"
  | "Bandung"
  | "Yogyakarta"
  | "Surabaya"
  | "Remote";

export interface RecruitmentJob {
  id: string;
  position: string;
  employmentType: RecruitmentEmploymentType;
  location: RecruitmentWorkLocation;
  shortDescription: string;
  status: RecruitmentStatus;

  jobDescription: string;
  requirements: string[];
  benefits: string[];
  workLocation: string;
}

export interface RecruitmentModalPayload {
  job: RecruitmentJob;
}

