import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import './App.css';
import ComboCounts from './containers/ComboCounts';
import TileSet from './containers/TileSet';

const App: FC = () => {
  return (
    <div className="App">
      <header className="App-header" />
      <TileSet />
      <ComboCounts />
    </div>
  );
}

export default observer(App);
