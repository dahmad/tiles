import { LayerGroup } from './LayerGroup';

export type Theme = {
  name: string;
  appBackgroundColor: string;
  fontColor: string;
  tileBackgroundColorPrimary: string;
  tileBackgroundColorSecondary: string;
  selectedTileInsetColor: string;
  layerGroups: LayerGroup[];
};
