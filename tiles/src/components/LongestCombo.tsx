import React, { FC } from 'react';
import './LongestCombo.css';
import { observer } from 'mobx-react-lite';
import ComboStore from '../ComboStore';

interface LongestComboProps {
    comboStore: ComboStore;
}
  
const LongestCombo: FC<LongestComboProps> = ({ comboStore }) => {
  return (
    <div id="longestCombo">
      Longest Combo: {comboStore.longestComboCount}
    </div>
  );
}

export default observer(LongestCombo);
