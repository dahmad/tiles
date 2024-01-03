import React, { FC, useContext } from 'react';
import './App.css';
import { observer } from 'mobx-react-lite';
import ComboCounts from './containers/ComboCounts';
import { RootContext } from './RootContext';

const App: FC = () => {
  const { comboStore } = useContext(RootContext);

  return (
    <div className="App">
      <header className="App-header" />
      <ComboCounts comboStore={comboStore} />
    </div>
  );
}

export default observer(App);
