import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { LayerData } from '../types/LayerData';
import './TileLayer.css';

interface TileLayerProps {
  component: LayerData;
  zIndex: number;
}

const TileLayer: FC<TileLayerProps> = ({ component, zIndex }) => {
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(component.svg)}`}
      alt={component.id}
      style={{ zIndex }}
    />
  );
};

export default observer(TileLayer);
