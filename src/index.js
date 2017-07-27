const Vue = require('vue');

// Get an array of HTML from matching queries
function htmlForQuerySelector(query) {
    return Array.prototype.map.call(
        document.querySelectorAll(query),
        n => n.innerHTML
    );
}

function getCounterArguments() {
    return {
        privateSchool: htmlForQuerySelector('.private-school'),
        publicSchool: htmlForQuerySelector('.public-school')
    };
}

let counterArguments = getCounterArguments();

const app = new Vue({
    el: '#app',
    data: {
        currentChoice: null,
        args: [],
        canChoose: true
    },
    methods: {
        reset() {
            this.currentChoice = null;
            this.args = [];
            this.canChoose = true;
            counterArguments = getCounterArguments();
        },
        updateChoice(schoolType) {
            this.currentChoice = schoolType;

            const html = counterArguments[this.currentChoice].shift();
            const heading =
                this.currentChoice === 'privateSchool'
                    ? 'Private School?'
                    : 'Public School?';

            this.args.push(
                `<div class="argument ${this.currentChoice} open">
                    <h3>${heading}</h3>
                    <div class="content">
                        ${html}
                    </div>
                </div>`
            );

            if (counterArguments[this.currentChoice].length === 0) {
                console.log('nope');
                this.canChoose = false;
            } else {
                console.log('keep going');
            }
        }
    }
});
