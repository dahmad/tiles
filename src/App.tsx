import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import './App.css';
import { RootContext } from './RootContext';
import ComboCounts from './containers/ComboCounts';
import TileSet from './containers/TileSet';

const App: FC = () => {
  const { tilesStore } = useContext(RootContext);

  return (
    <div className="App" style={tilesStore.appStyle}>
      <header className="App-header" />
      <TileSet />
      <ComboCounts />
    </div>
  );
};

export default observer(App);
