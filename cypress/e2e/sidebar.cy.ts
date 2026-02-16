describe("Sidebar", () => {
  beforeEach(() => {
    cy.deleteAllCharts();
  });

  it("displays multiple charts", () => {
    cy.fixture("sampleXYChart.json").then((xyChart) => {
      cy.fixture("samplePieChart.json").then((pieChart) => {
        cy.fixture("sampleLegendBulletsChart.json").then((legendChart) => {
          cy.createChart("XY Chart", "Line chart with data", JSON.stringify(xyChart));
          cy.createChart("Pie Chart", "Distribution chart", JSON.stringify(pieChart));
          cy.createChart("Legend Chart", "Chart with legend", JSON.stringify(legendChart));

          cy.visit("/");
          cy.get('[data-testid="chart-list"]').should("be.visible");
          cy.get('[data-testid="chart-list"] li').should("have.length", 3);
        });
      });
    });
  });

  it("highlights the selected chart", () => {
    cy.fixture("sampleFillStrokeChart.json").then((fillChart) => {
      cy.fixture("sampleAxisRangesChart.json").then((axisChart) => {
        cy.createChart("Fill Chart", "first", JSON.stringify(fillChart));
        cy.createChart("Axis Chart", "second", JSON.stringify(axisChart));

        cy.visit("/");
        cy.contains("Fill Chart").click();
        cy.contains("Fill Chart")
          .closest("li")
          .should("have.class", "border-l-blue-600");
        cy.contains("Axis Chart")
          .closest("li")
          .should("not.have.class", "border-l-blue-600");
      });
    });
  });

  it("switches between charts", () => {
    cy.fixture("samplePieChart.json").then((pieChart) => {
      cy.fixture("sampleXYChart.json").then((xyChart) => {
        cy.createChart("Pie Display", "first", JSON.stringify(pieChart));
        cy.createChart("XY Display", "second", JSON.stringify(xyChart));

        cy.visit("/");
        cy.contains("Pie Display").click();
        cy.get('[data-testid="chart-title"]').should("contain", "Pie Display");

        cy.contains("XY Display").click();
        cy.get('[data-testid="chart-title"]').should("contain", "XY Display");
      });
    });
  });
});
