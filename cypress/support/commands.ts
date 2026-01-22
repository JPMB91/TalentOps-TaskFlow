/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createProject(name: string, description?: string): Chainable<void>;
      drag(targetSelector: string): Chainable<void>;
    }
  }
}

// Cypress.Commands.add('login', (email: string, password: string) => {
//   cy.session([email, password], () => {
//     cy.visit('/login');
//     cy.get('[data-cy=email-input]').type(email);
//     cy.get('[data-cy=password-input]').type(password);
//     cy.get('[data-cy=login-submit]').click();
//     cy.url().should('include', '/dashboard');
//   });
// });

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 'user-1',
          email,
          name: 'John Doe',
        },
      },
    }).as('loginRequest');

    cy.visit('/login');

    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@loginRequest');

    cy.window().then(win => {
      win.localStorage.setItem('auth-token', 'fake-jwt-token');
    });

    cy.url({ timeout: 10000 }).should('include', '/dashboard');
  });
});

Cypress.Commands.add('createProject', (name: string, description = '') => {
  cy.get('[data-cy=create-project-btn]').click();
  cy.get('[data-cy=project-name]').type(name);
  if (description) {
    cy.get('[data-cy=project-description]').type(description);
  }
  cy.get('[data-cy=submit-project]').click();
  cy.contains(name).should('be.visible');
});

Cypress.Commands.add(
  'drag',
  { prevSubject: 'element' },
  (subject, targetSelector: string) => {
    const dataTransfer = new DataTransfer();
    cy.wrap(subject).trigger('dragstart', { dataTransfer });
    cy.get(targetSelector).trigger('drop', { dataTransfer });
    cy.wrap(subject).trigger('dragend', { dataTransfer });
  }
);

export {};