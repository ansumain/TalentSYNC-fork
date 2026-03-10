export interface Candidate {
  userId: string;
  id: string;
  fileName: string | null;
  fileURL: string | null;
  status: string | null;
  parsedJSON: {
    name: string | null;
    email: string | null;
    phone: string | null;
    education: { name: string; batch: string }[];
    skills: string[];
    experience: {
      company: string;
      designation: string;
      startDate: string;
      endDate: string;
      durationMonths: number;
    }[];
    totalExperience: number;
  };
  createdAt: string;
}