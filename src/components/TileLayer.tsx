import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { ComponentData } from '../types/ComponentData';
import './TileLayer.css';

interface TileLayerProps {
  component: ComponentData;
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
