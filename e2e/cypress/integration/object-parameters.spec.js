/// <reference types="cypress" />

import Stubs from "../support/stubs"

context('Object parameters', () => {
  beforeEach(() => {
    let geolocation;
    cy.fixture('geolocation.json').then((geo) => {
      geolocation = geo
    })

    cy.intercept('GET', '**/sockjs-node/info**').as('sockjs-node');

    // visit site with substituted fixed geolocation
    cy.visit('/', {
      onBeforeLoad(win) {
        Stubs.stubGeolocation(win, geolocation)
      }
    })
    .wait('@sockjs-node')
  })

  describe('All parameters with main object', () => {
    let parameters;
    before(() => {
      cy.request('http://localhost:9000/api/object-params').then((response) => {
        parameters = response.body
      })
    })

    it('searches with all parameters (keys & values)', () => {
      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      // distance
      cy.get('[data-cy=main-distance-input]').focus().type("{selectall}").type(200)

      for (let key of parameters) {
        cy.get('[data-cy=parameter-key-mainObject-0]')
          .select(key.name)

        for (let value of key.values) {
          cy.get('[data-cy=parameter-value-mainObject-0]')
            .select(value.name)

          cy.get('[data-cy=submit]')
            .click()
            .wait('@locationSearch').then((interception) => {
              console.log(key.name, value.name, interception.response.body)
              cy.wait(1000)
            })
        }
      }
    })
  })
})