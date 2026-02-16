describe("Fixture Generation", () => {
  it("generates empty.db fixture", () => {
    cy.task("generateEmptyDb");
    cy.openDb();
    cy.visit("/");
    cy.saveFixture("empty");
  });

  it("generates single-xy-chart.db fixture", () => {
    cy.loadFixture("empty");
    cy.visit("/");

    cy.fixture("sampleXYChart.json").then((chartData) => {
      // Create one chart via UI
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("Sample XY Chart");
      cy.get('[data-testid="chart-description-input"]').type(
        "A sample line chart",
      );
      cy.get('[data-testid="chart-data-input"]').type(
        JSON.stringify(chartData),
        {
          parseSpecialCharSequences: false,
          delay: 0,
        },
      );
      cy.get('[data-testid="save-chart-btn"]').click();

      // Wait for save to complete
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Sample XY Chart",
      );

      // Save the database
      cy.saveFixture("single-xy-chart");
    });
  });

  it("generates multiple-charts.db fixture", () => {
    cy.loadFixture("empty");
    cy.visit("/");

    // Create XY chart
    cy.fixture("sampleXYChart.json").then((xyChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("XY Line Chart");
      cy.get('[data-testid="chart-description-input"]').type(
        "Line chart with multiple series",
      );
      cy.get('[data-testid="chart-data-input"]').type(JSON.stringify(xyChart), {
        parseSpecialCharSequences: false,
        delay: 0,
      });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should("contain", "XY Line Chart");
    });

    // Create Pie chart
    cy.fixture("samplePieChart.json").then((pieChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("Pie Distribution");
      cy.get('[data-testid="chart-description-input"]').type(
        "Distribution pie chart",
      );
      cy.get('[data-testid="chart-data-input"]')
        .clear()
        .type(JSON.stringify(pieChart), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Pie Distribution",
      );
    });

    // Create Legend chart
    cy.fixture("sampleLegendBulletsChart.json").then((legendChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("Chart with Legend");
      cy.get('[data-testid="chart-description-input"]').type(
        "Example with legend and bullets",
      );
      cy.get('[data-testid="chart-data-input"]')
        .clear()
        .type(JSON.stringify(legendChart), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Chart with Legend",
      );
    });

    // Save the database
    cy.saveFixture("multiple-charts");
  });

  it("generates all-charts.db fixture", () => {
    cy.loadFixture("empty");
    cy.visit("/");

    // Create XY chart
    cy.fixture("sampleXYChart.json").then((xyChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("XY Line Chart");
      cy.get('[data-testid="chart-description-input"]').type(
        "Line chart with multiple series",
      );
      cy.get('[data-testid="chart-data-input"]').type(JSON.stringify(xyChart), {
        parseSpecialCharSequences: false,
        delay: 0,
      });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should("contain", "XY Line Chart");
    });

    // Create Pie chart
    cy.fixture("samplePieChart.json").then((pieChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("Pie Distribution");
      cy.get('[data-testid="chart-description-input"]').type(
        "Distribution pie chart",
      );
      cy.get('[data-testid="chart-data-input"]')
        .clear()
        .type(JSON.stringify(pieChart), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Pie Distribution",
      );
    });

    // Create Legend and Bullets chart
    cy.fixture("sampleLegendBulletsChart.json").then((legendChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type(
        "Chart with Legend and Bullets",
      );
      cy.get('[data-testid="chart-description-input"]').type(
        "Example with legend and bullets",
      );
      cy.get('[data-testid="chart-data-input"]')
        .clear()
        .type(JSON.stringify(legendChart), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Chart with Legend and Bullets",
      );
    });

    // Create Axis chart
    cy.fixture("sampleAxisRangesChart.json").then((legendChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type("Chart with Axis Ranges");
      cy.get('[data-testid="chart-description-input"]').type(
        "Example with Axis Ranges",
      );
      cy.get('[data-testid="chart-data-input"]')
        .clear()
        .type(JSON.stringify(legendChart), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Chart with Axis Ranges",
      );
    });

    // Create FillStroke chart
    cy.fixture("sampleFillStrokeChart.json").then((legendChart) => {
      cy.get('[data-testid="new-chart-btn"]').click();
      cy.get('[data-testid="chart-name-input"]').type(
        "Chart with Fill and Stroke",
      );
      cy.get('[data-testid="chart-description-input"]').type(
        "Example with Fill and Stroke defined",
      );
      cy.get('[data-testid="chart-data-input"]')
        .clear()
        .type(JSON.stringify(legendChart), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
      cy.get('[data-testid="save-chart-btn"]').click();
      cy.get('[data-testid="chart-title"]').should(
        "contain",
        "Chart with Fill and Stroke",
      );
    });

    // Save the database
    cy.saveFixture("all-charts");
  });
});
