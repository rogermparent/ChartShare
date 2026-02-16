describe("Chart Rendering", () => {
  beforeEach(() => {
    cy.resetDb();
  });

  it("renders an XY chart from JSON", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();
    cy.findByRole("region", { name: "Chart" }).should("be.visible");
    cy.findByRole("region", { name: "Chart" }).then(($el) => {
      cy.wrap($el, { timeout: 15000 }).should("contain.html", "canvas");
    });
  });

  it("renders a pie chart from JSON", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.contains("Pie Distribution").click();
    cy.findByRole("region", { name: "Chart" }).should("be.visible");
    cy.findByRole("region", { name: "Chart" }).then(($el) => {
      cy.wrap($el, { timeout: 15000 }).should("contain.html", "canvas");
    });
  });

  it("renders a chart with legend and bullets", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.contains("Chart with Legend").click();
    cy.findByRole("region", { name: "Chart" }).should("be.visible");
    cy.findByRole("region", { name: "Chart" }).then(($el) => {
      cy.wrap($el, { timeout: 15000 }).should("contain.html", "canvas");
    });
  });

  it("shows live preview in chart form", () => {
    cy.fixture("samplePieChart.json").then((chartData) => {
      cy.visit("/");
      cy.findByRole("button", { name: "New" }).click();
      cy.findByLabelText("Name").type("Preview Test");
      cy.findByLabelText("Chart Data (JSON)").type(JSON.stringify(chartData), {
        parseSpecialCharSequences: false,
        delay: 0,
      });
      cy.findByRole("region", { name: "Preview" }).should("be.visible");
    });
  });
});
