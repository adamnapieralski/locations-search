/// <reference types="cypress" />

import Stubs from "../support/stubs"

context('Location search', () => {
  let geoResponses

  before(() => {
    cy.fixture('geojson-responses.js').then((geoResp) => {
      geoResponses = geoResp
    })
  })

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

  describe('Main object only, normal distance', () => {
    it('Close schools', () => {
      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('school')

      cy.get('[data-cy=main-distance-input]')
        .clear()
        .type(500)

      cy.intercept('POST', '**/api/location-search', (req) => {
        req.reply((res) => {
          expect(res.body).to.deep.equal(geoResponses[0].data)
        })
      })
      
      cy.get('[data-cy=submit]')
        .click()
    })
  });
  


})
