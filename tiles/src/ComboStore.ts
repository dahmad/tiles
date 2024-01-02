import { action, computed, makeAutoObservable, observable } from "mobx";

export default class ComboStore {
    @observable currentComboCounter: number;
    @observable comboCounts: number[];

    constructor() {
        makeAutoObservable(this);
        this.currentComboCounter = 0;
        this.comboCounts = [];
    }

    @action incrementCurrentComboCounter = (): void => {
        this.currentComboCounter += 1;
    }

    @action resetCurrentComboCounter = (): void => {
        this.comboCounts.push(this.currentComboCounter);
        this.currentComboCounter = 0;
    }

    @computed get longestComboCount(): number {
        if (this.comboCounts.length === 0) {
            return this.currentComboCounter;
        }

        return Math.max(...this.comboCounts);
    }
}
