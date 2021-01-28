/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */
import { Component, Fragment, useState } from 'react';
import packageJson from '../../package.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact } from '@fortawesome/free-brands-svg-icons';
import { faCoffee, faSave, faHeart, faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

import { setItem, getItem, configurables } from '../helpers/storage';
import { PARALLAX_QUALITY } from '../helpers/constants';
import { map } from '../helpers/helpers';
import { Collapsible } from './Collapsible';

export const Settings = props => {
  const [updated, setUpdated] = useState(false);
  // technique to *forcefully* update react on a stateless cmp
  const [sval, setSval] = useState(false);
  return (
    <div className="settings-blur">
      <div className="settings-filler" />
      <div className="settings-box">
        <div className="content-buttonrail">
          <h3 style={{ "display": "inline-block" }}>
            Settings
          </h3>
          <div
            className="button"
            onClick={() => props.toggleState()}>
            {updated ? (
              <Fragment>
                Save <FontAwesomeIcon icon={faSave} />
              </Fragment>
            ) : (
              <Fragment>
                Exit <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
              </Fragment>
            )}
          </div>
        </div>
        <br />
        <Collapsible title="Parallax Quality">
          {map((v, k) => (
            <div
              key={k}
              className={`button ${getItem("parallax_quality") === v ? "pepperthot-teal" : ""}`}
              style={(getItem("parallax_quality") === v) ? { "cursor": "default" } : {}}
              onClick={() => {
                if (getItem("parallax_quality") === v) {
                  // console.log("It's the same.");
                  return true;
                }
                setItem("parallax_quality", v);
                setUpdated(true);
                setSval(v);
              }} >
              {v} {/* ({k}) */}
            </div>
          ))(PARALLAX_QUALITY)}
        </Collapsible>
        <Collapsible title="Info">
          <Info />
        </Collapsible>
      </div>
    </div>
  );
};

/* do NOT stateless this */
class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "cached": [],
    };
    const CacheStack = async () => {
      let setVal = [];
      const keys = await caches.keys();
      for (const k in keys) {
        const a = await caches.open(keys[k]);
        const b = await a.keys();
        for (const v in b) {
          setVal.push(b[v]["url"]);
        }
      }
      this.setState({ "cached": setVal });
    };
    CacheStack();
  }

  async clearCache() {
    const keys = await caches.keys();
    for (const k in keys) {
      caches.delete(keys[k]);
    }
    console.log("Cache cleared!");
  }

  render() {
    return (
      <Fragment>
        <h3>SS13 Webmap</h3>
        A project started by AffectedArc07 with html help from LetterN
        and now this React page. Docker support from atlanta_ned.
        <br />
        Made with <FontAwesomeIcon icon={faHeart} />&nbsp;
        using <FontAwesomeIcon icon={faReact} spin />
        <br /> <br />
        <div className="content-buttonrail">
          <div
            className="button small ss13-blue"
            onClick={() => window.open("https://ko-fi.com/affectedarc07")}>
            Donate (affectedarc07) <FontAwesomeIcon icon={faCoffee} />
          </div>
          <div
            className="button small ss13-blue"
            onClick={() => window.open("https://ko-fi.com/LetterN")}>
            Donate (Letter_N) <FontAwesomeIcon icon={faCoffee} />
          </div>
        </div>
        <br />
        <br />
        <h4>Webmap Info</h4>
        Leaflet Version: {packageJson.dependencies.leaflet} <br />
        Webmap Version: {packageJson.version} &nbsp; (Latest)<br />
        Service worker:
        {navigator?.serviceWorker?.controller ? (
          navigator?.serviceWorker?.controller?.state === "activated" ? (
            " Installed and running."
          ) : (
            " Installed but not yet activated"
          )
        ) : (
          " Not installed nor running."
        )} <br />
        PWA Installed: No <br />
        <br />
        <h4>Cached Objects</h4>
        {JSON.stringify(this.state.cached, null, 1)}
        {!!this.state.cached.length && (
          <div className="button" onClick={e => this.clearCache()}>Clear Cache</div>
        )}
        <br />
      </Fragment>
    );
  }
}
