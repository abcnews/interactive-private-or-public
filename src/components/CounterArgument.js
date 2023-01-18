import React from 'react';
import HTML from './HTML';
import styles from './CounterArgument.scss';

class CounterArgument extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { index, arg } = this.props;

    return (
      <div
        id={`argument-${index}`}
        className={`${styles.argument} ${styles[arg.choice]} ${styles.open}`}
      >
        <div className={styles.icon}>
          <img src={arg.icon.src} width={arg.icon.width} height={arg.icon.height} />
        </div>
        {arg.heading && <h3>{arg.heading}</h3>}
        <div className={styles.content}>
          <HTML html={arg.nodes} />
        </div>
      </div>
    );
  }
}

export default CounterArgument;
