import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import TileRow from './TileRow';
import './TileSet.css';

  
const TileSet: FC = () => {
    const { comboStore } = useContext(RootContext);

    return (
        <div id="tileSet">
            {comboStore.tileSet.map((_, i) => {     
                return (<TileRow key={i} rowIndex={i} />) 
            })}
        </div>
    );
}

export default observer(TileSet);
