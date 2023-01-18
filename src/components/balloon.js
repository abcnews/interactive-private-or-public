import React from 'react';
import styles from './Balloon.scss';

export default props => {
  let type;

  if (props.privateSchool) {
    type = styles.choosePrivate;
  } else if (props.publicSchool) {
    type = styles.choosePublic;
  } else {
    type = styles.chooseReset;
  }

  return (
    <div onClick={props.onClick} className={styles.choice + ' ' + type}>
      <div className={styles.text}>{props.text}</div>
    </div>
  );
};
