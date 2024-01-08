import { action, computed, makeAutoObservable, observable } from 'mobx';
import { CSSProperties } from 'react';
import { ComponentData } from './types/ComponentData';
import { TileSetData } from './types/TileSetData';
import axios from 'axios';

export default class TilesStore {
  @observable currentComboCounter: number;
  @observable comboCounts: number[];
  @observable tileSet: TileSetData;
  @observable selectedTileIndex: [number, number] | undefined;
  @observable loading: boolean;
  rowSize: number;
  columnSize: number;

  constructor(tileSet: TileSetData, rowSize: number = 5, columnSize: number = 6) {
    makeAutoObservable(this);
    this.loading = true;
    
    this.tileSet = [];
    this.rowSize = rowSize;
    this.columnSize = columnSize;
    
    this.currentComboCounter = 0;
    this.comboCounts = [];
    this.getTileSet();
  }

  @action getTileSet = async (): Promise<void> => {
    const response = await axios({
      method: 'get',
      url: `http://127.0.0.1:8000/theme/hongKong/generate?rowSize=${this.rowSize}&columnSize=${this.columnSize}`,
    });
    this.tileSet = response.data;
    this.loading = false;
  }

  @action incrementCurrentComboCounter = (): void => {
    this.currentComboCounter += 1;
  };

  @action matchTiles = (rowIndex: number, columnIndex: number): void => {
    if (this.selectedTileIndex !== undefined) {
      const [selectedRowIndex, selectedColumnIndex] = this.selectedTileIndex;

      const intersectingComponents = this.getIntersectingComponents(
        selectedRowIndex,
        selectedColumnIndex,
        rowIndex,
        columnIndex
      );

      if (intersectingComponents.length > 0) {
        this.incrementCurrentComboCounter();

        this.filterIntersectingComponents(
          selectedRowIndex,
          selectedColumnIndex,
          intersectingComponents
        );
        this.filterIntersectingComponents(
          rowIndex,
          columnIndex,
          intersectingComponents
        );

        if (this.tileSet[rowIndex][columnIndex].length === 0) {
          this.resetSelectedTileIndex();
        } else {
          this.setSelectedTileIndex(rowIndex, columnIndex);
        }
      } else {
        this.resetCurrentComboCounter();
        this.resetSelectedTileIndex();
      }
    }
  };

  @action onTileClick = (rowIndex: number, columnIndex: number) => {
    if (this.selectedTileIndex === undefined) {
      this.setSelectedTileIndex(rowIndex, columnIndex);
    } else if (this.isSelected(rowIndex, columnIndex)) {
      // no-op
    } else {
      this.matchTiles(rowIndex, columnIndex);
    }
  };

  @action resetCurrentComboCounter = (): void => {
    this.comboCounts.push(this.currentComboCounter);
    this.currentComboCounter = 0;
  };

  @action resetSelectedTileIndex = (): void => {
    this.selectedTileIndex = undefined;
  };

  @action setSelectedTileIndex = (
    rowIndex: number,
    columnIndex: number
  ): void => {
    if (this.tileSet[rowIndex][columnIndex].length === 0) {
      // no-op
    } else {
      this.selectedTileIndex = [rowIndex, columnIndex];
    }
  };

  @computed get longestComboCount(): number {
    if (this.comboCounts.length === 0) {
      return this.currentComboCounter;
    }

    return Math.max(...this.comboCounts, this.currentComboCounter);
  }

  filterIntersectingComponents = (
    rowIndex: number,
    columnIndex: number,
    intersectingComponents: string[]
  ): void => {
    this.tileSet[rowIndex][columnIndex] = this.tileSet[rowIndex][
      columnIndex
    ].filter(
      (component: ComponentData) =>
        !intersectingComponents.includes(component.id)
    );
  };

  getIntersectingComponents = (
    firstRowIndex: number,
    firstColumnIndex: number,
    secondRowIndex: number,
    secondColumnIndex: number
  ): string[] => {
    let firstTile = this.tileSet[firstRowIndex][firstColumnIndex];
    const firstTileComponentIds = firstTile.map(
      (component: ComponentData) => component.id
    );

    let secondTile = this.tileSet[secondRowIndex][secondColumnIndex];
    const secondTileComponentIds = secondTile.map(
      (component: ComponentData) => component.id
    );

    return firstTileComponentIds.filter((id: string) =>
      secondTileComponentIds.includes(id)
    );
  };

  getStyle(rowIndex: number, columnIndex: number): CSSProperties {
    let backgroundColor: string;

    // TODO parameterize these colors
    if (rowIndex % 2 === 0 && columnIndex % 2 === 0) {
      backgroundColor = 'white';
    } else if (rowIndex % 2 === 0 && columnIndex % 2 !== 0) {
      backgroundColor = '#dddddd';
    } else if (rowIndex % 2 !== 0 && columnIndex % 2 === 0) {
      backgroundColor = '#dddddd';
    } else {
      backgroundColor = 'white';
    }

    const { innerWidth: width, innerHeight: height } = window;
    console.log(width)
    console.log(height)
    let dimensions = 66 / Math.max(this.rowSize, this.columnSize);

    return { backgroundColor, height: `${dimensions}vmin`, width: `${dimensions}vmin` };
  }

  isSelected(rowIndex: number, columnIndex: number): boolean {
    if (this.selectedTileIndex === undefined) {
      return false;
    } else {
      return (
        this.selectedTileIndex[0] === rowIndex &&
        this.selectedTileIndex[1] === columnIndex
      );
    }
  }
}
