export type DomainStatus = "pending" | "verified" | "rejected";

export interface Domain {
  id: string;
  domain: string;
  isActive: boolean;
  status: DomainStatus;
  createdDate: number;
  updatedDate?: number;
}
