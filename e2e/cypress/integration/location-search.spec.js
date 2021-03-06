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
    afterEach(() => {
      // wait to see results on map
      cy.wait(2000)
    })

    it('Close schools', () => {
      cy.fixture('geojson-responses/schools-1.json').as('geoResponse')

      // main object
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('school')

      // distance
      cy.get('[data-cy=main-distance-input]').typeDistance(500)

      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').compareResponse(interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  });

  describe('Main object only, single parameter, time reach distance', () => {
    afterEach(() => {
      // wait to see results on map
      cy.wait(2000)
    })

    it('Close supermarkets', () => {
      cy.fixture('geojson-responses/supermarkets-1.json').as('geoResponse')

      // main object
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('shop')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('supermarket')

      // time reach
      cy.get('[data-cy=time-reach-checkbox]').check()
      cy.get('[data-cy=transport-mean').select('driving-car')

      // distance
      cy.get('[data-cy=main-distance-input]').typeDistance(8)

      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').compareResponse(interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })

  describe('Main object only, multiple parameters', () => {
    afterEach(() => {
      // wait to see results on map
      cy.wait(2000)
    })

    it('Alternatives of the same parameter key', () => {
      cy.fixture('geojson-responses/fast-food-post-1.json').as('geoResponse')

      // main object params
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('fast_food')

      cy.get('[data-cy=add-param-button-main]').click()

      cy.get('[data-cy=parameter-key-mainObject-1]')
      .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-1]')
        .select('post_office')

      // distance
      cy.get('[data-cy=main-distance-input]').typeDistance(1234)

      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').compareResponse(interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })

    it('Joined parameters with different keys', () => {
      cy.fixture('geojson-responses/pedestrian-paving-stones-1.json').as('geoResponse')

      // main object params
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('highway')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('pedestrian')

      cy.get('[data-cy=add-param-button-main]').click()

      cy.get('[data-cy=parameter-key-mainObject-1]')
      .select('surface')

      cy.get('[data-cy=parameter-value-mainObject-1]')
        .select('paving_stones')

      // distance
      cy.get('[data-cy=time-reach-checkbox]').check()
      cy.get('[data-cy=transport-mean').select('foot-walking')

      cy.get('[data-cy=main-distance-input]').typeDistance(30)

      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch').then((interception) => {
          cy.get('@geoResponse').compareResponse(interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })

  describe('Main and relative object, normal distance', () => {
    afterEach(() => {
      // wait to see results on map
      cy.wait(2000)
    })

    it('Restaurants near parks', () => {
      cy.fixture('geojson-responses/restaurants-1.json').as('geoResponse')

      // main object params
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('restaurant')

      cy.get('[data-cy=main-distance-input]').typeDistance(20000)

      // apply relative object
      cy.get('[data-cy=relative-object-checkbox]').check()

      // relative object params
      cy.get('[data-cy=parameter-key-relativeObject-0]')
        .select('leisure')

      cy.get('[data-cy=parameter-value-relativeObject-0]')
        .select('park')

      cy.get('[data-cy=relative-distance-input]').typeDistance(100)

      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch', { timeout: 40000 }).then((interception) => {
          cy.get('@geoResponse').compareResponse(interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })

  describe('Main and relative object, time reach distance', () => {
    afterEach(() => {
      // wait to see results on map
      cy.wait(2000)
    })

    it('Restaurants near parks', () => {
      cy.fixture('geojson-responses/swimming-pools-1.json').as('geoResponse')

      // main object params
      cy.get('[data-cy=parameter-key-mainObject-0]')
        .select('leisure')

      cy.get('[data-cy=parameter-value-mainObject-0]')
        .select('swimming_pool')

      // time reach on
      cy.get('[data-cy=time-reach-checkbox]').check()
      cy.get('[data-cy=transport-mean').select('cycling-regular')

      // main object distance
      cy.get('[data-cy=main-distance-input]').typeDistance(30)

      // apply relative object
      cy.get('[data-cy=relative-object-checkbox]').check()

      // relative object params
      cy.get('[data-cy=parameter-key-relativeObject-0]')
        .select('amenity')

      cy.get('[data-cy=parameter-value-relativeObject-0]')
        .select('cafe')

      cy.get('[data-cy=relative-distance-input]').typeDistance(500)

      cy.intercept('POST', '**/api/location-search').as('locationSearch')

      cy.get('[data-cy=submit]')
        .click()
        .wait('@locationSearch', { timeout: 40000 }).then((interception) => {
          cy.get('@geoResponse').compareResponse(interception.response.body)
        })
        .get('@geoResponse').checkPointMarkersCount()
    })
  })
})
