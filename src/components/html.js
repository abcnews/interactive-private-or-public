import React from 'react';

class HTML extends React.Component {
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

export default HTML;
