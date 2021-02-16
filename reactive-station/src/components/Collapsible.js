/**
 * Modified from TGUI
 * @file
 * @license MIT
 */

import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

export class Collapsible extends Component {
  constructor(props) {
    super(props);
    const { open } = props;
    this.state = {
      open: open || false,
    };
  }

  render() {
    const { props } = this;
    const { open } = this.state;
    const {
      children,
      title,
      ...rest
    } = props;
    return (
      <div className="colapsible-container">
        <div
          className="colapsible-button"
          onClick={() => this.setState({ open: !open })}
          {...rest}>
          {title}
          <div style={{ marginLeft: "auto", marginRight: 0 }}>
            <FontAwesomeIcon
              icon={open ? faArrowCircleUp : faArrowCircleDown} />
          </div>
        </div>
        <div className={`collapsible-body ${open ? "collapsible-open" : "collapsible-closed"}`}>
          {children}
        </div>
      </div>
    );
  }
}
