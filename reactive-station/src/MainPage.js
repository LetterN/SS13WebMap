/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */
import { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCoffee, faCog, faExclamationCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import { LeafletMap, Collapsible, ParallaxBG, Settings, Icon } from './components';
import { STATES, PARALLAX_QUALITY, ParallaxDataFallback } from './helpers/constants';
import { getItem, setItem } from './helpers/storage';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "page": STATES.MENU,
      "options_visible": false,
      "available_maps": [],
      "parallax_types": [],
    };
    this.selected_instance_dat = {};

    const iQ = getItem("parallax_quality");
    if (!iQ) {
      setItem("parallax_quality", PARALLAX_QUALITY.MEDIUM);
    }
    this.cachedQuality = iQ;
  }

  componentDidMount() {
    // cannot use setstate on constructor
    this.JsonFetcher();
  }

  JsonFetcher = async () => {
    const avail_map = await (
      await fetch(`${process.env.PUBLIC_URL}/data/available_maps.json`)
    ).json();
    this.setState({ "available_maps": avail_map });
    const para_type = await (
      await fetch(`${process.env.PUBLIC_URL}/data/parallax_types.json`)
    ).json();
    this.setState({ "parallax_types": para_type });
  };

  // swaps the map and sets the state to MAP
  setMap(data) {
    this.selected_instance_dat = data;
    console.log("SET", data);
    this.setState({ "page": STATES.MAP });
  }

  // return to menu and clear cached map
  resetMap() {
    this.selected_instance_dat = {};
    this.setState({ "page": STATES.MENU });
  }

  // option toggle
  toggleOptions() {
    const { options_visible } = this.state;
    this.setState({ "options_visible": !options_visible });
  }

  render() {
    return (
      <Fragment>
        {!!this.state.options_visible && (
          <Settings toggleState={this.toggleOptions.bind(this)} />
        )}
        <ParallaxBG
          quality={this.cachedQuality}
          type={("background" in this.selected_instance_dat) ? this.selected_instance_dat["background"] : "tg"}
          dir={("dir" in this.selected_instance_dat) ? this.selected_instance_dat["dir"] : "E"}
          data={
            this.state.parallax_types.length
              ? this.state.parallax_types
              : ParallaxDataFallback
          } />
        {this.state.page === STATES.MENU ? (
          <div
            className="content-box"
            style={{ overflowY: this.state.options_visible ? 'hidden' : 'visible' }}>
            <Header toggleOptions={this.toggleOptions.bind(this)} />
            <div className="content-footer">
              <Collapsible title={
                <div>
                  <FontAwesomeIcon icon={faExclamationCircle} />&nbsp;
                  <b>NOTICE</b>&nbsp;- PSA For Server Headcoders/Maintainers
                </div>
              }>
                I do <b>NOT</b> actively track repositories and their map
                rotation. Getting a new map added or an old map removed
                is entirely on you or your playerbase to request.
              </Collapsible>
              <Collapsible title={
                <div>
                  <FontAwesomeIcon icon={faQuestionCircle} />&nbsp;
                  FAQ
                </div>
              }>
                <FAQText />
              </Collapsible>
              {this.state.available_maps.length ? (
                <div>
                  Loading maps!
                  <div className="loader-spinner" />
                </div>
              ) : (
                this.state.available_maps.map((map, k) => (
                  <Maps key={k} map={map} setMap={this.setMap.bind(this)} />
                ))
              )}
            </div>
          </div>
        ) : (
          <Fragment>
            <div
              style={{ zIndex: 4000000 }}
              className="button"
              onClick={() => this.resetMap()}>
              Return
            </div>
            <LeafletMap
              config={this.selected_instance_dat}
            />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const Maps = props => {
  const {
    map,
    setMap = a => {},
  } = props;
  return (
    <Collapsible
      key={map.name}
      title={
        <div
          style={{ display: "flex", alignItems: "center" }}>
          {!!map.icon && (
            <Icon
              url={
                process.env.PUBLIC_URL
                + `/assets/logos/${map.name.toLowerCase()}.png`
              } />
          )}
          <span style={{ marginLeft: "0.5em" }}>
            {map.name}
          </span>
        </div>
      }>
      <div className="content-buttonrail">
        {map?.maps?.map(map_instance => (
          <div
            className="button ss13-blue"
            key={map_instance.name}
            onClick={e => setMap(map_instance)}>
            {map_instance.name}
          </div>
        ))}
      </div>
    </Collapsible>
  );
};

const FAQText = () => (
  <Fragment>
    <h3>What is this?</h3>
    <p>
      This is a small project made by me to
      help newcomers learn the SS13 maps easier
    </p>

    <h3>How do I get a map here?</h3>
    <p>Join the discord, and head to the <i>#request-maps</i> channel.</p>

    <h3>How often is this updated?</h3>
    <p>
      All current codebases will automatically update any time a map edit
      on a specific codebase is made.
    </p>

    <h3>Why do some servers have fancy names and icons?</h3>
    <p>
      These servers have been granted fancy status. In return,
      they get fancy parralax, co-ordinate readout on the maps,
      their icon in the list, and a color in the list.
    </p>

    <h3>How do I get fancy status?</h3>
    <p>
      Simply post a link to this to your playerbase,
      and say you approve of the project,
      then you will be granted fancy status.
    </p>
  </Fragment>
);

const Header = props => {
  const {
    toggleOptions = () => {},
  } = props;
  // Header
  return (
    <div className="content-header">
      <div className="content-title">
        SS13 WebMap
      </div>
      <div className="content-title-text">
        <b>Created by AffectedArc07</b>
        <br />
        Special thanks to <b>Letter_N</b>
        (For this react page),
        And to <b>atlanta_ned</b> (For Docker tech support)
      </div>
      <div className="content-buttonrail">
        <div
          className="button ss13-blue"
          onClick={() => window.open("https://github.com/AffectedArc07/SS13WebMap")}
          title="Contribute Here!">
          Github <FontAwesomeIcon icon={faGithub} />
        </div>
        {/* SCRAPERS BEGONE */}
        <div
          className="button ss13-blue"
          onClick={() => window.open("https://disco"+"rdapp.com/inv"+"ite/pj"+"BpxHa")}
          title="Request maps here!">
          Discord <FontAwesomeIcon icon={faDiscord} />
        </div>
        <div
          className="button ss13-blue"
          onClick={() => window.open("https://ko-fi.com/affectedarc07")}>
          Donate <FontAwesomeIcon icon={faCoffee} />
        </div>
        <div
          className="button ss13-blue"
          onClick={() => toggleOptions()}>
          Options <FontAwesomeIcon icon={faCog} />
        </div>
      </div>
    </div>
  );
};
