import { PARALLAX_QUALITY } from './constants';

const storageKey = "ss13webmap-";
// todo: fallback
const storage = ("localStorage" in window) ? window.localStorage : window.sessionStorage;

export const default_config = {
  "parallax_quality": PARALLAX_QUALITY.MEDIUM,
};

export const configurables = [
  "parallax_quality",
];

export const setItem = (key, value) => {
  if (getItem(key) === value) {
    return false;
  }
  storage.setItem(storageKey + key, value);
};

export const getItem = key => {
  return storage.getItem(storageKey + key);
};
