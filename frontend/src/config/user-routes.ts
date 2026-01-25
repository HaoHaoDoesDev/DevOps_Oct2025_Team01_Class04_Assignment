const userRoutes = {
  landing: "/",
  authentication: "/authentication",
  documentation: "/documentation",
  developers: "/developers",
  services: "/services",

  //Admin Routes
  adminDashboard: (userId: number) => `/${encodeURIComponent(userId)}`,
};
export default userRoutes;
