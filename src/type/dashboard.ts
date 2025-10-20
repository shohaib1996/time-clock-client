// ✅ Individual chart item types
export interface EmployeeStatusChartItem {
  name: string; // e.g. "Clocked In" | "Clocked Out"
  value: number;
}

export interface MonthlyPaymentsChartItem {
  _id: number; // month number (e.g. 10 for October)
  totalAmount: number;
}

export interface RecentHoursChartItem {
  _id: string; // date string e.g. "2025-10-20"
  totalHours: number;
}

export interface TopPaidEmployeeChartItem {
  name: string;
  totalAmount: number;
}

// ✅ Chart container
export interface DashboardCharts {
  employeeStatusChart: EmployeeStatusChartItem[];
  monthlyPaymentsChart: MonthlyPaymentsChartItem[];
  recentHoursChart: RecentHoursChartItem[];
  topPaidEmployeesChart: TopPaidEmployeeChartItem[];
}

// ✅ Stats container
export interface DashboardStats {
  totalEmployees: number
  totalActiveEmployees: number;
  employeesClockedIn: number;
  totalHoursThisMonth: number;
  totalPaymentsThisMonth: number;
  totalPendingPayments: number;
  newEmployeesThisMonth: number;
}

// ✅ Final response type
export interface DashboardResponse {
  stats: DashboardStats;
  charts: DashboardCharts;
}
