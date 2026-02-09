const userRoutes = {
  landing: "/",
  authentication: "/authentication",
  documentation: "/documentation",
  developers: "/developers",
  services: "/services",

  // Admin Routes
  adminDashboard: (userId: number) => `/admin/${encodeURIComponent(userId)}`,

  // User Routes
  userDashboard: (userId: number) => `/user/${encodeURIComponent(userId)}`,
};
export default userRoutes;
