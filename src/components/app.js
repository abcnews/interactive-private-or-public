const { h, Component } = require('preact');
const smoothscroll = require('smoothscroll');

const Face = require('./Face');
const Balloon = require('./Balloon');
const CounterArgument = require('./CounterArgument');
const HTML = require('./HTML');

const styles = require('./App.scss');

class App extends Component {
    constructor(props) {
        super(props);

        this.updateChoice = this.updateChoice.bind(this);
        this.reset = this.reset.bind(this);

        this.state = {
            availableArguments: props.args,
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
            availableArguments: this.props.args,
            counterArguments: [],
            canChoose: true,
            privateVerb: 'choosing',
            publicVerb: 'choosing',
            prompt: ''
        });

        smoothscroll(document.querySelector('p'));
    }

    updateChoice(nextChoice) {
        let { currentChoice, currentFace, prompt, counterArguments, privateVerb, publicVerb, canChoose } = this.state;

        let heading = false;
        if (currentChoice !== nextChoice) {
            // Only show a heading if the choice has changed
            heading = `You ${!currentChoice ? 'chose' : 'changed to'} ${nextChoice === 'privateSchool'
                ? 'Private School'
                : 'Public School'}`;
        }

        counterArguments = counterArguments.concat({
            choice: nextChoice,
            heading,
            nodes: this.state.availableArguments.get(nextChoice).first().nodes
        });

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

        // This argument is the last one?
        if (this.state.availableArguments.get(nextChoice).count() === 1) {
            canChoose = false;
        }

        // Scroll to next argument
        setTimeout(() => {
            smoothscroll(document.getElementById(`argument-${counterArguments.length - 1}`));
        }, 200);

        this.setState(state => {
            return {
                currentChoice: nextChoice,
                currentFace,
                prompt,
                privateVerb,
                publicVerb,
                availableArguments: state.availableArguments.set(
                    nextChoice,
                    state.availableArguments.get(nextChoice).shift()
                ),
                counterArguments,
                canChoose
            };
        });
    }

    render() {
        const { counterArguments, canChoose, prompt, currentFace, privateVerb, publicVerb } = this.state;

        return (
            <div className={styles.wrapper}>
                <div className={styles.arguments}>
                    {counterArguments.map((arg, index) => {
                        return <CounterArgument arg={arg} key={index} index={index} />;
                    })}
                </div>

                {canChoose && (
                    <div>
                        <div className={styles.choices}>
                            <div className={styles.changedMind}>{prompt}</div>
                            <Balloon
                                privateSchool
                                onClick={e => this.updateChoice('privateSchool')}
                                text={`I'm ${privateVerb} private school`}
                            />
                            <Balloon
                                publicSchool
                                onClick={e => this.updateChoice('publicSchool')}
                                text={`I'm ${publicVerb} public school`}
                            />
                        </div>
                        <Face emotion={currentFace} />
                    </div>
                )}

                {!canChoose && (
                    <div className={styles.summary}>
                        <HTML html={this.props.summary} />

                        <div className={styles.choices}>
                            <Balloon onClick={this.reset} text="I want to start again" />
                            <Face emotion="alarmed" />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

module.exports = App;
