import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import './CurrentCombo.css';

const CurrentCombo: FC = () => {
  const { comboStore } = useContext(RootContext);

  return (
    <div className="combo-row align-left">
      <div className="combo-title">Current Combo</div>
      <div className="combo-count">{comboStore.currentComboCounter}</div>
    </div>
  );
};

export default observer(CurrentCombo);
