import { api } from "./axios";

// ---------- AUTH ----------
export const AuthAPI = {
  loginEmployee: (data: { email: string; password: string }) =>
    api.post("/auth/employee", data),

  loginAdmin: (data: { email: string; password: string }) =>
    api.post("/auth/admin", data),

  registerAdmin: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post("/auth/register-admin", data),
  chanagePassword: (data: {userId: string, oldPassword: string, newPassword: string}) => api.post("/auth/change-password", data)
};

// ---------- EMPLOYEES ----------
export const EmployeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: {
    name: string;
    email: string;
    password?: string;
    hourlyRate: number;
  }) => api.post("/employees", data),
  update: (id: string, data: Partial<{ name: string; email: string; password: string; hourlyRate: number }>) =>
    api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
  getProfile: (employeeId: string) => api.get(`/employees/profile/${employeeId}`),
};

// ---------- PAYMENTS ----------
export const PaymentAPI = {
  create: (data: {
    employeeId: string;
    periodStart: string;
    periodEnd: string;
  }) => api.post("/payments", data),
  getMine: (employeeId: string) => api.get(`/payments/mine/${employeeId}`),
  getUnpaid: (params: {
    employeeId: string;
    startDate: string;
    endDate: string;
  }) => api.get("/payments/unpaid", { params }),
};

// ---------- TIME LOGS ----------
export const TimeAPI = {
  clockIn: (employeeId: string, password: string) => api.post("/time/clock-in", { employeeId, password }),
  clockOut: (employeeId: string, password: string) => api.post("/time/clock-out", { employeeId, password }),
  getLogs: (employeeId: string) => api.get(`/time/${employeeId}`),
};

// ---------- DASHBOARD ----------
export const DashboardAPI = {
  getAll: () => api.get("/dashboard"),
  getEmployeeDashboard: (employeeId: string) => api.get(`/employees/dashboard/${employeeId}`)
};
