import { action, computed, makeAutoObservable, observable } from 'mobx';
import { CSSProperties } from 'react';
import { getTheme } from './api';
import { LayerData } from './types/LayerData';
import { Theme } from './types/Theme';
import { TileSetData } from './types/TileSetData';

export default class TilesStore {
  @observable currentComboCounter: number;
  @observable comboCounts: number[];
  @observable tileSet: TileSetData;
  @observable selectedTileIndex: [number, number] | undefined;
  theme: Theme | undefined = undefined;

  constructor(tileSet: TileSetData, themeName: string = 'test') {
    makeAutoObservable(this);
    this.currentComboCounter = 0;
    this.comboCounts = [];
    this.tileSet = tileSet;
    this.getTheme(themeName);
  }

  @action getTheme = async (themeName: string): Promise<void> => {
    this.theme = await getTheme(themeName);
  };

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
      (component: LayerData) => !intersectingComponents.includes(component.id)
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
      (component: LayerData) => component.id
    );

    let secondTile = this.tileSet[secondRowIndex][secondColumnIndex];
    const secondTileComponentIds = secondTile.map(
      (component: LayerData) => component.id
    );

    return firstTileComponentIds.filter((id: string) =>
      secondTileComponentIds.includes(id)
    );
  };

  getAppStyle(): CSSProperties {
    const DEFAULT_APP_BACKGROUND_COLOR = 'white';
    const DEFAULT_FONT_COLOR = 'black';

    let backgroundColor: string;
    let color: string;

    if (this.theme !== undefined) {
      backgroundColor = this.theme.appBackgroundColor;
      color = this.theme.fontColor;
    } else {
      backgroundColor = DEFAULT_APP_BACKGROUND_COLOR;
      color = DEFAULT_FONT_COLOR;
    }

    return { backgroundColor, color };
  }

  getTileStyle(rowIndex: number, columnIndex: number): CSSProperties {
    const DEFAULT_PRIMARY_BACKGROUND_COLOR = 'white';
    const DEFAULT_SECONDARY_BACKGROUND_COLOR = '#dddddd';
    const DEFAULT_SELECTED_TILE_INSET_COLOR = 'black';

    let backgroundColor: string;
    let selectedTileInsetColor: string;

    const useSecondaryColor =
      (rowIndex % 2 === 0 && columnIndex % 2 !== 0) ||
      (rowIndex % 2 !== 0 && columnIndex % 2 === 0);

    if (this.theme !== undefined) {
      backgroundColor = useSecondaryColor
        ? this.theme.tileBackgroundColorSecondary
        : this.theme.tileBackgroundColorPrimary;
      selectedTileInsetColor = this.theme.selectedTileInsetColor;
    } else {
      backgroundColor = useSecondaryColor
        ? DEFAULT_SECONDARY_BACKGROUND_COLOR
        : DEFAULT_PRIMARY_BACKGROUND_COLOR;
      selectedTileInsetColor = DEFAULT_SELECTED_TILE_INSET_COLOR;
    }

    if (this.isSelected(rowIndex, columnIndex)) {
      return {
        backgroundColor,
        boxShadow: `inset 0px 0px 0px 5px ${selectedTileInsetColor}`,
      };
    }

    return { backgroundColor };
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
