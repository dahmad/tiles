const assertCounts = (current: number, longest: number) => {
  cy.get('#comboCounts .combo-count')
    .first()
    .should('have.text', String(current));
  cy.get('#comboCounts .combo-count')
    .last()
    .should('have.text', String(longest));
};

const clickTile = (rowIndex: number, columnIndex: number) => {
  cy.get(`[id^='tile_${rowIndex}_${columnIndex}']`).click();
};

const assertChip = (label: string) => {
  cy.get('.disappearing').should('be.visible');
  cy.get('.chip').should('have.text', label);
  // wait for animation to complete
  // and for tiles to be interactable again
  cy.get('.chip').should('not.exist');
  cy.get('.disappearing').should('not.exist');
}

describe('Perfect game', () => {
  it('clears the board', () => {
    cy.visit('/');

    assertCounts(0, 0);

    clickTile(0, 0);
    clickTile(1, 2);
    assertCounts(1, 1);
    assertChip('1');

    clickTile(1, 1);
    assertCounts(2, 2);
    assertChip('2');

    clickTile(4, 0);
    assertCounts(3, 3);
    assertChip('3');

    clickTile(4, 1);
    assertCounts(4, 4);
    assertChip('4');

    clickTile(4, 2);
    assertCounts(5, 5);
    assertChip('5');

    clickTile(4, 3);
    assertCounts(6, 6);
    assertChip('6');

    clickTile(4, 4);
    assertCounts(7, 7);
    assertChip('7');

    clickTile(5, 0);
    assertCounts(8, 8);
    assertChip('8');

    clickTile(1, 0);
    assertCounts(9, 9);
    assertChip('9');

    clickTile(0, 0);
    assertCounts(10, 10);
    assertChip('go anywhere');

    // go anywhere

    clickTile(0, 1);
    clickTile(0, 4);
    assertCounts(11, 11);
    assertChip('11');

    clickTile(5, 4);
    assertCounts(12, 12);
    assertChip('12');

    clickTile(5, 3);
    assertCounts(13, 13);
    assertChip('13');

    clickTile(3, 3);
    assertCounts(14, 14);
    assertChip('14');

    clickTile(3, 4);
    assertCounts(15, 15);
    assertChip('15');

    clickTile(0, 2);
    assertCounts(16, 16);
    assertChip('16');

    clickTile(0, 3);
    assertCounts(17, 17);
    assertChip('17');

    clickTile(1, 3);
    assertCounts(18, 18);
    assertChip('18');

    clickTile(1, 4);
    assertCounts(19, 19);
    assertChip('19');

    clickTile(4, 1);
    assertCounts(20, 20);
    assertChip('go anywhere');

    // go anywhere

    clickTile(2, 0);
    clickTile(2, 1);
    assertCounts(21, 21);
    assertChip('21');

    clickTile(2, 2);
    assertCounts(22, 22);
    assertChip('22');

    clickTile(2, 3);
    assertCounts(23, 23);
    assertChip('23');

    clickTile(3, 1);
    assertCounts(24, 24);
    assertChip('24');

    clickTile(3, 2);
    assertCounts(25, 25);
    assertChip('25');

    clickTile(3, 4);
    assertCounts(26, 26);
    assertChip('go anywhere');

    // go anywhere

    clickTile(0, 1);
    clickTile(3, 0);
    assertCounts(27, 27);
    assertChip('27');

    clickTile(5, 1);
    assertCounts(28, 28);
    assertChip('28');

    clickTile(2, 2);
    assertCounts(29, 29);
    assertChip('go anywhere');

    // go anywhere

    clickTile(2, 4);
    clickTile(5, 2);
    assertCounts(30, 30);
    assertChip('30');

    clickTile(5, 0);
    assertCounts(31, 31);
    assertChip('go anywhere');

    // go anywhere

    clickTile(1, 3);
    clickTile(2, 0);
    assertCounts(32, 32);
    assertChip('32');

    clickTile(5, 2);
    assertCounts(33, 33);
    assertChip('go anywhere');

    // go anywhere

    clickTile(3, 0);
    clickTile(4, 0);
    assertCounts(34, 34);
    assertChip('go anywhere');

    // go anywhere

    clickTile(2, 1);
    clickTile(4, 2);
    assertCounts(35, 35);
    assertChip('go anywhere');

    // go anywhere

    clickTile(4, 3);
    clickTile(5, 1);
    assertCounts(36, 36);
    assertChip('go anywhere');

    // go anywhere

    clickTile(1, 4);
    clickTile(4, 4);
    assertCounts(37, 37);
    assertChip('go anywhere');

    // go anywhere

    clickTile(2, 3);
    clickTile(5, 4);
    assertCounts(38, 38);
    assertChip('go anywhere');

    // go anywhere

    clickTile(2, 4);
    clickTile(3, 1);
    assertCounts(39, 39);
    assertChip('go anywhere');

    // go anywhere

    clickTile(2, 4);
    clickTile(3, 2);
    assertCounts(40, 40);
    assertChip('go anywhere');
  });
});
