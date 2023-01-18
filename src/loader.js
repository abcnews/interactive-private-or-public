import { getMountValue, isMount } from '@abcnews/mount-utils';
import Immutable from 'immutable';

const POINT_TYPES = ['public', 'private'];

function extractPoints(section) {
  let points = [];
  let nodes = [];

  section.betweenNodes.forEach(node => {
    if (isMount(node) && POINT_TYPES.includes(getMountValue(node))) {
      if (nodes.length > 1) {
        points.push({
          type: getMountValue(node),
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

export function getArguments() {
  if (!args) {
    const allArguments = extractPoints(window.__ODYSSEY__.utils.mounts.getSections('arguments')[0]);

    args = Immutable.Map();
    args = args.set(
      'privateSchool',
      allArguments.filter(a => a.type === 'private')
    );
    args = args.set(
      'publicSchool',
      allArguments.filter(a => a.type === 'public')
    );
  }
  return args;
}

let summary;

export function getSummary() {
  if (!summary) {
    summary = window.__ODYSSEY__.utils.mounts.getSections('summary')[0];
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
