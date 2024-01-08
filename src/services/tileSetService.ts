import { readFileSync, writeFileSync } from 'node:fs';
import { Theme } from '../types/Theme';
import { ThemeComponent } from '../types/ThemeComponent';
import { ThemeComponentType } from '../types/ThemeComponentType';
import { TileData } from '../types/TileData';
import { TileSetData } from '../types/TileSetData';

export default class TileSetService {
  themePath: string;
  rowSize: number;
  columnSize: number;
  tileSet: TileData[];

  constructor(themePath: string, rowSize: number, columnSize: number) {
    if ((rowSize * columnSize) % 2 !== 0) {
      throw new Error('Number of tiles must be an even number');
    }

    this.themePath = themePath;
    this.rowSize = rowSize;
    this.columnSize = columnSize;
    this.tileSet = this.getEmptyTilesArray();
  }

  findIndexesOfTilesMissingComponentType = (
    tileSet: TileData[],
    componentTypeName: string
  ): number[] => {
    let indexes: number[] = [];

    tileSet.forEach((tile: TileData, i: number) => {
      let hasComponentType = tile.find(
        (component: any) => component.componentTypeName === componentTypeName
      );
      if (!hasComponentType) {
        indexes.push(i);
      }
    });

    return indexes;
  };

  formatTileSetData = (tileSet: TileData[]): TileSetData => {
    let output: TileSetData = [];

    for (let i = 0; i < tileSet.length; i += this.rowSize) {
      output.push(tileSet.slice(i, i + this.rowSize));
    }

    return output;
  };

  generateTileSetData = (): void => {
    const theme = this.readTheme();

    let componentTypeName: string;

    theme.layerGroups.forEach((componentType: ThemeComponentType) => {
      componentTypeName = componentType.name;
      for (let i = 0; i < (this.rowSize * this.columnSize) / 2; i++) {
        let randomComponent =
          componentType.variants[
            ~~(Math.random() * componentType.variants.length)
          ];
        this.pushComponent(componentTypeName, randomComponent);
        this.pushComponent(componentTypeName, randomComponent);
      }
    });
  };

  getEmptyTilesArray = (): TileData[] => {
    return Array(this.rowSize * this.columnSize).fill([]);
  };

  pushComponent = (
    componentTypeName: string,
    randomComponent: ThemeComponent
  ): void => {
    let indexes = this.findIndexesOfTilesMissingComponentType(
      this.tileSet,
      componentTypeName
    );
    let index = indexes[~~(Math.random() * indexes.length)];
    let tileCopy = new Array(...this.tileSet[index]);
    tileCopy.push({
      componentTypeName: componentTypeName,
      id: randomComponent.id,
      svg: randomComponent.svg,
    });

    let tileSetCopy = this.tileSet
      .slice(0, index)
      .concat(this.tileSet.slice(index + 1));
    tileSetCopy.push(tileCopy);

    this.tileSet = tileSetCopy;
  };

  readTheme = (): Theme => {
    const buffer = readFileSync(this.themePath);
    return JSON.parse(buffer as unknown as string);
  };

  writeTileSetData = (tileSetData: TileSetData, path: string): void => {
    writeFileSync(path, JSON.stringify(tileSetData, null, 2));
  };
}
