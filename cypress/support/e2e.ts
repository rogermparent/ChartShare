declare global {
  namespace Cypress {
    interface Chainable {
      createChart(name: string, description: string, chartData: string): Chainable<Response<unknown>>;
      deleteAllCharts(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("createChart", (name: string, description: string, chartData: string) => {
  return cy.request("POST", "/api/charts", { name, description, chartData });
});

Cypress.Commands.add("deleteAllCharts", () => {
  cy.request("GET", "/api/charts").then((res) => {
    const charts = res.body as { id: number }[];
    charts.forEach((chart) => {
      cy.request("DELETE", `/api/charts/${chart.id}`);
    });
  });
});

export {};
