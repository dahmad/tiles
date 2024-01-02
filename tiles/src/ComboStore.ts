import { action, computed, makeAutoObservable, observable } from "mobx";
import { Tile } from "./types/Tile";

export default class ComboStore {
    @observable currentComboCounter: number;
    @observable comboCounts: number[];
    @observable tiles: Tile[];
    @observable selectedTileIndex: number | undefined;

    constructor(tiles: Tile[]) {
        makeAutoObservable(this);
        this.currentComboCounter = 0;
        this.comboCounts = [];
        this.tiles = tiles;
    }

    @action incrementCurrentComboCounter = (): void => {
        this.currentComboCounter += 1;
    }

    @action matchTiles = (index: number): void => {
        if (this.selectedTileIndex !== undefined) {
            const firstTile = this.tiles[this.selectedTileIndex];
            const secondTile = this.tiles[index];

            const contentsIntersection = firstTile.contents.filter(value => secondTile.contents.includes(value));

            if (contentsIntersection.length > 0) {
                this.incrementCurrentComboCounter();

                firstTile.contents = firstTile.contents.filter(value => !contentsIntersection.includes(value))
                secondTile.contents = secondTile.contents.filter(value => !contentsIntersection.includes(value))

                this.resetSelectedTileIndex();
            } else {
                this.resetCurrentComboCounter();
                this.resetSelectedTileIndex();
            }
        }
    }

    @action resetCurrentComboCounter = (): void => {
        this.comboCounts.push(this.currentComboCounter);
        this.currentComboCounter = 0;
    }

    @action resetSelectedTileIndex = (): void => {
        this.selectedTileIndex = undefined;
    }

    @action setSelectedTileIndex = (index: number): void => {
        this.selectedTileIndex = index;
    }

    @computed get longestComboCount(): number {
        if (this.comboCounts.length === 0) {
            return this.currentComboCounter;
        }

        return Math.max(...this.comboCounts);
    }
}
