import axios from 'axios';
import { env } from 'process';
import { Theme } from './types/Theme';
import { TileSetData } from './types/TileSetData';

const BASE_URL = env.BASE_URL || 'http://127.0.0.1:8000';

export const generateTileSet = async (
  theme: string,
  rowSize: number = 5,
  columnSize: number = 6
): Promise<TileSetData | undefined> => {
  return await axios
    .get(
      `${BASE_URL}/theme/${theme}/generate?rowSize=${rowSize}&columnSize=${columnSize}`
    )
    .then(async (response) => {
      return await response.data;
    })
    .catch(() => {
      return undefined;
    });
};

export const getTheme = async (theme: string): Promise<Theme | undefined> => {
  return await axios
    .get(`${BASE_URL}/theme/${theme}`)
    .then(async (response) => {
      return await response.data;
    })
    .catch(() => {
      return undefined;
    });
};
