const { h, Component } = require('preact');
const smoothscroll = require('smoothscroll');

const Balloon = require('./Balloon');
const CounterArgument = require('./CounterArgument');
const HTML = require('./HTML');

const styles = require('./App.scss');

const ICONS = {
    private: [
        require('./icons/Backpack.png'),
        require('./icons/Window.png'),
        require('./icons/Toilet.png'),
        require('./icons/NoVacancy.png')
    ],
    privateIndex: 0,
    public: [
        require('./icons/BuildCharacter.png'),
        require('./icons/People.png'),
        require('./icons/Plane.png'),
        require('./icons/LeftBehind.png')
    ],
    publicIndex: 0,

    nextImage(type) {
        if (type === 'privateSchool') {
            ICONS.privateIndex = (ICONS.privateIndex + 1) % ICONS.private.length;
            return ICONS.private[ICONS.privateIndex];
        } else if (type === 'publicSchool') {
            ICONS.publicIndex = (ICONS.publicIndex + 1) % ICONS.public.length;
            return ICONS.public[ICONS.publicIndex];
        }
    }
};

class App extends Component {
    constructor(props) {
        super(props);

        this.updateChoice = this.updateChoice.bind(this);
        this.reset = this.reset.bind(this);

        this.state = {
            availableArguments: props.args,
            currentChoice: null,
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
        let { currentChoice, prompt, counterArguments, privateVerb, publicVerb, canChoose } = this.state;

        let heading = `You ${!currentChoice || currentChoice === nextChoice ? 'chose' : 'changed to'} ${
            nextChoice === 'privateSchool' ? 'Private School' : 'Public School'
        }`;

        counterArguments = counterArguments.concat({
            icon: ICONS.nextImage(nextChoice),
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
                prompt = 'Has that changed your mind?';
                break;
            case 2:
                prompt = 'How about now?';
                break;
            default:
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
        const { counterArguments, canChoose, prompt, privateVerb, publicVerb } = this.state;

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
                    </div>
                )}

                {!canChoose && (
                    <div className={styles.summary}>
                        <HTML html={this.props.summary} />

                        <div className={styles.choices}>
                            <Balloon onClick={this.reset} text="I want to start again" />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

module.exports = App;
