const { h, Component } = require('preact');

const HTML = require('./HTML');
const styles = require('./CounterArgument.scss');

class CounterArgument extends Component {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { index, arg } = this.props;

        return (
            <div id={`argument-${index}`} className={`${styles.argument} ${styles[arg.choice]} ${styles.open}`}>
                <div className={styles.icon}>
                    <img src={arg.icon} />
                </div>
                {arg.heading && (
                    <h3>
                        <span>{arg.heading}</span>
                    </h3>
                )}
                <div className={styles.content}>
                    <HTML html={arg.nodes} />
                </div>
            </div>
        );
    }
}

module.exports = CounterArgument;
