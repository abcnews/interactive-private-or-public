const smoothscroll = require('smoothscroll');
const Vue = require('vue');
const { getCounterArguments, getSummary } = require('./loader');

// Assets
require('./assets/index.scss');
const FACES = {
    ALARMED: require('./assets/face-alarmed.png'),
    SMUG: require('./assets/face-smug.png'),
    STARTLED: require('./assets/face-startled.png'),
    THINKING: require('./assets/face-thinking.png')
};

module.exports = () => {
    // Inject the template
    const rootElement = document.querySelector(
        '[data-private-vs-public-school-root]'
    );
    if (rootElement.innerHTML === '') {
        rootElement.innerHTML = require('./template');
    }

    // The main Vue app
    const app = new Vue({
        el: '#app',
        data: {
            currentChoice: null,
            counterArguments: getCounterArguments(),
            summary: getSummary(),
            args: [],
            canChoose: true,
            privateVerb: 'choosing',
            publicVerb: 'choosing',
            changedMind: '',
            face: FACES.SMUG,
            faceAlarmed: FACES.ALARMED
        },
        methods: {
            reset() {
                this.currentChoice = null;
                this.counterArguments = getCounterArguments();
                this.summary = getSummary();
                this.args = [];
                this.canChoose = true;
                this.privateVerb = 'choosing';
                this.publicVerb = 'choosing';
                this.changedMind = '';
                this.face = faceURL('smug');

                smoothscroll(rootElement);
            },
            updateChoice(nextChoice) {
                let heading = '';
                if (this.currentChoice !== nextChoice) {
                    // Only show a heading if the choice has changed
                    heading = `
                        <h3><span>
                            You 
                            ${!this.currentChoice ? 'chose' : 'changed to'}
                            ${nextChoice === 'privateSchool'
                                ? 'Private School'
                                : 'Public School'}
                        </span></h3>`;
                }

                this.currentChoice = nextChoice;

                const html = this.counterArguments[this.currentChoice].shift();

                this.args.push(
                    `<div class="argument ${this.currentChoice} open">
                        ${heading}
                        <div class="content">
                            ${html}
                        </div>
                    </div>`
                );

                if (this.currentChoice === 'publicSchool') {
                    this.publicVerb = 'staying with';
                    this.privateVerb = 'changing to';
                } else {
                    this.publicVerb = 'changing to';
                    this.privateVerb = 'staying with';
                }

                switch (this.args.length) {
                    case 0:
                        break;
                    case 1:
                        this.face = FACES.THINKING;
                        this.changedMind = 'Has that changed your mind?';
                        break;
                    case 2:
                        this.face = FACES.STARTLED;
                        this.changedMind = 'How about now?';
                        break;
                    default:
                        this.face = FACES.ALARMED;
                        this.changedMind = 'Has that changed your mind?';
                }

                if (this.counterArguments[this.currentChoice].length === 0) {
                    this.canChoose = false;

                    // Scroll to the summary
                    setTimeout(() => {
                        const summaryElement = document.querySelector(
                            '.summary'
                        );
                        smoothscroll(summaryElement);
                    }, 300);
                } else {
                    // Scroll to next argument
                    setTimeout(() => {
                        const nextArgumentElement = document.querySelector(
                            `[data-arg-index="${this.args.length - 1}"]`
                        );
                        smoothscroll(nextArgumentElement);
                    }, 300);
                }
            }
        }
    });
};
