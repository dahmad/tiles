import { action, computed, makeAutoObservable, observable } from "mobx";
import { TileSetData } from "./types/TileSetData";

export default class ComboStore {
    @observable currentComboCounter: number;
    @observable comboCounts: number[];
    @observable tileSet: TileSetData;
    @observable selectedTileIndex: [number, number] | undefined;

    constructor(tileSet: TileSetData) {
        makeAutoObservable(this);
        this.currentComboCounter = 0;
        this.comboCounts = [];
        this.tileSet = tileSet;
    }

    @action incrementCurrentComboCounter = (): void => {
        this.currentComboCounter += 1;
    }

    @action matchTiles = (rowIndex: number, columnIndex: number): void => {
        if (this.selectedTileIndex !== undefined) {
            const firstTile = this.tileSet[this.selectedTileIndex[0]][this.selectedTileIndex[1]];
            const secondTile = this.tileSet[rowIndex][columnIndex];

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

    @action setSelectedTileIndex = (rowIndex: number, columnIndex: number): void => {
        this.selectedTileIndex = [rowIndex, columnIndex];
    }

    @computed get longestComboCount(): number {
        if (this.comboCounts.length === 0) {
            return this.currentComboCounter;
        }

        return Math.max(...this.comboCounts, this.currentComboCounter);
    }
}
