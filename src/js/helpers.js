// helpers.js was container of reuse function or set of function that use all project.
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const recipe_api = await Promise.race([
      uploadData
        ? fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(uploadData),
          })
        : fetch(url),
      timeout(TIMEOUT_SEC),
    ]);

    if (!recipe_api.ok) throw new Error(`Something Wrong!, ${recipe_api.url}`);

    return (res_recipe = await recipe_api.json());
  } catch (err) {
    throw err;
  }
};

// use instant of Fraction Module
export const numberToFraction = function (amount) {
  // This is a whole number and doesn't need modification.
  if (parseFloat(amount) === parseInt(amount)) {
    return amount;
  }
  // Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
  const gcd = function (a, b) {
    if (b < 0.0000001) {
      return a;
    }
    return gcd(b, Math.floor(a % b));
  };
  const len = amount.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = amount * denominator;
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  let base = 0;
  // In a scenario like 3/2, convert to 1 1/2
  // by pulling out the base number and reducing the numerator.
  if (numerator > denominator) {
    base = Math.floor(numerator / denominator);
    numerator -= base * denominator;
  }
  amount = Math.floor(numerator) + '/' + Math.floor(denominator);
  if (base) {
    amount = base + ' ' + amount;
  }
  return amount;
};

/*
export const getJSON = async url => {
  try {
    const recipe_api = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    if (!recipe_api.ok) throw new Error(`Recipe not found, ${recipe_api.url}`);

    return (res_recipe = await recipe_api.json());
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async (url, uploadData) => {
  try {
    const recipe_api = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    if (!recipe_api.ok) throw new Error(`Cannot send data, ${recipe_api.url}`);

    return (res_recipe = await recipe_api.json());
  } catch (err) {
    throw err;
  }
};
*/
