describe('Test that Trainer is up', () => {
  it('Visit LTL website', () => {
    cy.visit('https://ltl-school.com/chinese-pronunciation-tool/')
    cy.contains('button', /mic/i);
  })
})
