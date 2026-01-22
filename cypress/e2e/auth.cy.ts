describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should register a new user', () => {
    cy.visit('/register');

    // Mock que incluye token y user para que el authStore funcione
    cy.intercept('POST', '**/api/auth/register', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@test.com'
        },
        token: 'fake-jwt-token'
      }
    }).as('register');

    cy.get('[data-cy=name-input]').type('John Doe');
    cy.get('[data-cy=email-input]').type('john@test.com');
    cy.get('[data-cy=password-input]').type('testing1H!');
    cy.get('[data-cy=confirm-password-input]').type('testing1H!');

    cy.get('[data-cy=register-submit]').click();

    cy.wait('@register');
    cy.url().should('include', '/login');
  });

  it('should login existing user', () => {
    cy.visit('/login');

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@test.com'
        },
        token: 'fake-jwt-token'
      }
    }).as('login');

    cy.get('[data-cy=email-input]').type('john@test.com');
    cy.get('[data-cy=password-input]').type('testing1H!');
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@login');
    cy.url().should('include', '/dashboard');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginError');

    cy.get('[data-cy=email-input]').type('wrong@test.com');
    cy.get('[data-cy=password-input]').type('wrongpass');
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@loginError').then((interception) => {
      cy.log('intercept:', JSON.stringify(interception.response, null, 2));
      expect(interception.response.statusCode).to.equal(401);
      expect(interception.response.body).to.have.property('error', 'Invalid credentials');
    });

    cy.get('[data-cy=auth-error]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Invalid credentials');
  });
});