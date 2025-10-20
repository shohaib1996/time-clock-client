// types/timeLog.ts
export interface TimeLog {
  _id: string;
  employee: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  payAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeLogResponse {
  success: boolean;
  message: string;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  totalLogs: number;
  logs: TimeLog[];
}
