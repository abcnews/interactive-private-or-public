const domready = require('domready');

let render = () => {
    require('./app')();
};

// Do some hot reload magic with errors
if (process.env.NODE_ENV !== 'production' && module.hot) {
    render = require('../builder/ah-ah-ah')(render);
    module.hot.accept('./app', () => {
        setTimeout(render);
    });
}

domready(render);
