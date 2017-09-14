const { h } = require('preact');

const styles = require('./Face.scss');
const FACES = {
    alarmed: require('./face-alarmed.png'),
    smug: require('./face-smug.png'),
    startled: require('./face-startled.png'),
    thinking: require('./face-thinking.png')
};

module.exports = props => {
    return (
        <div className={styles.face}>
            <img src={FACES[props.emotion]} />
        </div>
    );
};
