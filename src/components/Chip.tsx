import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import './Tile.css';

interface ChipProps {
  rowIndex: number;
  columnIndex: number;
}

const Chip: FC<ChipProps> = ({ rowIndex, columnIndex }) => {
  const { tilesStore } = useContext(RootContext);

  return (
    <>
      {tilesStore.isAnimating &&
        tilesStore.isActiveTile(rowIndex, columnIndex) &&
        tilesStore.chipText && (
          <div
            role="dialog"
            className={tilesStore.chipClassName}
            style={{
              backgroundColor: tilesStore.theme?.appBackgroundColor,
              color: tilesStore.theme?.fontColor,
            }}
          >
            {tilesStore.chipText}
          </div>
        )}
    </>
  );
};

export default observer(Chip);
