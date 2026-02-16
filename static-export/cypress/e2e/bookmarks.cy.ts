describe("Bookmarks", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("creates a group and adds chart to it", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.get('[data-testid="bookmark-btn"]').click();
    cy.get('[data-testid="bookmark-dropdown"]').should("be.visible");

    cy.get('[data-testid="new-group-input"]').type("Favorites");
    cy.get('[data-testid="add-group-btn"]').click();

    // Chart should be auto-added to the new group
    cy.get('[data-testid="bookmark-dropdown"]').should("contain", "Favorites");
  });

  it("toggles chart membership in a group", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.get('[data-testid="bookmark-btn"]').click();
    cy.get('[data-testid="new-group-input"]').type("Test Group");
    cy.get('[data-testid="add-group-btn"]').click();

    // The checkbox should be checked (auto-added)
    cy.get('[data-testid="bookmark-dropdown"] input[type="checkbox"]')
      .first()
      .should("be.checked");

    // Uncheck to remove
    cy.get('[data-testid="bookmark-dropdown"] input[type="checkbox"]')
      .first()
      .click();
    cy.get('[data-testid="bookmark-dropdown"] input[type="checkbox"]')
      .first()
      .should("not.be.checked");
  });

  it("exports and imports bookmarks", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.get('[data-testid="bookmark-btn"]').click();
    cy.get('[data-testid="new-group-input"]').type("Export Group");
    cy.get('[data-testid="add-group-btn"]').click();

    // Export
    cy.get('[data-testid="export-bookmarks-btn"]').click();

    // Import
    cy.get('[data-testid="import-bookmarks-btn"]').click();
    cy.get('[data-testid="import-textarea"]').should("be.visible");

    const importData = JSON.stringify({
      groups: [{ id: "test-id", name: "Imported Group", chartIds: [1] }],
    });
    cy.get('[data-testid="import-textarea"]').type(importData, {
      parseSpecialCharSequences: false,
      delay: 0,
    });
    cy.get('[data-testid="confirm-import-btn"]').click();
    cy.get('[data-testid="bookmark-dropdown"]').should(
      "contain",
      "Imported Group",
    );
  });

  it("deletes a bookmark group", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.get('[data-testid="bookmark-btn"]').click();
    cy.get('[data-testid="new-group-input"]').type("To Delete");
    cy.get('[data-testid="add-group-btn"]').click();
    cy.get('[data-testid="bookmark-dropdown"]').should("contain", "To Delete");

    cy.get('[data-testid="bookmark-dropdown"] button')
      .contains("Delete")
      .click();
    cy.get('[data-testid="bookmark-dropdown"]').should(
      "not.contain",
      "To Delete",
    );
  });
});
