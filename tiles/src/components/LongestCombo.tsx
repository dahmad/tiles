import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import ComboStore from '../ComboStore';
import './LongestCombo.css';
import { RootContext } from '../RootContext';
  
const LongestCombo: FC = () => {
  const { comboStore } = useContext(RootContext);

  return (
    <div id="longestCombo">
      Longest Combo: {comboStore.longestComboCount}
    </div>
  );
}

export default observer(LongestCombo);
