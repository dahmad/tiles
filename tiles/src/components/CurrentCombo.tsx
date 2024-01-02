import React, { FC } from 'react';
import './CurrentCombo.css';
import { observer } from 'mobx-react-lite';
import ComboStore from '../ComboStore';

interface CurrentComboProps {
    comboStore: ComboStore;
}
  
const CurrentCombo: FC<CurrentComboProps> = ({ comboStore }) => {
  return (
    <div id="currentCombo">
      Current Combo: {comboStore.currentComboCounter}
    </div>
  );
}

export default observer(CurrentCombo);
