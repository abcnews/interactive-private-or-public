const domready = require('domready');
const smoothscroll = require('smoothscroll');
const Vue = require('vue');
const { getCounterArguments, getSummary } = require('./loader');

domready(() => {
    // Inject the template
    const rootElement = document.querySelector(
        '[data-private-vs-public-school-root]'
    );
    rootElement.innerHTML = require('./template');

    // Work out where the images are coming from
    const imageRoot = rootElement.getAttribute('data-asset-root');

    function faceURL(face) {
        return imageRoot + 'face-' + face + '.png';
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
            face: faceURL('smug'),
            faceAlarmed: faceURL('alarmed')
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
                        this.face = faceURL('thinking');
                        this.changedMind = 'Has that changed your mind?';
                        break;
                    case 2:
                        this.face = faceURL('startled');
                        this.changedMind = 'How about now?';
                        break;
                    default:
                        this.face = faceURL('alarmed');
                        this.changedMind = 'Has that changed your mind?';
                }

                if (this.counterArguments[this.currentChoice].length === 0) {
                    this.canChoose = false;
                }

                // Scroll to next argument
                setTimeout(() => {
                    const nextArgumentElement = document.querySelector(
                        `[data-arg-index="${this.args.length - 1}"]`
                    );
                    smoothscroll(nextArgumentElement);
                }, 200);
            }
        }
    });
});
