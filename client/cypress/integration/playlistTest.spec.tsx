import "@testing-library/cypress";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log({ err });
  return false;
});

beforeEach(() => {
  cy.restoreLocalStorageCache();
});

afterEach(() => {
  cy.saveLocalStorageCache();
});

describe("Playlist actions", () => {
  sessionStorage.setItem("guestSignedIn", "0");

  it("creates a playlist", () => {
    cy.visit("http://localhost:4000/");
    cy.contains("Continue").click();
    cy.findByPlaceholderText("Search for a song").type("test");

    cy.dragAndDrop(
      '[data-rbd-drag-handle-draggable-id="https://i.scdn.co/image/ab67616d0000b27360ba1d6104d0475c7555a6b2TEST DRIVE"]',
      '[data-rbd-droppable-id="createPlaylist"]'
    );

    cy.findByPlaceholderText("New Playlist").type("Playlist 1");

    cy.findByText("Save Playlist").click();
    cy.findByText("Playlist was created succesfully");
    cy.findByText("Your Playlists").click();

    cy.findByText("Playlist 1");
  });

  it("Lets you edit a playlist", () => {
    cy.findByText("Edit").click();
    cy.findByPlaceholderText("New Playlist").clear().type("Playlist 2");

    cy.findByText("Save Playlist").click();
    cy.findByText("Playlist was created succesfully");
    cy.findByText("Your Playlists").click();

    cy.findByText("Playlist 2");
    cy.findByText("Playlist 1").should("not.exist");
  });

  it("Lets you delete a playlist", () => {
    cy.findByText("Delete").click();
    cy.findByText("Playlist 2").should("not.exist");
  });
});
