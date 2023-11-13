import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  state,
  loadRecipe,
  getRecipes,
  resultsLimit,
  updateRecipeServings,
} from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchResultsView from './views/searchResultsView';
import pageinationView from './views/pageinationView';
const searchForm = document.querySelector('.search');

if (module.hot) {
  module.hot.accept();
}
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

// Subscribing The controlRecipes Function(Subscriber)  to the recipeView addHandlerRender(Publisher)
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  pageinationView.addUpdationHandler(updateResultsWithPage);
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
init();

// Event handlers

// user search for a recipe
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = this.querySelector('.search__field').value;
  if (!query) return;
  controlSearchResults(query);
});
