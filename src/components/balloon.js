/** @jsx Preact.h */
const Preact = require('preact');

const styles = require('./balloon.scss');

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
            <div className={styles.text}>
                {props.text}
            </div>
            <div className={styles.stick} />
        </div>
    );
};
