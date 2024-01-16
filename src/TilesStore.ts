import { action, computed, makeAutoObservable, observable } from 'mobx';
import { CSSProperties } from 'react';
import { generateTileSet, getTheme } from './api';
import { LayerData } from './types/LayerData';
import { Theme } from './types/Theme';
import { TileSetData } from './types/TileSetData';

export default class TilesStore {
  @observable currentComboCounter: number;
  @observable comboCounts: number[];
  @observable disappearingLayers: string[] | undefined;
  @observable selectedMatch: [number, number] | undefined;
  @observable selectedTileIndex: [number, number] | undefined;
  @observable tileSet: TileSetData | undefined = undefined;
  theme: Theme | undefined = undefined;

  constructor(
    themeName: string = 'test',
    rowSize: number = 5,
    columnSize: number = 6
  ) {
    makeAutoObservable(this);
    this.currentComboCounter = 0;
    this.comboCounts = [];
    this.getTheme(themeName);
    this.generateTileSet(themeName, rowSize, columnSize);
  }

  @action getTheme = async (themeName: string): Promise<void> => {
    this.theme = await getTheme(themeName);
  };

  @action generateTileSet = async (
    themeName: string,
    rowSize: number,
    columnSize: number
  ): Promise<void> => {
    this.tileSet = await generateTileSet(themeName, rowSize, columnSize);
  };

  @action incrementCurrentComboCounter = (): void => {
    this.currentComboCounter += 1;
  };

  @action matchTiles = async (rowIndex: number, columnIndex: number): Promise<void> => {
    if (this.tileSet !== undefined && this.selectedTileIndex !== undefined) {
      const [selectedRowIndex, selectedColumnIndex] = this.selectedTileIndex;
      this.setSelectedMatch(rowIndex, columnIndex);

      const intersectingLayers = this.getIntersectingLayers(
        selectedRowIndex,
        selectedColumnIndex,
        rowIndex,
        columnIndex
      );

      if (intersectingLayers.length > 0) {
        this.incrementCurrentComboCounter();

        this.setDisappearingLayers(
          selectedRowIndex,
          selectedColumnIndex,
          intersectingLayers
        );
        this.setDisappearingLayers(
          rowIndex,
          columnIndex,
          intersectingLayers
        );
        await this.filterIntersectingLayers(
          selectedRowIndex,
          selectedColumnIndex,
          intersectingLayers
        );
        await this.filterIntersectingLayers(
          rowIndex,
          columnIndex,
          intersectingLayers
        ).then(() => {
          if (this.tileSet !== undefined) {
            if (this.tileSet[rowIndex][columnIndex].length === 0) {
              this.resetSelectedTileIndex();
            } else {
              this.setSelectedTileIndex(rowIndex, columnIndex);
            }
          }
        })

      } else {
        this.resetCurrentComboCounter();
        this.resetSelectedTileIndex();
      }
      this.resetSelectedMatch();
    }
  };

  @action onTileClick = async (rowIndex: number, columnIndex: number): Promise<void> => {
    if (this.selectedTileIndex === undefined) {
      this.setSelectedTileIndex(rowIndex, columnIndex);
    } else if (this.isSelected(rowIndex, columnIndex)) {
      // no-op
    } else {
      await this.matchTiles(rowIndex, columnIndex);
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
    if (this.tileSet !== undefined) {
      if (this.tileSet[rowIndex][columnIndex].length === 0) {
        // no-op
      } else {
        this.selectedTileIndex = [rowIndex, columnIndex];
      }
    }
  };
  @action resetSelectedMatch = (): void => {
    this.selectedMatch = undefined;
  };

  @action setSelectedMatch = (
    rowIndex: number,
    columnIndex: number
  ): void => {
    if (this.tileSet !== undefined) {
      if (this.tileSet[rowIndex][columnIndex].length === 0) {
        // no-op
      } else {
        this.selectedMatch = [rowIndex, columnIndex];
      }
    }
  };

  @computed get longestComboCount(): number {
    if (this.comboCounts.length === 0) {
      return this.currentComboCounter;
    }

    return Math.max(...this.comboCounts, this.currentComboCounter);
  }

  filterIntersectingLayers = async (
    rowIndex: number,
    columnIndex: number,
    intersectingLayers: string[]
  ): Promise<void> => {
    if (this.tileSet !== undefined) {
      return new Promise(() => setTimeout(() => {
        if (this.tileSet !== undefined) {
          this.tileSet[rowIndex][columnIndex] = this.tileSet[rowIndex][
            columnIndex
          ].filter(
            (layer: LayerData) => !intersectingLayers.includes(layer.id)
          );
        }
      }, 2000));
    }
  };

  @action setDisappearingLayer = (layer_id: string): void => {
    if (this.disappearingLayers === undefined) {
      this.disappearingLayers = [layer_id];
    } else {
      this.disappearingLayers.push(layer_id);
    }
  }

  setDisappearingLayers = (
    rowIndex: number,
    columnIndex: number,
    intersectingLayers: string[]
  ): void => {
    if (this.tileSet !== undefined) {
      this.tileSet[rowIndex][columnIndex].forEach((layer: LayerData): void => {
        if (intersectingLayers.includes(layer.id)) {
          this.setDisappearingLayer(layer.id);
        }
      });
    }
  };

  getIntersectingLayers = (
    firstRowIndex: number,
    firstColumnIndex: number,
    secondRowIndex: number,
    secondColumnIndex: number
  ): string[] => {
    if (this.tileSet !== undefined) {
      let firstTile = new Array(...this.tileSet[firstRowIndex][firstColumnIndex]);
      const firstTileLayerIds = firstTile.map(
        (layer: LayerData) => layer.id
      );

      let secondTile = new Array(...this.tileSet[secondRowIndex][secondColumnIndex]);
      const secondTileLayerIds = secondTile.map(
        (layer: LayerData) => layer.id
      );

      return firstTileLayerIds.filter((id: string) =>
        secondTileLayerIds.includes(id)
      );
    }

    return [];
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

  isDisappearing(rowIndex: number, columnIndex: number, layer_id: string) {
    return (this.isSelected(rowIndex, columnIndex) || this.isSelectedMatch(rowIndex, columnIndex)) && this.disappearingLayers?.includes(layer_id);
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

  isSelectedMatch(rowIndex: number, columnIndex: number): boolean {
    if (this.selectedMatch === undefined) {
      return false;
    } else {
      return (
        this.selectedMatch[0] === rowIndex &&
        this.selectedMatch[1] === columnIndex
      );
    }
  }
}
