const domready = require('domready');

let render = () => {
    const app = require('./app');
    app();
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
    const hotRender = render;

    render = () => {
        try {
            hotRender();
        } catch (e) {
            console.log(e);
        }
    };

    module.hot.accept('./app', () => {
        setTimeout(render);
    });
}

// App
domready(render);
