// Find the content
function querySelectorToArray(query) {
    return Array.prototype.slice.call(document.querySelectorAll(query));
}

let ORIGINAL_COUNTER_ARGUMENTS = null;
let ORIGINAL_SUMMARY = null;

// Reset the counter aguments list
module.exports.getCounterArguments = function() {
    if (ORIGINAL_COUNTER_ARGUMENTS) {
        return {
            privateSchool: [].concat(ORIGINAL_COUNTER_ARGUMENTS.privateSchool),
            publicSchool: [].concat(ORIGINAL_COUNTER_ARGUMENTS.publicSchool)
        };
    }

    let _counterArguments = {
        privateSchool: [],
        publicSchool: []
    };

    // Find the headings for private and public
    const headings = querySelectorToArray('h2').filter(
        el => el.innerText.indexOf('school') >= 0
    );

    // Jump over the content and pull out the counter arguments
    headings.forEach(heading => {
        const type =
            heading.innerText.indexOf('private') >= 0
                ? 'privateSchool'
                : 'publicSchool';

        let index = 0;

        let el = heading.nextSibling;
        while (
            el.tagName !== 'H2' &&
            el !== null &&
            el.innerText !== 'Summary'
        ) {
            const newCounterFound =
                el.innerText &&
                el.innerText.toLowerCase().indexOf('counter argument') >= 0;

            if (newCounterFound) {
                index++;
            } else if (el.outerHTML) {
                _counterArguments[type][index] =
                    _counterArguments[type][index] || '';
                _counterArguments[type][index] += el.outerHTML;
            }

            el = el.nextSibling;
            if (el && el.previousSibling) {
                el.previousSibling.remove();
            }
        }

        heading.remove();

        _counterArguments[type] = _counterArguments[type].filter(a => a);
    });

    ORIGINAL_COUNTER_ARGUMENTS = {
        privateSchool: [].concat(_counterArguments.privateSchool),
        publicSchool: [].concat(_counterArguments.publicSchool)
    };

    return _counterArguments;
};

module.exports.getSummary = function() {
    if (ORIGINAL_SUMMARY) return ORIGINAL_SUMMARY;

    let summary = querySelectorToArray('p').find(
        p => p.innerText === 'Summary'
    );

    let html = '';
    let el = summary;
    while (
        el &&
        (typeof el.tagName === 'undefined' ||
            el.tagName === 'P' ||
            el.tagName === 'UL')
    ) {
        if (el.outerHTML && el.innerText !== 'Summary') {
            html += el.outerHTML;
        }

        if (el.nextSibling) {
            el = el.nextSibling;
            el.previousSibling.remove();
        } else {
            el.remove();
            el = null;
        }
    }

    ORIGINAL_SUMMARY = '' + html;

    return html;
};
