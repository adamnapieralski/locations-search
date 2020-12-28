/// <reference types="cypress" />

export default class Stubs {
  static stubGeolocation = (win, coords) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
      return callback({ coords });
    });
  }
}