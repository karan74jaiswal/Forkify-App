import { BASE_URL } from './config';
import { getJSON } from './helper';
const state = {
  recipe: {},
  search: [],
  bookmarks: [],
  currentPage: 1,
};
const getRecipes = async function (query) {
  try {
    const {
      data: { recipes },
    } = await getJSON(`${BASE_URL}?search=${query}`);
    if (recipes?.length === 0) {
      state.search = recipes;
      throw new Error('No recipes found for your query! Please try again :)');
    }
    state.search = recipes;
  } catch (err) {
    console.log(err);
    // throw err;
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
