describe("Chart Rendering", () => {
  beforeEach(() => {
    cy.deleteAllCharts();
  });

  it("renders an XY chart from JSON", () => {
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.createChart("XY Chart", "test xy", JSON.stringify(chartData));
      cy.visit("/");
      cy.contains("XY Chart").click();
      cy.get('[data-testid="chart-container"]').should("be.visible");
      // AmCharts renders into a canvas element
      cy.get('[data-testid="chart-container"] canvas', { timeout: 15000 }).should("exist");
    });
  });

  it("renders a pie chart from JSON", () => {
    cy.fixture("samplePieChart.json").then((chartData) => {
      cy.createChart("Pie Chart", "test pie", JSON.stringify(chartData));
      cy.visit("/");
      cy.contains("Pie Chart").click();
      cy.get('[data-testid="chart-container"]').should("be.visible");
      cy.get('[data-testid="chart-container"] canvas', { timeout: 15000 }).should("exist");
    });
  });

  it("renders a chart with legend and bullets", () => {
    cy.fixture("sampleLegendBulletsChart.json").then((chartData) => {
      cy.createChart("Legend Chart", "test legend", JSON.stringify(chartData));
      cy.visit("/");
      cy.contains("Legend Chart").click();
      cy.get('[data-testid="chart-container"]').should("be.visible");
      cy.get('[data-testid="chart-container"] canvas', { timeout: 15000 }).should("exist");
    });
  });

  it("shows live preview in chart form", () => {
    cy.fixture("samplePieChart.json").then((chartData) => {
      cy.visit("/");
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("Preview Test");
      cy.get('[data-testid="chart-data-input"]').type(JSON.stringify(chartData), {
        parseSpecialCharSequences: false,
        delay: 0,
      });
      cy.get('[data-testid="chart-preview"]').should("be.visible");
    });
  });
});
