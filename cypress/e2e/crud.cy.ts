describe("CRUD Operations", () => {
  beforeEach(() => {
    cy.deleteAllCharts();
    cy.visit("/");
  });

  it("shows empty state when no charts exist", () => {
    cy.get('[data-testid="empty-state"]').should("be.visible");
    cy.get('[data-testid="sidebar-empty"]').should("be.visible");
  });

  it("creates a new chart", () => {
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-form"]').should("be.visible");

      cy.get('[data-testid="chart-name-input"]').type("Test Chart");
      cy.get('[data-testid="chart-description-input"]').type("A test chart");
      cy.get('[data-testid="chart-data-input"]').type(JSON.stringify(chartData), {
        parseSpecialCharSequences: false,
        delay: 0,
      });

      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should("contain", "Test Chart");
    });
  });

  it("displays created chart in sidebar", () => {
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.createChart("Sidebar Chart", "desc", JSON.stringify(chartData));
      cy.visit("/");
      cy.get('[data-testid="chart-list"]').should("be.visible");
      cy.get('[data-testid="chart-list"]').should("contain", "Sidebar Chart");
    });
  });

  it("selects and renders a chart", () => {
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.createChart("Render Chart", "description", JSON.stringify(chartData));
      cy.visit("/");
      cy.contains("Render Chart").click();
      cy.get('[data-testid="chart-title"]').should("contain", "Render Chart");
      cy.get('[data-testid="chart-container"]').should("be.visible");
    });
  });

  it("updates a chart", () => {
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.createChart("Original Name", "orig desc", JSON.stringify(chartData));
      cy.visit("/");
      cy.contains("Original Name").click();
      cy.get('[data-testid="edit-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').clear().type("Updated Name");
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should("contain", "Updated Name");
    });
  });

  it("deletes a chart", () => {
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.createChart("Delete Me", "to be deleted", JSON.stringify(chartData));
      cy.visit("/");
      cy.contains("Delete Me").click();
      cy.get('[data-testid="edit-chart-btn"]').click();
      cy.get('[data-testid="delete-chart-btn"]').click();
      cy.get('[data-testid="empty-state"]').should("be.visible");
    });
  });

  it("shows JSON validation error for invalid JSON", () => {
    cy.get('[data-testid="new-chart-btn"]').click();
    cy.get('[data-testid="chart-data-input"]').type("not valid json");
    cy.get('[data-testid="json-error"]').should("be.visible");
    cy.get('[data-testid="save-chart-btn"]').should("be.disabled");
  });
});
