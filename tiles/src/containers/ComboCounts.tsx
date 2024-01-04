import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import CurrentCombo from '../components/CurrentCombo';
import LongestCombo from '../components/LongestCombo';
import './ComboCounts.css';
  
const ComboCounts: FC = () => {
  return (
    <div id="comboCounts">
      <CurrentCombo />
      <LongestCombo />
    </div>
  );
}

export default observer(ComboCounts);
