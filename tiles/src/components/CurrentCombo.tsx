import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import ComboStore from '../ComboStore';
import './CurrentCombo.css';

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
