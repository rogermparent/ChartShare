describe("CRUD Operations", () => {
  it("shows empty state when no charts exist", () => {
    cy.resetDb();
    cy.visit("/");
    cy.findByText("Select a chart or create a new one").should("be.visible");
    cy.findByText("No charts yet").should("be.visible");
  });

  it("creates a new chart", () => {
    cy.resetDb();
    cy.visit("/");
    cy.fixture("sampleXYChart.json").then((chartData) => {
      cy.findByRole("button", { name: "New" }).click();
      cy.findByRole("form").should("be.visible");

      cy.findByLabelText("Name").type("Test Chart");
      cy.findByLabelText("Description").type("A test chart");
      cy.findByLabelText("Chart Data (JSON)").type(
        JSON.stringify(chartData),
        {
          parseSpecialCharSequences: false,
          delay: 0,
        },
      );

      cy.findByRole("button", { name: "Save" }).click();
      cy.findByRole("heading", { level: 1 }).should("contain", "Test Chart");
    });
  });

  it("displays created chart in sidebar", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.findByRole("complementary", { name: "Charts" }).findByRole("list").should("be.visible");
    cy.findByRole("complementary", { name: "Charts" }).findByRole("list").should("contain", "Sample XY Chart");
  });

  it("selects and renders a chart", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();
    cy.findByRole("heading", { level: 1 }).should("contain", "Sample XY Chart");
    cy.findByRole("region", { name: "Chart" }).should("be.visible");
  });

  it("updates a chart", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();
    cy.findByRole("button", { name: "Edit" }).click();
    cy.findByLabelText("Name").clear().type("Updated Name");
    cy.findByRole("button", { name: "Save" }).click();
    cy.findByRole("heading", { level: 1 }).should("contain", "Updated Name");
  });

  it("deletes a chart", () => {
    cy.loadFixture("single-xy-chart");
    cy.visit("/");
    cy.contains("Sample XY Chart").click();
    cy.findByRole("button", { name: "Edit" }).click();
    cy.findByRole("button", { name: "Delete" }).click();
    cy.findByText("Select a chart or create a new one").should("be.visible");
  });

  it("shows JSON validation error for invalid JSON", () => {
    cy.resetDb();
    cy.visit("/");
    cy.findByRole("button", { name: "New" }).click();
    cy.findByLabelText("Chart Data (JSON)").type("not valid json");
    cy.findByRole("alert").should("be.visible");
    cy.findByRole("button", { name: "Save" }).should("be.disabled");
  });
});
