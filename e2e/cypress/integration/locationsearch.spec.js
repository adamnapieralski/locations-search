/// <reference types="cypress" />

import Stubs from "../support/stubs";

context('Actions', () => {
  beforeEach(() => {
    let geolocation;
    cy.fixture('geolocation.json').then((geo) => {
      geolocation = geo;
    });

    cy.server();
    cy.route('GET', '**/sockjs-node/info**').as('sockjs-node');

    cy.visit('/', {
      onBeforeLoad(win) {
        Stubs.stubGeolocation(win, geolocation)
      }
    })
    .wait('@sockjs-node');

  })
  
  it('Initial test', () => {
    cy.wait(2000);
  })

})
