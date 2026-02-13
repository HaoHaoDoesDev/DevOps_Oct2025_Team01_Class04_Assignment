describe('End-to-End User Lifecycle Flow', () => {

  const adminEmail = Cypress.env('ADMIN_EMAIL');
  const adminPassword = Cypress.env('ADMIN_PASSWORD');
  
  const userPassword = Cypress.env('TEST_USER_PASSWORD');
  const userEmail = `student_${Date.now()}@np.edu.sg`; 

  // --------------------------------------------
  // 1️ Admin Login, Create Student and Logout
  // --------------------------------------------
  it('Admin creates a new student account', () => {

    cy.visit('http://localhost:3000/authentication');

    // Login as Admin
    cy.get('input[name="email"]').type(adminEmail);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/admin');
    cy.contains('User Management');

    // Create New Student
    cy.contains('Add User').click();
    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword);
    cy.get('button[role="combobox"]').click();
    cy.contains('[role="option"]', 'User').click();
    cy.get('button[type="submit"]').click();

    cy.contains('User created successfully').should('be.visible');

    cy.contains('Logout').click();
    cy.url().should('include', '/authentication');
  });

  // --------------------------------------------
  // 2️ User Login
  // --------------------------------------------
  it('New student logs in successfully', () => {

    cy.visit('http://localhost:3000/authentication');

    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/user');
    cy.contains('My Pictures').should('be.visible');
  });

  // --------------------------------------------
  // 3️ User Upload File
  // --------------------------------------------
  it('User uploads a file', () => {

    cy.visit('http://localhost:3000/authentication');

    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword);
    cy.get('button[type="submit"]').click();

    cy.get('input[type="file"]').selectFile(
      'cypress/fixtures/testfile.txt',
      { force: true }
    );

    cy.contains('Upload 1 file').click();
    cy.contains('uploaded').should('be.visible');
    cy.contains('testfile.txt').should('exist');
  });

  // -------------------------------------------------
  // 4 User Download File
  // -------------------------------------------------
  it('User downloads their file', () => {

    cy.visit('http://localhost:3000/authentication');

    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword);
    cy.get('button[type="submit"]').click();

    cy.contains('testfile.txt', { timeout: 10000 }).should('be.visible');

    cy.contains('testfile.txt')
      .closest('div.group')
      .as('firstImage');

    cy.get('@firstImage')
      .find('button[aria-label="Download image"]', { timeout: 10000 })
      .click();

    cy.contains('Download started').should('be.visible');
  });

  // -------------------------------------------------
  // 5 User Deletes File and Logout
  // -------------------------------------------------
  it('User deletes an image', () => {

    cy.visit('http://localhost:3000/authentication');

    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword);
    cy.get('button[type="submit"]').click();

    cy.contains('testfile.txt', { timeout: 10000 }).should('be.visible');

    cy.contains('testfile.txt')
      .closest('div.group')
      .as('firstImage');

    cy.get('@firstImage')
      .find('button[aria-label="Delete image"]')
      .click();

    cy.get('button').contains('Delete').click();

    cy.contains('testfile.txt').should('not.exist');

    cy.contains('Logout').click();
    cy.url().should('include', '/authentication');
  });

  // --------------------------------------------------
  // 6 Admin deletes that user
  // --------------------------------------------------
  it('Admin deletes the created user', () => {

    cy.visit('http://localhost:3000/authentication');

    cy.get('input[name="email"]').type(adminEmail);
    cy.get('input[name="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();

    cy.contains('td', userEmail)
      .parent('tr')
      .as('userRow');

    cy.get('@userRow')
      .find('button[data-slot="dropdown-menu-trigger"]')
      .click();

    cy.contains('div[role="menuitem"]', 'Delete User')
      .click();

    cy.contains(userEmail).should('not.exist');

    cy.contains('Logout').click();
  });

});