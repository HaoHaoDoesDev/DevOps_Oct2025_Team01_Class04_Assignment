module.exports = {
  allowCypressEnv: false,

  e2e: {
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },

  env: {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
},
};
