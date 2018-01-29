const { h } = require('preact');

const styles = require('./Balloon.scss');

module.exports = props => {
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
