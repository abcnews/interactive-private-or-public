const { h, render } = require('preact');
const { getArguments, getSummary } = require('./loader');

const root = document.querySelector('[data-interactive-private-or-public-root]');

function init() {
    mount(getArguments(), getSummary());
}

let mount = (args, summary) => {
    const App = require('./components/App');
    render(<App args={args} summary={summary} />, root, root.firstChild);
};

if (module.hot) {
    const mountFunction = mount;
    mount = (args, summary) => {
        try {
            mountFunction(args, summary);
        } catch (error) {
            const ErrorBox = require('./components/ErrorBox');
            render(<ErrorBox error={error} />, root, root.firstChild);
        }
    };

    module.hot.accept('./components/App', () => {
        setTimeout(init);
    });
}

if (process.env.NODE_ENV === 'development') {
    require('preact/devtools');
    console.debug(`[interactive-private-or-public] public path: ${__webpack_public_path__}`);
}

if (window.__ODYSSEY__) {
    init();
} else {
    window.addEventListener('odyssey:api', init);
}
