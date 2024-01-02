import React, { FC } from 'react';
import './ComboCounts.css';
import { observer } from 'mobx-react-lite';
import ComboStore from '../ComboStore';
import CurrentCombo from '../components/CurrentCombo';
import LongestCombo from '../components/LongestCombo';

interface ComboCountsProps {
    comboStore: ComboStore;
}
  
const ComboCounts: FC<ComboCountsProps> = ({ comboStore }) => {
  return (
    <div id="comboCounts">
      <CurrentCombo comboStore={comboStore} />
      <LongestCombo comboStore={comboStore} />
    </div>
  );
}

export default observer(ComboCounts);
