export interface Payment {
  _id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}
