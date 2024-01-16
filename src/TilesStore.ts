import { action, computed, makeAutoObservable, observable } from 'mobx';
import { CSSProperties } from 'react';
import { generateTileSet, getTheme } from './api';
import { LayerData } from './types/LayerData';
import { Theme } from './types/Theme';
import { TileSetData } from './types/TileSetData';

type Coordinates = [number, number] | undefined;
const NO_MATCHES = 'no matches';
const GO_ANYWHERE = 'go anywhere';

export default class TilesStore {
  // counter
  @observable comboCounts: number[] = [];
  @observable currentComboCounter: number = 0;
  // tiles
  @observable activeTile: Coordinates;
  @observable firstTile: Coordinates;
  @observable secondTile: Coordinates;
  @observable intersectingLayerIds: string[] = [];
  // fetched resources
  @observable theme: Theme | undefined = undefined;
  @observable tileSet: TileSetData | undefined = undefined;
  // animations-related
  @observable chipText: string | undefined;
  @observable disappearingLayers: string[] = [];
  @observable isAnimating = false;
  // constants
  timeout = 1750;

  constructor(
    themeName: string = 'test',
    rowSize: number = 5,
    columnSize: number = 6
  ) {
    makeAutoObservable(this);
    this.getTheme(themeName);
    this.generateTileSet(themeName, rowSize, columnSize);
  }

  // actions
  @action filterIntersectingLayers = (coordinates: Coordinates): void => {
    if (this.tileSet === undefined || coordinates === undefined) {
      return;
    }

    let [r, c] = coordinates;
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

  @action matchTiles = (): void => {
    this.setIntersectingLayerIds();
    if (this.hasMatches) {
      this.onMatchSuccess();
    } else {
      this.onMatchFailure();
    }
  };

  @action onMatchFailure = (): void => {
    this.setChipText();
    this.resetCurrentComboCounter();
    this.setIsAnimating(true);
    setTimeout(() => {
      this.resetChipText();
      this.resetActiveTile();
      this.resetFirstTile();
      this.setIsAnimating(false);
    }, this.timeout);
  };

  @action onMatchSuccess = (): void => {
    this.setIsAnimating(true);
    this.incrementCurrentComboCounter();
    this.setChipText();
    this.setDisappearingLayers();
    this.setFilteredTiles().then(() => {
      if (this.isEmpty) {
        this.resetFirstTile();
      } else {
        this.shiftSelectedTiles();
      }
      this.setIsAnimating(false);
      this.resetDisappearingLayers();
      this.resetChipText();
    });
  };

  @action shiftSelectedTiles = (): void => {
    if (this.secondTile === undefined) {
      return;
    }

    this.setFirstTile(this.secondTile[0], this.secondTile[1]);
    this.resetSecondTile();
  };

  @action onTileClick = (rowIndex: number, columnIndex: number) => {
    if (this.isAnimating) {
      // no-op
      return;
    }

    if (this.firstTile === undefined) {
      this.setFirstTile(rowIndex, columnIndex);
      this.setActiveTile(rowIndex, columnIndex);
    } else if (this.isFirstTile(rowIndex, columnIndex)) {
      // no-op
    } else {
      this.setSecondTile(rowIndex, columnIndex);
      this.setActiveTile(rowIndex, columnIndex);
      this.matchTiles();
    }
  };

  @action pushDisappearingLayers = (coordinates: Coordinates): void => {
    if (this.tileSet === undefined || coordinates === undefined) {
      return;
    }

    let [r, c] = coordinates;
    this.tileSet[r][c].forEach((layer: LayerData): void => {
      if (this.intersectingLayerIds.includes(layer.id)) {
        this.disappearingLayers.push(layer.id);
      }
    });
  };

  @action resetActiveTile = (): void => {
    this.activeTile = undefined;
  };

  @action resetChipText = (): void => {
    this.chipText = undefined;
  };

  @action resetCurrentComboCounter = (): void => {
    this.comboCounts.push(this.currentComboCounter);
    this.currentComboCounter = 0;
  };

  @action resetDisappearingLayers = (): void => {
    this.disappearingLayers = [];
  };

  @action resetFirstTile = (): void => {
    this.firstTile = undefined;
  };

  @action resetIntersectingLayerIds = (): void => {
    this.intersectingLayerIds = [];
  };

  @action resetSecondTile = (): void => {
    this.secondTile = undefined;
  };

  @action setActiveTile = (rowIndex: number, columnIndex: number): void => {
    this.activeTile = [rowIndex, columnIndex];
  };

  @action setChipText = (): void => {
    if (this.hasMatches) {
      if (this.willEmptyTile) {
        this.chipText = GO_ANYWHERE;
      } else {
        this.chipText = String(this.currentComboCounter);
      }
    } else {
      this.chipText = NO_MATCHES;
    }
  };

  @action setDisappearingLayers = (): void => {
    this.pushDisappearingLayers(this.firstTile);
    this.pushDisappearingLayers(this.secondTile);
  };

  @action setFilteredTiles = (): Promise<void> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.filterIntersectingLayers(this.firstTile);
        this.filterIntersectingLayers(this.secondTile);
        resolve();
      }, this.timeout)
    );
  };

  @action setFirstTile = (rowIndex: number, columnIndex: number): void => {
    if (this.tileSet !== undefined) {
      if (this.tileSet[rowIndex][columnIndex].length === 0) {
        // no-op
      } else {
        this.firstTile = [rowIndex, columnIndex];
      }
    }
  };

  @action setIntersectingLayerIds = (): void => {
    this.intersectingLayerIds = this.getLayerIds(this.firstTile).filter(
      (id: string) => this.getLayerIds(this.secondTile).includes(id)
    );
  };

  @action setIsAnimating = (flag: boolean): void => {
    this.isAnimating = flag;
  };

  @action setSecondTile = (rowIndex: number, columnIndex: number): void => {
    if (this.tileSet !== undefined) {
      if (this.tileSet[rowIndex][columnIndex].length === 0) {
        // no-op
      } else {
        this.secondTile = [rowIndex, columnIndex];
      }
    }
  };

  // computed getters
  @computed get appStyle(): CSSProperties {
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

  @computed get chipClassName(): string {
    if (this.chipText && this.chipText === GO_ANYWHERE) {
      return 'chip go-anywhere';
    } else if (this.chipText && this.chipText === NO_MATCHES) {
      return 'chip no-matches';
    } else {
      return 'chip count';
    }
  }

  @computed get isEmpty(): boolean {
    if (this.tileSet === undefined || this.secondTile === undefined) {
      return false;
    }

    return this.tileSet[this.secondTile[0]][this.secondTile[1]].length === 0;
  }

  @computed get hasMatches(): boolean {
    return this.intersectingLayerIds.length > 0;
  }

  @computed get longestComboCount(): number {
    if (this.comboCounts.length === 0) {
      return this.currentComboCounter;
    }

    return Math.max(...this.comboCounts, this.currentComboCounter);
  }

  @computed get willEmptyTile(): boolean {
    if (this.tileSet === undefined || this.secondTile === undefined) {
      return false;
    }

    return (
      this.tileSet[this.secondTile[0]][this.secondTile[1]].length -
        this.intersectingLayerIds.length ===
      0
    );
  }

  // other functions
  getLayerIds = (coordinates: Coordinates): string[] => {
    if (this.tileSet === undefined || coordinates === undefined) {
      return [];
    }

    let [r, c] = coordinates;
    return this.tileSet[r][c].map((layer: LayerData) => layer.id);
  };

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

    if (this.isActiveTile(rowIndex, columnIndex)) {
      return {
        backgroundColor,
        boxShadow: `inset 0px 0px 0px 5px ${selectedTileInsetColor}`,
      };
    }

    return { backgroundColor };
  }

  isActiveTile(rowIndex: number, columnIndex: number): boolean {
    return this.isTile(this.activeTile, rowIndex, columnIndex);
  }

  isDisappearingLayer(
    rowIndex: number,
    columnIndex: number,
    layer_id: string
  ): boolean {
    return (
      (this.isFirstTile(rowIndex, columnIndex) ||
        this.isSecondTile(rowIndex, columnIndex)) &&
      this.disappearingLayers.includes(layer_id)
    );
  }

  isFirstTile(rowIndex: number, columnIndex: number): boolean {
    return this.isTile(this.firstTile, rowIndex, columnIndex);
  }

  isSecondTile(rowIndex: number, columnIndex: number): boolean {
    return this.isTile(this.secondTile, rowIndex, columnIndex);
  }

  // private
  isTile(
    attribute: Coordinates,
    rowIndex: number,
    columnIndex: number
  ): boolean {
    if (attribute === undefined) {
      return false;
    } else {
      return attribute[0] === rowIndex && attribute[1] === columnIndex;
    }
  }
}
