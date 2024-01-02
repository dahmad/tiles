import { action, computed, makeAutoObservable, observable } from "mobx";
import { Tile } from "./types/Tile";

export default class ComboStore {
    @observable currentComboCounter: number;
    @observable comboCounts: number[];
    @observable tiles: Tile[];

    constructor(tiles: Tile[]) {
        makeAutoObservable(this);
        this.currentComboCounter = 0;
        this.comboCounts = [];
        this.tiles = tiles;
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
