/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void;
      createProject(name: string, description?: string): void;
      drag(targetSelector: string): void;
    }
  }
}

export {};
