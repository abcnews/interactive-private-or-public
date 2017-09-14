const { h, Component } = require('preact');

class HTML extends Component {
    componentDidMount() {
        if (!this.wrapper) return;
        if (!this.props.html) return;

        this.props.html.forEach(node => {
            this.wrapper.appendChild(node);
        });
    }

    componentWillUnmount() {
        if (!this.wrapper) return;
        if (!this.props.html) return;

        this.props.html.forEach(node => {
            this.wrapper.removeChild(node);
        });
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div
                ref={el => (this.wrapper = el)}
                id={this.props.id}
                className={`u-richtext ${this.props.className || ''}`}
            />
        );
    }
}

module.exports = HTML;
