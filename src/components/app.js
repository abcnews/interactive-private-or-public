import React from 'react';
import smoothscroll from 'smoothscroll';
import ICON_BACKPACK from './icons/Backpack.png';
import ICON_BUILD_CHARACTER from './icons/BuildCharacter.png';
import ICON_LEFT_BEHIND from './icons/LeftBehind.png';
import ICON_NO_VACANCY from './icons/NoVacancy.png';
import ICON_PEOPLE from './icons/People.png';
import ICON_PLANE from './icons/Plane.png';
import ICON_TOILET from './icons/Toilet.png';
import ICON_WINDOW from './icons/Window.png';
import Balloon from './Balloon';
import CounterArgument from './CounterArgument';
import HTML from './HTML';
import styles from './App.scss';

const ICONS = {
  private: [
    { src: ICON_BACKPACK },
    { src: ICON_WINDOW },
    { src: ICON_TOILET },
    { src: ICON_NO_VACANCY }
  ],
  privateIndex: 0,
  public: [
    { src: ICON_BUILD_CHARACTER },
    { src: ICON_PEOPLE },
    { src: ICON_PLANE },
    { src: ICON_LEFT_BEHIND }
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

export default class App extends React.Component {
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

    // Preload the images
    ICONS.private.concat(ICONS.public).forEach(icon => {
      const img = document.createElement('img');
      img.src = icon.src;
      img.onload = e => {
        icon.width = img.width / 2;
        icon.height = img.height / 2;
      };
    });
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

    smoothscroll(document.querySelector('h2').previousElementSibling);
  }

  updateChoice(nextChoice) {
    let { currentChoice, prompt, counterArguments, privateVerb, publicVerb, canChoose } =
      this.state;

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
