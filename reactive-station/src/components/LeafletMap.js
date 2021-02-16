/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */
import { Component, Fragment, createRef } from 'react';
import Leaflet from 'leaflet';


/**
 * Leaflet Map
 *
 * config (passed through props.config):
 * - image_config
 *   - map
 *   - pipenet
 * - bounds: [point1[lat, lng], point2[lat, lng]]
 * - map_config
 *   - minZoom: Number
 *   - maxZoom: Number
 *   - center: [lat, lng]
 *   - zoom: Number
 *
 */
export class LeafletMap extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();

    const config = props.config || {};
    this.bounds = config.bounds;
    this.mapconfig = {
      "crs": Leaflet.CRS.Simple,
      ...config.map_config,
    };
    this.debug = props.debug || false;

    // Map information
    this.image_config = config.map_files;

    /** @type {Leaflet.Map} */
    this.webmap;
    /**
     * tl;dr: tracking to see if it got pixelated
     *   (only happens when zoom level is 6 for optimzation reasons,
     *   and it looks bad when zoom is above 5)
     */
    this.webmap_pixel_improve = false;
    if (this.debug) {
      console.info("Config:", props.config);
    }
  }
  componentDidMount() {
    if (!this.bounds) {
      console.error("No bounds. What the fuck?!", this.bounds);
      return;
    }
    this.loadCanvas();
  }

  loadCanvas() {
    // Init the map
    this.webmap = Leaflet.map(this.canvasRef.current, this.mapconfig);
    this.webmap.fitBounds(this.bounds).setMaxBounds(this.bounds);
    this.webmap.attributionControl.setPrefix('SS13 WebMap by AffectedArc07');

    // Bake the layers (todo: preload image @ main page)
    const map_layers = bakeLayer(this.image_config, this.bounds, this.webmap);
    Leaflet.control.layers(map_layers.maps, map_layers.pipenet)
      .addTo(this.webmap);

    // Mousemove listiner for cords
    // (not inside mousemove because recreating this/tick is a crime.)
    const polygon = Leaflet.polygon([], { "fill": false, "color": '#40628a', "weight": 5 })
      .addTo(this.webmap);
    this.webmap.on('mousemove', e => {
      let lat = Math.floor(e.latlng.lat);
      let lng = Math.floor(e.latlng.lng);
      polygon.setLatLngs([
        [lat, lng],
        [lat + 1, lng],
        [lat + 1, lng + 1],
        [lat, lng + 1],
        [lat, lng],
      ])
        .redraw()
        .bindTooltip(`${lat}, ${lng}${this.debug ? `, (REAL ${e.latlng})` : ""}`)
        .openTooltip()
        .addTo(this.webmap); // todo: test if this is needed
    });

    // At 6 we want it to be pixelated (better image quality & performance).
    this.webmap.on('zoomend', e => {
      const zoom = Math.floor(this.webmap.getZoom());

      if (zoom < 6 && this.webmap_pixel_improve) {
        this.webmap_pixel_improve = false;
        this.canvasRef.current.style["image-rendering"] = "auto";
        return true;
      }
      if (zoom >= 6 && !this.webmap_pixel_improve) {
        this.webmap_pixel_improve = true;
        this.canvasRef.current.style["image-rendering"] = "pixelated";
        return true;
      }
    });
  }

  render() {
    return (
      <Fragment>
        {this.debug && (
          <div>
            <b>DEBUG:</b>
            {JSON.stringify(this.props.config)}<br />
            {JSON.stringify(this.mapconfig)} <br />
          </div>
        )}
        <div
          className={"webmap"}
          ref={this.canvasRef} />
      </Fragment>
    );
  }
}

/**
 * @param {JSON} data
 * @param {Array} bounds
 * @param {Leaflet.Map} webmap
 */
const bakeLayer = (data, bounds, webmap) => {
  const mapjson = data.map;
  const pipenetjson = data.pipenet;
  let return_dat = {
    "maps": {},
    "pipenet": {},
  };

  for (let station_map in mapjson) {
    const URL = mapjson[station_map].url;
    // something something tell the worker to update the URL img
    const zlevel = mapjson[station_map].z;
    const name = mapjson[station_map].name;

    const image = Leaflet.imageOverlay(URL, bounds);
    let zname = "Base Map";

    if (zlevel === 1) {
      image.addTo(webmap);
    }
    if (name) {
      zname = name;
    } else if (mapjson.length > 1) {
      zname = "Deck " + zlevel;
    }
    return_dat.maps[zname] = image; // {maps:{"z1":"imageOverlay"}}
  }
  console.info("done baking map");

  if (pipenetjson.length === 0) {
    // early return because pipenetjson length is 0
    console.info("no pipenet found, skipping pipenet baking");
    return return_dat;
  }

  for (let thing in pipenetjson) {
    const URL = pipenetjson[thing].url;
    const zlevel = pipenetjson[thing].z;
    const image = Leaflet.imageOverlay(URL, bounds);
    let zname = "Pipenet";

    if (URL === "" || URL === undefined) {
      continue;
    }
    if (pipenetjson.length > 1) {
      zname = "Pipenet Z:"+zlevel;
    }

    return_dat.pipenet[zname] = image; // {pipeOpt:{"z1":"imageOverlay"}
  }
  console.info("done baking pipenet");
  return return_dat;
};
