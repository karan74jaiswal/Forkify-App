import { BASE_URL, RESULTS_PER_PAGE } from './config';
import { getJSON } from './helper';
const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    currentPage: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};
const getRecipes = async function (query) {
  try {
    state.search.query = query;
    const {
      data: { recipes },
    } = await getJSON(`${BASE_URL}?search=${query}`);
    if (!recipes.length)
      throw new Error('No recipes found for your query! Please try again :)');
    const searchResults = recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
      };
    });
    state.search.results = searchResults;
  } catch (err) {
    // console.warn(err);
    throw err;
  }
};
const loadRecipe = async function (recipeId) {
  try {
    const {
      data: { recipe },
    } = await getJSON(`${BASE_URL}/${recipeId}`, 'Recipe not found :(');
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    throw err;
  }
};

const resultsLimit = function () {
  const startingIndex =
    (state.search.currentPage - 1) * state.search.resultsPerPage;
  const endingIndex = startingIndex + 9;
  return state.search.results.filter(
    (_, index) => index >= startingIndex && index <= endingIndex
  );
};

const updateRecipeServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
export { state, getRecipes, loadRecipe, resultsLimit, updateRecipeServings };
