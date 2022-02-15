describe('Test that Trainer is up', () => {
  it('Visit LTL website', () => {
    cy.visit('https://ltl-school.com/chinese-pronunciation-tool/hsk-1-intro/')
    cy.contains(/start recording/i)
  })
})