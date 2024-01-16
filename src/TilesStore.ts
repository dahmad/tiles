import { action, computed, makeAutoObservable, observable } from 'mobx';
import { CSSProperties } from 'react';
import { generateTileSet, getTheme } from './api';
import { LayerData } from './types/LayerData';
import { Theme } from './types/Theme';
import { TileSetData } from './types/TileSetData';

export default class TilesStore {
  @observable currentComboCounter: number;
  @observable comboCounts: number[];
  @observable intersectingLayerIds: string[] = [];
  @observable selectedMatchIndex: [number, number] | undefined;
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

  @action filterIntersectingLayers = (): void => {
    if (
      this.tileSet === undefined ||
      this.selectedTileIndex === undefined ||
      this.selectedMatchIndex === undefined
    ) {
      return;
    }

    let [r, c] = this.selectedTileIndex;
    this.tileSet[r][c] = this.tileSet[r][c].filter(
      (layer: LayerData) => !this.intersectingLayerIds.includes(layer.id)
    );

    [r, c] = this.selectedMatchIndex;
    this.tileSet[r][c] = this.tileSet[r][c].filter(
      (layer: LayerData) => !this.intersectingLayerIds.includes(layer.id)
    );
  };

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

  @action matchTiles = (rowIndex: number, columnIndex: number): void => {
    this.setSelectedMatchIndex(rowIndex, columnIndex);
    this.setIntersectingLayerIds();

    if (this.intersectingLayerIds.length > 0) {
      this.incrementCurrentComboCounter();
      this.filterIntersectingLayers();

      if (this.tileSet && this.tileSet[rowIndex][columnIndex].length === 0) {
        this.resetSelectedTileIndex();
      } else {
        this.setSelectedTileIndex(rowIndex, columnIndex);
      }
    } else {
      this.resetCurrentComboCounter();
      this.resetSelectedTileIndex();
    }

    this.resetSelectedMatchIndex();
    this.resetIntersectingLayerIds();
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

  @action resetIntersectingLayerIds = (): void => {
    this.intersectingLayerIds = [];
  };

  @action resetSelectedMatchIndex = (): void => {
    this.selectedMatchIndex = undefined;
  };

  @action resetSelectedTileIndex = (): void => {
    this.selectedTileIndex = undefined;
  };

  @action setIntersectingLayerIds = (): void => {
    if (
      this.tileSet === undefined ||
      this.selectedTileIndex === undefined ||
      this.selectedMatchIndex === undefined
    ) {
      return;
    }

    let [r, c] = this.selectedTileIndex;
    const firstTileLayerIds = this.tileSet[r][c].map(
      (layer: LayerData) => layer.id
    );

    [r, c] = this.selectedMatchIndex;
    const secondTileLayerIds = this.tileSet[r][c].map(
      (layer: LayerData) => layer.id
    );

    this.intersectingLayerIds = firstTileLayerIds.filter((id: string) =>
      secondTileLayerIds.includes(id)
    );
  };

  @action setSelectedMatchIndex = (
    rowIndex: number,
    columnIndex: number
  ): void => {
    if (this.tileSet !== undefined) {
      if (this.tileSet[rowIndex][columnIndex].length === 0) {
        // no-op
      } else {
        this.selectedMatchIndex = [rowIndex, columnIndex];
      }
    }
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

  @computed get longestComboCount(): number {
    if (this.comboCounts.length === 0) {
      return this.currentComboCounter;
    }

    return Math.max(...this.comboCounts, this.currentComboCounter);
  }

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
