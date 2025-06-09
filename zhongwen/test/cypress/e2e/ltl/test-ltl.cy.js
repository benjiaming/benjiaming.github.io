Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

describe('Test that Trainer is up', () => {
  it('Visit LTL website https://ltl-school.com/chinese-pronunciation-tool/', () => {
    cy.visit('https://ltl-school.com/chinese-pronunciation-tool/')
    cy.findByRole('button', { name: /mic/i })
    cy.findByRole('link', {name: /ben blazke/i })
  })

  it('Visit LTL website https://flexiclasses.com/japanese-pronunciation-tool/', () => {
    cy.visit('https://flexiclasses.com/japanese-pronunciation-tool/')
    cy.findByRole('button', { name: /mic/i })
    cy.findByRole('link', {name: /ben blazke/i })
  })

  it('Visit LTL website https://flexiclasses.com/korean-pronunciation-tool/', () => {
    cy.visit('https://flexiclasses.com/korean-pronunciation-tool/')
    cy.findByRole('button', { name: /mic/i })
    cy.findByRole('link', {name: /ben blazke/i })
  })
})
