import React from 'react';
import styles from './Toggle.module.css';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}

// Accessible show/hide switch used for the `published` flag.
const Toggle: React.FC<Props> = ({ checked, onChange, labelOn = 'On', labelOff = 'Off' }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={`${styles.toggle} ${checked ? styles.on : ''}`}
    onClick={() => onChange(!checked)}
    title={checked ? labelOn : labelOff}
  >
    <span className={styles.track}>
      <span className={styles.knob} />
    </span>
    <span className={styles.label}>{checked ? labelOn : labelOff}</span>
  </button>
);

export default Toggle;
