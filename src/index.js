const Vue = require('vue');
const { getCounterArguments, getSummary } = require('./loader');

// Inject the template
document.querySelector(
    '[data-private-vs-public-school-root]'
).innerHTML = require('./template');

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
        face: 'smug'
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
            this.face = 'smug';
        },
        updateChoice(nextChoice) {
            let heading = '';
            if (this.currentChoice !== nextChoice) {
                // Only show a heading if the choice has changed
                heading = `<h3><span>You chose
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
                    this.face = 'thinking';
                    this.changedMind = 'Has that changed your mind?';
                    break;
                case 2:
                    this.face = 'startled';
                    this.changedMind = 'How about now?';
                    break;
                default:
                    this.face = 'alarmed';
                    this.changedMind = 'Has that changed your mind?';
            }

            if (this.counterArguments[this.currentChoice].length === 0) {
                this.canChoose = false;
            }
        }
    }
});
