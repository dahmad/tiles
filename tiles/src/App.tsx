import React, { FC } from 'react';
import logo from './logo.svg';
import './App.css';
import { observer } from 'mobx-react-lite';
import ComboCounts from './containers/ComboCounts';
import ComboStore from './ComboStore';

interface AppProps {
  comboStore: ComboStore;
}

const App: FC<AppProps> = ({ comboStore }) => {
  return (
    <div className="App">
      <header className="App-header" />
      <ComboCounts comboStore={comboStore} />
    </div>
  );
}

export default observer(App);
