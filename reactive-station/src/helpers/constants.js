/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */

/**
 * Page(s) on the site.
 */
export const STATES = {
  LOADING: "loading",
  MENU: "menu",
  MAP: "map",
};

// 0 1 2 3 = NONE (no animation, -2) LOW (-1) MED (0) HIGH (+1)

export const PARALLAX_QUALITY = {
  NONE: "None",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const ParallaxDataFallback = {
  "tg": {
    "layers_min": 3,
    "layers_max": 5,
    "icons": [
      {
        "img": "./assets/parallax/tg/layer_1.png",
        "speed": 0.6,
        "layer": 1,
        "main_layer": true,
      },
      {
        "img": "./assets/parallax/tg/layer_2.png",
        "speed": 1,
        "layer": 2,
      },
      {
        "img": "./assets/parallax/tg/layer_3.png",
        "speed": 1.4,
        "layer": 3,
      },
    ],
    "random": [
      {
        "img": "./assets/parallax/tg/space_gas.png",
        "speed": 3,
        "layer": 3,
        "random": true,
      },
      {
        "img": "./assets/parallax/tg/asteroids.png",
        "speed": 3,
        "layer": 3,
        "random": true,
      },
    ],
  },
  "common": {
    "layers_min": 3,
    "layers_max": 3,
    "icons": [
      {
        "img": "./assets/parallax/common/layer_1.png",
        "speed": 0.6,
        "layer": 1,
        "main_layer": true,
      },
      {
        "img": "./assets/parallax/common/layer_2.png",
        "speed": 1,
        "layer": 2,
      },
      {
        "img": "./assets/parallax/common/layer_3.png",
        "speed": 1.4,
        "layer": 3,
      },
    ],
  },
};

export const PXL2CFG = {
  "None": -2,
  "Low": -1,
  "Medium": 0,
  "High": + 1,
};
