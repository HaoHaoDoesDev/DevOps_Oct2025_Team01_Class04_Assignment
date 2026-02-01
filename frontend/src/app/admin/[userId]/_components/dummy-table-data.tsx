export type AdminUser = {
  id: string;
  email: string;
  filesUploaded: number;
  status: "active" | "inactive";
};

export const DummyDataADminDashboard: AdminUser[] = [
  {
    id: "USR-001",
    email: "john.doe@example.com",
    filesUploaded: 12,
    status: "active",
  },
  {
    id: "USR-002",
    email: "jane.smith@work.com",
    filesUploaded: 5,
    status: "active",
  },
];
