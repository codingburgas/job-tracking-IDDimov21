export interface Application {
  id: number;
  userId: number;
  userName: string;
  jobPostingId: number;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  submittedAt: string;
}

export enum ApplicationStatus {
  Submitted = 'Submitted',
  SelectedForInterview = 'SelectedForInterview',
  Rejected = 'Rejected'
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}