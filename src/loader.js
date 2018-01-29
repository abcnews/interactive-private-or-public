const Immutable = require('immutable');

function extractPoints(section) {
    let points = [];
    let nodes = [];

    section.betweenNodes.forEach(node => {
        if (node.tagName && node.tagName === 'A' && ['private', 'public'].indexOf(node.getAttribute('name')) > -1) {
            if (nodes.length > 1) {
                points.push({
                    type: node.getAttribute('name'),
                    nodes
                });
            }
            nodes = [];
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
        const allArguments = extractPoints(window.__ODYSSEY__.utils.anchors.getSections('arguments')[0]);

        args = Immutable.Map();
        args = args.set('privateSchool', allArguments.filter(a => a.type === 'private'));
        args = args.set('publicSchool', allArguments.filter(a => a.type === 'public'));
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
