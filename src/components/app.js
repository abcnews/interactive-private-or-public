/** @jsx Preact.h */
const Preact = require('preact');
const smoothscroll = require('smoothscroll');

const { getCounterArguments, getSummary } = require('../loader');

const Face = require('./face');
const Balloon = require('./balloon');
const HTML = require('./html');

const styles = require('./app.scss');

class App extends Preact.Component {
    constructor(props) {
        super(props);

        this.updateChoice = this.updateChoice.bind(this);
        this.reset = this.reset.bind(this);

        this.counterArguments = getCounterArguments();
        this.summary = getSummary();

        this.state = {
            currentChoice: null,
            currentFace: 'smug',
            counterArguments: [],
            canChoose: true,
            privateVerb: 'choosing',
            publicVerb: 'choosing',
            prompt: ''
        };
    }

    reset() {
        this.setState({
            currentChoice: null,
            currentFace: 'smug',
            counterArguments: [],
            canChoose: true,
            privateVerb: 'choosing',
            publicVerb: 'choosing',
            prompt: ''
        });
    }

    updateChoice(nextChoice) {
        let {
            currentChoice,
            currentFace,
            prompt,
            counterArguments,
            privateVerb,
            publicVerb,
            canChoose
        } = this.state;

        let heading = '';
        if (currentChoice !== nextChoice) {
            // Only show a heading if the choice has changed
            heading = `
                <h3><span>
                    You 
                    ${!currentChoice ? 'chose' : 'changed to'}
                    ${nextChoice === 'privateSchool'
                        ? 'Private School'
                        : 'Public School'}
                </span></h3>`;
        }

        const html = this.counterArguments[nextChoice].shift();

        counterArguments = counterArguments.concat(
            `<div class="${styles.argument} ${styles[
                nextChoice
            ]} ${styles.open}">
                ${heading}
                <div class="${styles.content}">
                    ${html}
                </div>
            </div>`
        );

        if (nextChoice === 'publicSchool') {
            publicVerb = 'staying with';
            privateVerb = 'changing to';
        } else {
            publicVerb = 'changing to';
            privateVerb = 'staying with';
        }

        switch (counterArguments.length) {
            case 0:
                break;
            case 1:
                currentFace = 'thinking';
                prompt = 'Has that changed your mind?';
                break;
            case 2:
                currentFace = 'startled';
                prompt = 'How about now?';
                break;
            default:
                currentFace = 'alarmed';
                prompt = 'Has that changed your mind?';
        }

        if (this.counterArguments[nextChoice].length === 0) {
            canChoose = false;
        }

        // Scroll to next argument
        setTimeout(() => {
            const nextArgumentElement = document.getElementById(
                `argument-${counterArguments.length - 1}`
            );

            smoothscroll(nextArgumentElement);
        }, 200);

        this.setState({
            currentChoice: nextChoice,
            currentFace,
            prompt,
            privateVerb,
            publicVerb,
            counterArguments,
            canChoose
        });
    }

    render() {
        const {
            counterArguments,
            canChoose,
            prompt,
            currentFace,
            privateVerb,
            publicVerb
        } = this.state;

        return (
            <div className={styles.wrapper}>
                <div className={styles.arguments}>
                    {counterArguments.map((html, index) => {
                        return (
                            <HTML
                                html={html}
                                key={html}
                                id={`argument-${index}`}
                            />
                        );
                    })}
                </div>

                {canChoose &&
                    <div>
                        <div className={styles.choices}>
                            <div className={styles.changedMind}>
                                {prompt}
                            </div>
                            <Balloon
                                privateSchool
                                onClick={e =>
                                    this.updateChoice('privateSchool')}
                                text={`I'm ${privateVerb} private school`}
                            />
                            <Balloon
                                publicSchool
                                onClick={e => this.updateChoice('publicSchool')}
                                text={`I'm ${publicVerb} public school`}
                            />
                        </div>
                        <Face emotion={currentFace} />
                    </div>}

                {!canChoose &&
                    <div className={styles.summary}>
                        <HTML html={this.summary} />

                        <div className={styles.choices}>
                            <Balloon
                                onClick={this.reset}
                                text="I want to start again"
                            />
                            <Face emotion="alarmed" />
                        </div>
                    </div>}
            </div>
        );
    }
}

module.exports = App;
