/**
 * @file
 * @copyright 2021 LetterN
 * @license MIT
 */

/**
 * Reads the "?thing=no"
 * ...or you can use URL() because this is html5
 * @returns {JSON} JSON
 */
export const readquery = () => {
  let json_out = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    json_out[key] = value;
  });
  return json_out;
};

/**
 * Creates an array of values by running each element in collection
 * thru an iteratee function. The iteratee is invoked with three
 * arguments: (value, index|key, collection).
 *
 * If collection is 'null' or 'undefined', it will be returned "as is"
 * without emitting any errors (which can be useful in some cases).
 *
 * @returns {any[]}
 */
export const map = iterateeFn => collection => {
  if (collection === null || collection === undefined) {
    return collection;
  }
  if (Array.isArray(collection)) {
    const result = [];
    for (let i = 0; i < collection.length; i++) {
      result.push(iterateeFn(collection[i], i, collection));
    }
    return result;
  }
  if (typeof collection === 'object') {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const result = [];
    for (let i in collection) {
      if (hasOwnProperty.call(collection, i)) {
        result.push(iterateeFn(collection[i], i, collection));
      }
    }
    return result;
  }
  throw new Error(`map() can't iterate on type ${typeof collection}`);
};
