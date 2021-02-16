/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */
import { PARALLAX_QUALITY, PXL2CFG, ParallaxDataFallback } from '../helpers/constants';
import { shuffleArray } from '../helpers';

export const ParallaxBG = props => {
  const {
    quality = PARALLAX_QUALITY.MEDIUM,
    data = ParallaxDataFallback,
    type = "common",
    dir = "E",
  } = props;

  let images_sorted = pickParallax(type, quality, data);
  console.debug(images_sorted);
  return (
    <div>
      {images_sorted.map((icon, index) => (
        <div key={index} style={{
          "backgroundImage": `url(${icon["img"]})`,
          "zIndex": -200 + icon["layer"],
          "animationName": (quality === PARALLAX_QUALITY.NONE ? "none" : `loop_${dir}`),
          "animationDuration": (quality === PARALLAX_QUALITY.NONE ? "0s" : `${40 * icon["speed"]}s`),
        }} className="parallax_container" />
      ))}
    </div>
  );
};

const pickParallax = (type, quality, image_dat) => {
  const target_parallax = image_dat[type];

  // Checks if pxl2cft returns a var or NaN (we do not want NaN)
  const NaNSafety = Number(PXL2CFG[quality]) ? Number(PXL2CFG[quality]) : 0;

  const rngImages = Math.min(
    Math.max(
      Math.floor(
        Math.random()*target_parallax["layers_max"]
      ), target_parallax["layers_min"]
    ), target_parallax["layers_max"]) + NaNSafety;

  let return_dat = []; // we cannot abort a map
  let max_initial_k = 0;
  for (const k in target_parallax["icons"]) {
    const image = target_parallax["icons"][k];
    // cool facts: K is a fucking string,
    // so if you dare to concat K, you will get k1
    const k_num = Number(k);
    if (k_num >= rngImages && !(target_parallax["icons"][k_num+1] && ("main_layer" in target_parallax["icons"][Number(k)+1]))) {
      continue;
    }
    return_dat.push(image);
    max_initial_k = k_num;
  }

  // random image picker
  /** @type {Array} */
  const arry = target_parallax["random"];
  const n_left = Math.max(rngImages - max_initial_k, 0);
  if (arry?.length && (n_left > 0)) {
    shuffleArray(arry);
    return_dat.push(arry.splice(0, n_left));
  }

  return return_dat;
};
