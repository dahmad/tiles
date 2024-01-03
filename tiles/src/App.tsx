import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import './App.css';
import { RootContext } from './RootContext';
import ComboCounts from './containers/ComboCounts';
import TileSet from './containers/TileSet';

const App: FC = () => {
  const { comboStore } = useContext(RootContext);

  return (
    <div className="App">
      <header className="App-header" />
      <TileSet />
      <ComboCounts comboStore={comboStore} />
    </div>
  );
}

export default observer(App);
