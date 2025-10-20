export interface Employee {
  _id: string;
  name: string;
  email: string;
  password: string; // (⚠️ optional if not returned from API)
  hourlyRate: number;
  isActive: boolean;
  role: "employee" | "admin"; // or string if roles can vary
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
