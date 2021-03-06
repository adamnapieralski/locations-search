// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("checkPointMarkersCount", {
  prevSubject: true
}, (subject) => {
  if (subject) {
    const pointsNum = subject?.geojson?.features.filter((feat) => feat.geometry.type === 'Point')?.length
    cy.get('.leaflet-marker-icon').should('have.length', pointsNum + 1) // + current location marker
  }
})

Cypress.Commands.add("typeDistance", {
  prevSubject: true
}, (subject, val) => {
  if (subject) {
    let typeval = '{leftarrow}'.repeat(10)
    for (const c of val.toString()) {
      typeval += `{del}${c}`
    }
    typeval += '{del}'.repeat(10)

    cy.wrap(subject).type(typeval, { force: true })
  }
})

Cypress.Commands.add("compareResponse", {
  prevSubject: true
}, (subject, response) => {
  expect(subject.geojson).to.deep.equal(response.geojson)
  expect(subject.polygon).to.deep.equal(response.polygon)
})