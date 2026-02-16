describe("Bookmarks", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("creates a group and adds chart to it", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.findByRole("button", { name: "Bookmark" }).click();
    cy.findByRole("dialog", { name: "Bookmark Groups" }).should("be.visible");

    cy.findByLabelText("New group name").type("Favorites");
    cy.findByRole("button", { name: "Add" }).click();

    // Chart should be auto-added to the new group
    cy.findByRole("dialog", { name: "Bookmark Groups" }).should("contain", "Favorites");
  });

  it("toggles chart membership in a group", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.findByRole("button", { name: "Bookmark" }).click();
    cy.findByLabelText("New group name").type("Test Group");
    cy.findByRole("button", { name: "Add" }).click();

    // The checkbox should be checked (auto-added)
    cy.findByRole("checkbox", { name: "Test Group" }).should("be.checked");

    // Uncheck to remove
    cy.findByRole("checkbox", { name: "Test Group" }).click();
    cy.findByRole("checkbox", { name: "Test Group" }).should("not.be.checked");
  });

  it("exports and imports bookmarks", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.findByRole("button", { name: "Bookmark" }).click();
    cy.findByLabelText("New group name").type("Export Group");
    cy.findByRole("button", { name: "Add" }).click();

    // Export
    cy.findByRole("button", { name: "Export" }).click();

    // Import
    cy.findByRole("button", { name: "Import" }).click();
    cy.findByLabelText("Import data").should("be.visible");

    const importData = JSON.stringify({
      groups: [{ id: "test-id", name: "Imported Group", chartIds: [1] }],
    });
    cy.findByLabelText("Import data").type(importData, {
      parseSpecialCharSequences: false,
      delay: 0,
    });
    cy.findByRole("button", { name: "Apply Import" }).click();
    cy.findByRole("dialog", { name: "Bookmark Groups" }).should(
      "contain",
      "Imported Group",
    );
  });

  it("deletes a bookmark group", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();

    cy.findByRole("button", { name: "Bookmark" }).click();
    cy.findByLabelText("New group name").type("To Delete");
    cy.findByRole("button", { name: "Add" }).click();
    cy.findByRole("dialog", { name: "Bookmark Groups" }).should("contain", "To Delete");

    cy.findByRole("dialog", { name: "Bookmark Groups" }).contains("Delete").click();
    cy.findByRole("dialog", { name: "Bookmark Groups" }).should(
      "not.contain",
      "To Delete",
    );
  });
});
