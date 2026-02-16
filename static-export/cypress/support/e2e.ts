const INVALIDATE_URL = "http://localhost:3000/api/test-invalidate-cache";

declare global {
  namespace Cypress {
    interface Chainable {
      closeDb(): Chainable<void>;
      openDb(): Chainable<void>;
      resetDb(): Chainable<void>;
      loadFixture(fixtureName: string): Chainable<void>;
      saveFixture(fixtureName: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("closeDb", () => {
  cy.request(`${INVALIDATE_URL}?action=close`);
});

Cypress.Commands.add("openDb", () => {
  cy.request(INVALIDATE_URL);
});

Cypress.Commands.add("resetDb", () => {
  cy.closeDb();
  cy.task("resetDb");
  cy.openDb();
});

Cypress.Commands.add("loadFixture", (fixtureName: string) => {
  cy.closeDb();
  cy.task("loadDbFixture", fixtureName);
  cy.openDb();
});

Cypress.Commands.add("saveFixture", (fixtureName: string) => {
  cy.closeDb();
  cy.task("saveDbFixture", fixtureName);
  cy.openDb();
});

export {};
