import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { state, loadRecipe, getRecipes, resultsLimit } from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchResultsView from './views/searchResultsView';
import pageinationView from './views/pageinationView';
const searchForm = document.querySelector('.search');

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function (e) {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    await loadRecipe(id);
    const { recipe } = state;
    recipeView.renderSpinner();
    recipeView.render(recipe);
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
