import { BASE_URL } from './config';
import { getJSON } from './helper';
const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
  bookmarks: [],
  currentPage: 1,
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
export { state, getRecipes, loadRecipe };
