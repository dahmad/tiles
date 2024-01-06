import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import './LongestCombo.css';

const LongestCombo: FC = () => {
  const { tilesStore } = useContext(RootContext);

  return (
    <div className="combo-row align-right">
      <div className="combo-title">Longest Combo</div>
      <div className="combo-count">{tilesStore.longestComboCount}</div>
    </div>
  );
};

export default observer(LongestCombo);
