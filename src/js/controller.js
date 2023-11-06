import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { state, loadRecipe, getRecipes } from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import searchResultsView from './views/searchResultsView';
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
    searchResultsView.renderSpinner();
    await getRecipes(query);
    searchResultsView.render(state.search.results);
    // const recipes = state.search.results.filter(
    //   (_, index) =>
    //     index >= state.currentPage - 1 && index < state.currentPage + 9
    // );
  } catch (err) {
    searchResultsView.renderErrorMessage();
  }
};

// Subscribing The controlRecipes Function(Subscriber)  to the recipeView addHandlerRender(Publisher)
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
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
