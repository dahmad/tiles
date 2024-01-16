import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import { LayerData } from '../types/LayerData';
import './TileLayer.css';

interface TileLayerProps {
  component: LayerData;
  rowIndex: number;
  columnIndex: number;
  zIndex: number;
}

const TileLayer: FC<TileLayerProps> = ({
  component,
  rowIndex,
  columnIndex,
  zIndex,
}) => {
  const { tilesStore } = useContext(RootContext);

  return (
    <img
      className={
        tilesStore.isDisappearingLayer(rowIndex, columnIndex, component.id)
          ? 'disappearing'
          : ''
      }
      src={`data:image/svg+xml;utf8,${encodeURIComponent(component.svg)}`}
      alt={component.id}
      style={{ zIndex }}
    />
  );
};

export default observer(TileLayer);
