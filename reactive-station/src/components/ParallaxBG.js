/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */
import { PARALLAX_QUALITY, PXL2CFG, ParallaxDataFallback } from '../helpers/constants';

export const ParallaxBG = props => {
  const {
    quality = PARALLAX_QUALITY.MEDIUM,
    data = ParallaxDataFallback,
    type = "common",
    dir = "E",
  } = props;

  const target_parallax = data[type];

  const NaNSafety = Number(PXL2CFG[quality]) ? Number(PXL2CFG[quality]) : 0;
  const rngImages = Math.min(Math.max(Math.floor(Math.random()*target_parallax["layers_max"]), target_parallax["layers_min"]), target_parallax["layers_max"]) + NaNSafety;

  let images_sorted = []; // we cannot abort a map
  let max_initial_k = 0;
  for (const k in target_parallax["icons"]) {
    const image = target_parallax["icons"][k];
    // cool facts: K is a fucking string,
    // so if you dare to concat K, you will get k1
    if (Number(k) >= rngImages && !(target_parallax["icons"][Number(k)+1] && ("main_layer" in target_parallax["icons"][Number(k)+1]))) {
      continue;
    }
    images_sorted.push(image);
    max_initial_k = k;
  }
  // let's not typecast this target_parallax["icons"].length times, yeah?
  max_initial_k = Number(max_initial_k);
  // random image picker
  /** @type {Array} */
  const arry = target_parallax["random"];
  if (arry
    && (Math.max(rngImages - max_initial_k, 0) > 0)
    && quality !== PARALLAX_QUALITY.NONE) {
    Array.from(
      Array(Math.max(rngImages - max_initial_k, 1))).forEach(() => {
      const randomElement = arry[Math.floor(Math.random() * arry.length)];
      images_sorted.push(randomElement);
    });
  }

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
