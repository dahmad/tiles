import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import ComboStore from '../ComboStore';
import './LongestCombo.css';

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
