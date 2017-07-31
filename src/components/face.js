/** @jsx Preact.h */
const Preact = require('preact');

const ASSET_PATH = require('../loader').getAssetPath();

const styles = require('./face.scss');
const FACES = {
    alarmed: require('../assets/face-alarmed.png'),
    smug: require('../assets/face-smug.png'),
    startled: require('../assets/face-startled.png'),
    thinking: require('../assets/face-thinking.png')
};

module.exports = props => {
    return (
        <div className={styles.face}>
            <img src={ASSET_PATH + FACES[props.emotion]} />
        </div>
    );
};
