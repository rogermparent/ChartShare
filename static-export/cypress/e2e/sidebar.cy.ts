describe("Sidebar", () => {
  beforeEach(() => {
    cy.resetDb();
  });

  it("displays multiple charts", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.get('[data-testid="chart-list"]').should("be.visible");
    cy.get('[data-testid="chart-list"] li').should("have.length", 3);
  });

  it("highlights the selected chart", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.contains("XY Line Chart").click();
    cy.contains("XY Line Chart")
      .closest("li")
      .should("have.class", "border-l-blue-600");
    cy.contains("Pie Distribution")
      .closest("li")
      .should("not.have.class", "border-l-blue-600");
  });

  it("switches between charts", () => {
    cy.loadFixture("multiple-charts");
    cy.visit("/");
    cy.contains("Pie Distribution").click();
    cy.get('[data-testid="chart-title"]').should("contain", "Pie Distribution");

    cy.contains("XY Line Chart").click();
    cy.get('[data-testid="chart-title"]').should("contain", "XY Line Chart");
  });
});
