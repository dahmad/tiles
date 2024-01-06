import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import Tile from '../components/Tile';
import './TileRow.css';

interface TileRowProps {
    rowIndex: number;
}
  
const TileRow: FC<TileRowProps> = ({ rowIndex }) => {
    const { tilesStore } = useContext(RootContext);
    const tileRow = tilesStore.tileSet[rowIndex];

    return (
        <div id={`tilerow_${rowIndex}`}>
            {tileRow.map((_, i) => {     
                return (<Tile key={i} rowIndex={rowIndex} columnIndex={i}/>) 
            })}
        </div>
    );
}

export default observer(TileRow);
