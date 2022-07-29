import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';
import UploadRecipeView from './views/uploadRecipeView.js';
import {
  CLOSE_WINDOW_SEC,
  SUCCESS_MESSAGE_SEC,
  RESET_WINDOW_SEC,
} from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipe = async () => {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    //  update result view to mark selected
    ResultsView.update(model.getSearchResultPage());

    // render load spinner
    RecipeView.renderSpinner();

    // Load recipe from api
    await model.loadRecipe(hash);
    const { recipe } = model.state;

    // Render Recipe
    RecipeView.render(recipe);

    // Update bookmarks
    BookmarksView.update(model.state.localStorage);
  } catch (err) {
    RecipeView.renderError();
  }
};

const controlSearch = async () => {
  try {
    ResultsView.renderSpinner();

    const textValue = SearchView.query();
    SearchView._clear();
    if (!textValue) return;

    // load recipe
    await model.loadSearchResult(textValue);

    // render recipe search
    ResultsView.render(model.getSearchResultPage());

    // Render initial pagination button
    PaginationView.render(model.state.search_result);
  } catch (err) {
    console.error(err);
    RecipeView.renderError();
    ResultsView.renderError();
  }
};

const controlPagination = gotoPage => {
  ResultsView.render(model.getSearchResultPage(gotoPage));

  // Render initial pagination button
  PaginationView.render(model.state.search_result);
};

const controlServing = newServing => {
  // Updated recipe serving (in state)
  model.updateServing(model.state.recipe.servings + newServing);

  // Updated recipe view
  const { recipe } = model.state;
  RecipeView.update(recipe);
};

const controlBookmarks = () => {
  // Update to bookmarks from state
  const { recipe } = model.state;
  model.add_delete_LocalStorage_data(recipe);

  // Update bookmarks in ResultView
  BookmarksView.render(model.state.localStorage);
  RecipeView.update(recipe);
};

const controlLoad_dataStorage = () => {
  // get data from local storage
  model.getLocalStorage_data();

  // render to dom
  BookmarksView.render(model.state.localStorage);
};

const controlUploadRecipe = async newRecipe_data => {
  try {
    await model.uploadRecipe(newRecipe_data);

    // add upload recipe to local storage
    model.add_delete_LocalStorage_data(model.state.recipe);

    // update recipe view
    // window.location.href = `http://localhost:1234/#${model.state.recipe.id}`;
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // without reload page
    RecipeView.render(model.state.recipe);

    // auto update bookmarks
    BookmarksView.render(model.state.localStorage);

    // Success message
    UploadRecipeView.renderSpinner();
    setTimeout(
      () => UploadRecipeView.renderMessage(),
      SUCCESS_MESSAGE_SEC * 1000
    );

    // Close window
    setTimeout(
      () => UploadRecipeView._addHandlerToggle_window(),
      CLOSE_WINDOW_SEC * 1000
    );
  } catch (err) {
    UploadRecipeView.renderError(`Something wrong!: ${err.message}`);
  } finally {
    // Reset Form
    setTimeout(() => UploadRecipeView.render(true), RESET_WINDOW_SEC * 1000);
  }
};

// Handle Event
const init = () => {
  RecipeView.addHandlerRender(controlRecipe);
  SearchView.addHandler_searchEvent(controlSearch);
  // ResultsView._addHandlerClick_selected(); // Handler mark active recipe
  PaginationView._addHandlerClick(controlPagination);

  // Click to update serving
  RecipeView.addHandlerUpdateServing(controlServing);

  // Click bookmarks && load bookmarks
  BookmarksView.addHandlerClickBookmarks(controlBookmarks);
  BookmarksView.addHandlerBookmarksRender(controlLoad_dataStorage);

  UploadRecipeView._addHandler_data(controlUploadRecipe);
};
init();

///////////////////////////////////////