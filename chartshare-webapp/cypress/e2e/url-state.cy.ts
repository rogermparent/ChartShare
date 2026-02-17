describe("URL State", () => {
  beforeEach(() => {
    cy.resetDb();
  });

  it("selecting a chart updates the URL", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.contains("XY Line Chart").click();
    cy.url().should("include", "?chart=");
    cy.findByRole("heading", { level: 1 }).should("contain", "XY Line Chart");
  });

  it("refreshing with chart param restores selection", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.contains("Pie Distribution").click();
    cy.url().then((url) => {
      cy.visit(new URL(url).pathname + new URL(url).search);
      cy.findByRole("heading", { level: 1 }).should("contain", "Pie Distribution");
    });
  });

  it("creating a new chart clears param then sets it after save", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();
    cy.url().should("include", "?chart=");

    cy.findByRole("button", { name: "New" }).click();
    cy.url().should("not.include", "?chart=");

    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.findByLabelText("Name").type("New Chart");
      cy.findByLabelText("Chart Data (JSON)").type(
        JSON.stringify(chartData),
        { parseSpecialCharSequences: false, delay: 0 },
      );
      cy.findByRole("button", { name: "Save" }).click();
      cy.findByRole("heading", { level: 1 }).should("contain", "New Chart");
      cy.url().should("include", "?chart=");
    });
  });

  it("deleting a chart clears the param", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();
    cy.url().should("include", "?chart=");

    cy.findByRole("button", { name: "Edit" }).click();
    cy.findByRole("button", { name: "Delete" }).click();
    cy.url().should("not.include", "?chart=");
    cy.findByText("Select a chart or create a new one").should("be.visible");
  });

  it("invalid chart param shows empty state", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/?chart=9999");
    cy.findByText("Select a chart or create a new one").should("be.visible");
  });
});
