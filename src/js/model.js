import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, SERVING_MIN, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search_result: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  localStorage: [],
};


/**
 * 
 * @param {*} data 
 * @returns 
 */
const createRecipeObject = data => {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    time: recipe.cooking_time,
    img: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async hash => {
  try {
    const recipe_json = await AJAX(`${API_URL}/${hash}?key=${API_KEY}`);

    // 2) re-structuring
    state.recipe = createRecipeObject(recipe_json);

    // check bookmarks
    if (state.localStorage.some(b => b.id === hash))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async query => {
  try {
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    const { recipes: search_result } = data;

    state.search_result.results = search_result.map(rec => {
      return {
        id: rec.id,
        img: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    state.search_result.page = 1;
  }
};

export const getSearchResultPage = (page = state.search_result.page) => {
  state.search_result.page = page;
  const start = (page - 1) * state.search_result.resultPerPage;
  const end = page * state.search_result.resultPerPage;

  return state.search_result.results.slice(start, end);
};

export const updateServing = newServing => {
  if (newServing == SERVING_MIN) return;
  state.recipe.ingredients.forEach(ing => {
    if (typeof newServing !== 'number') return;
    if (!ing.quantity) return;

    ing.quantity = (
      (ing.quantity / state.recipe.servings) *
      newServing
    ).toFixed(2);
  });

  state.recipe.servings = newServing;
};

export const add_delete_LocalStorage_data = recipe => {
  // Store hash bookmarks and set it to local storage

  if (state.localStorage.some(state_hash => state_hash.id == recipe.id)) {
    state.recipe.bookmarked = false;

    // delete bookmarks in localStorage

    //  ----> Old school
    // state.localStorage.forEach((rec, i) => {
    //   if (rec.id === recipe.id) state.localStorage.splice(i, 1);
    // });

    // -----> modern way
    const index = state.localStorage.findIndex(ind => ind.id === recipe.id);
    if (typeof index == 'number') state.localStorage.splice(index, 1);

    window.localStorage.setItem(
      'bookmarks',
      JSON.stringify(state.localStorage)
    );
    return;
  }

  state.localStorage.push(recipe);
  window.localStorage.setItem('bookmarks', JSON.stringify(state.localStorage));

  // Mark bookmark as bookmarks
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const getLocalStorage_data = () => {
  const data_JSON = window.localStorage.getItem('bookmarks');
  const data = JSON.parse(data_JSON);
  if (!data) return;
  state.localStorage = data;
  return data;
};

export const uploadRecipe = async newRecipe => {
  try {
    console.log(newRecipe);

    const ingredients = Object.entries(newRecipe)
      .filter(rec => rec[0].startsWith('ingredient') && rec[1] !== '')
      .map(ing => {
        const ingArr = ing[1].trim().split(',');
        if (ingArr.length !== 3) throw new Error(`Please use correct format`);
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // check value from form
    const checkFill = Object.values(newRecipe)
      .slice(0, 4)
      .map(text => text.split(''))
      .every(text => text.length >= 5);
    if (!checkFill)
      throw new Error(
        `Please fill Title, Url, Image Url, Publisher more than 5 character!`
      );

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
  } catch (err) {
    throw Error(err);
  }
};
