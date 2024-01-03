import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import ComboStore from '../ComboStore';
import CurrentCombo from '../components/CurrentCombo';
import LongestCombo from '../components/LongestCombo';
import './ComboCounts.css';

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
