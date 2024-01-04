import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import './CurrentCombo.css';
  
const CurrentCombo: FC = () => {
  const { comboStore } = useContext(RootContext);

  return (
    <div id="currentCombo">
      Current Combo: {comboStore.currentComboCounter}
    </div>
  );
}

export default observer(CurrentCombo);
