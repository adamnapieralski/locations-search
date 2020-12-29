/// <reference types="cypress" />

import Stubs from "../support/stubs"

context('Location search', () => {
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

  describe('Main object only, single parameter, normal distance', () => {
    it('Close schools', () => {
      cy.fixture('geojson-responses/schools-1.json').as('geoResponse')

      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('school')

      cy.get('[data-cy=main-distance-input]')
        .clear()
        .type(500)
      
      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').should('deep.equal', interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  });

  describe('Main object only, single parameter, time reach distance', () => {
    it('Close parkings', () => {
      cy.fixture('geojson-responses/parkings-1.json').as('geoResponse')

      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('parking')

      cy.get('[data-cy=time-reach-checkbox]').check()

      cy.get('[data-cy=main-distance-input]')
        .clear()
        .type(60)
      
      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').should('deep.equal', interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })
  
  // TODO after adding more easily overlapping parameters
  describe('Main object only, multiple parameters', () => {
    it('', () => {
    })
  })

  describe('Main and relative object, normal distance', () => {
    it('Restaurants near parks', () => {
      cy.fixture('geojson-responses/restaurants-1.json').as('geoResponse')

      // main object params
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('restaurant')

      cy.get('[data-cy=main-distance-input]')
        .clear()
        .type(20000)

      // apply relative object
      cy.get('[data-cy=relative-object-checkbox]').check()

      // relative object params
      cy.get('[data-cy=parameter-key-relativeObject-0]')
        .select('leisure')

      cy.get('[data-cy=parameter-value-relativeObject-0]')
        .select('park')

      cy.get('[data-cy=relative-distance-input]')
      .clear()
      .type(100)
      
      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').should('deep.equal', interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })

  describe('Main and relative object, time reach distance', () => {
    it('Restaurants near parks', () => {
      cy.fixture('geojson-responses/swimming-pools-1.json').as('geoResponse')

      // main object params
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('leisure')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('swimming_pool')

      // time reach on
      cy.get('[data-cy=time-reach-checkbox]').check()

      // main object distance
      cy.get('[data-cy=main-distance-input]')
        .clear()
        .type(60 * 60 * 3)

      // apply relative object
      cy.get('[data-cy=relative-object-checkbox]').check()

      // relative object params
      cy.get('[data-cy=parameter-key-relativeObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-relativeObject-0]')
        .select('fuel')

      cy.get('[data-cy=relative-distance-input]')
      .clear()
      .type(1000)
      
      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch', { timeout: 30000 }).then((interception) => {
          cy.get('@geoResponse').should('deep.equal', interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })
})
