import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  state,
  loadRecipe,
  getRecipes,
  resultsLimit,
  updateRecipeServings,
  addBookmarks,
  removeBookmarks,
  uploadRecipe,
} from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchResultsView from './views/searchResultsView';
import pageinationView from './views/pageinationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SECONDS } from './config';

if (module.hot) {
  module.hot.accept();
}
const controlBookmarks = function () {
  if (!state.recipe.bookmarked) addBookmarks(state.recipe);
  else removeBookmarks(state.recipe.id);
  bookmarksView.render(state.bookmarks);
  recipeView.update(state.recipe);
};

const controlBookmarkRender = function () {
  bookmarksView.render(state.bookmarks);
};

const controlServings = function (e) {
  const clicked = e.target.closest('.btn--tiny');
  if (!clicked) return;
  if (
    clicked.classList.contains('btn--decrease-servings') &&
    state.recipe.servings !== 1
  )
    updateRecipeServings(state.recipe.servings - 1);
  if (clicked.classList.contains('btn--increase-servings'))
    updateRecipeServings(state.recipe.servings + 1);
  recipeView.update(state.recipe);
};

const controlRecipes = async function (e) {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    await loadRecipe(id);
    recipeView.renderSpinner();
    searchResultsView.update(resultsLimit());
    recipeView.render(state.recipe);
    recipeView.addServingsUpdationHandler(controlServings);
    bookmarksView.update(state.bookmarks);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    state.search.currentPage = 1;
    searchResultsView.renderSpinner();
    await getRecipes(query);
    searchResultsView.render(resultsLimit());
    pageinationView.render(state.search);
  } catch (err) {
    searchResultsView.renderErrorMessage();
  }
};

const updateResultsWithPage = function (e) {
  const clicked = e.target.closest('.btn--inline');
  if (!clicked) return;
  if (clicked.classList.contains('pagination__btn--prev'))
    state.search.currentPage--;
  if (clicked.classList.contains('pagination__btn--next'))
    state.search.currentPage++;
  searchResultsView.render(resultsLimit());
  pageinationView.render(state.search);
};

const getUserGeneratedRecipeData = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await uploadRecipe(newRecipe);
    addBookmarks(state.recipe);
    bookmarksView.render(state.bookmarks);
    recipeView.render(state.recipe);
    recipeView.addServingsUpdationHandler(controlServings);
    // console.log(state.recipe);
    addRecipeView.renderSuccessMsg('Recipe was Uploaded Successfully :)');
    setTimeout(() => {
      addRecipeView.closeModal();
      addRecipeView.resetForm();
      addRecipeView.recipeUploadHandler(getUserGeneratedRecipeData);
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderErrorMessage('Something went wrong, Please try again');
  }
};

// Subscribing The controlRecipes Function(Subscriber)  to the recipeView addHandlerRender(Publisher)
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  pageinationView.addUpdationHandler(updateResultsWithPage);
  recipeView.addBookmarkHandler(controlBookmarks);
  bookmarksView.addHandlerRender(controlBookmarkRender);
  addRecipeView.recipeUploadHandler(getUserGeneratedRecipeData);
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
init();
