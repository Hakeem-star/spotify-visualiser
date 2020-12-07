Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

describe("My First Test", () => {
  it("Does not do much!", () => {
    cy.visit("http://localhost:4000/");

    // cy.contains("Continue").click();
  });
});
