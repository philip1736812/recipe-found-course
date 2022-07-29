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
