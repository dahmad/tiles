import ComboStore from './ComboStore'


it('starts with a empty combo counts', () => {
    const comboStore = new ComboStore();
    expect(comboStore.currentComboCounter).toEqual(0);
    expect(comboStore.comboCounts).toEqual([]);
})

it('can increment currentComboCounter', () => {
    const comboStore = new ComboStore();
    expect(comboStore.currentComboCounter).toEqual(0);
    comboStore.incrementCurrentComboCounter();
    expect(comboStore.currentComboCounter).toEqual(1);
})

it('can reset currentComboCounter', () => {
    const comboStore = new ComboStore();
    comboStore.currentComboCounter = 100;
    expect(comboStore.currentComboCounter).toEqual(100);
    comboStore.resetCurrentComboCounter();
    expect(comboStore.currentComboCounter).toEqual(0);
})

it('adds to comboCounts when currentComboCounter is reset', () => {
    const comboStore = new ComboStore();

    // Set one combo count
    comboStore.currentComboCounter = 100;
    expect(comboStore.currentComboCounter).toEqual(100);

    comboStore.resetCurrentComboCounter();

    expect(comboStore.comboCounts).toEqual([100]);

    // Set another combo count
    comboStore.currentComboCounter = 33;
    expect(comboStore.currentComboCounter).toEqual(33);

    comboStore.resetCurrentComboCounter();

    expect(comboStore.comboCounts).toEqual([100, 33]);
})

it('returns the longest combo count when there are combo counts', () => {
    const comboStore = new ComboStore();
    comboStore.comboCounts = [1,2,3];
    expect(comboStore.longestComboCount).toEqual(3);
})

it('returns the current combo count when there are no combo counts', () => {
    const comboStore = new ComboStore();
    expect(comboStore.longestComboCount).toEqual(0);
    comboStore.incrementCurrentComboCounter();
    expect(comboStore.longestComboCount).toEqual(1);
})
