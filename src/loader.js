const Immutable = require('immutable');

function extractPoints(section) {
    let points = [];
    let nodes = [];

    section.betweenNodes.forEach(node => {
        if (node.innerText && node.innerText.toLowerCase().indexOf('counter argument') === 0) {
            if (nodes.length === 1 && nodes[0].tagName === 'H2') {
                // Just a single H2
                nodes = [];
            } else {
                points.push({ nodes });
                nodes = [];
            }
        } else if (node.tagName) {
            nodes.push(node);
        }

        node.parentElement.removeChild(node);
    });

    return Immutable.List(points);
}

let args;
function getArguments() {
    if (!args) {
        args = Immutable.Map();
        args = args.set(
            'privateSchool',
            extractPoints(window.__ODYSSEY__.utils.anchors.getSections('privateschool')[0])
        );
        args = args.set('publicSchool', extractPoints(window.__ODYSSEY__.utils.anchors.getSections('stateschool')[0]));
    }
    return args;
}

let summary;
function getSummary() {
    if (!summary) {
        summary = window.__ODYSSEY__.utils.anchors.getSections('summary')[0];
        summary = summary.betweenNodes
            .map(node => {
                node.parentElement.removeChild(node);
                if (node.innerText && node.innerText.toLowerCase().indexOf('summary') === 0) {
                    return null;
                } else {
                    return node;
                }
            })
            .filter(n => n);
    }

    return summary;
}

module.exports = { getArguments, getSummary };
