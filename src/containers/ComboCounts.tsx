import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import CurrentCombo from '../components/CurrentCombo';
import LongestCombo from '../components/LongestCombo';
import './ComboCounts.css';

const ComboCounts: FC = () => {
  return (
    <div id="comboCounts" className="flex-container">
      <CurrentCombo />
      <LongestCombo />
    </div>
  );
};

export default observer(ComboCounts);
