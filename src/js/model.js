import { BASE_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { getJSON, sendJSON } from './helper';
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

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
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

const createRecipeObject = recipe => {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: state.bookmarks.some(bookmark => bookmark.id === recipe.id),
    ...(recipe.key && { key: recipe.key }),
  };
};
const loadRecipe = async function (recipeId) {
  try {
    const {
      data: { recipe },
    } = await getJSON(`${BASE_URL}/${recipeId}`, 'Recipe not found :(');
    state.recipe = createRecipeObject(recipe);
    // console.log(state.recipe);
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

const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};
const removeBookmarks = function (id) {
  state.bookmarks.splice(
    state.bookmarks.findIndex(bookmark => bookmark.id === id),
    1
  );

  state.recipe.bookmarked = false;
  persistBookmarks();
};

const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(entry => {
        if (entry[0].includes('ingredient') && entry[1]) return entry;
      })
      .map(ingredient => {
        const [quantity, unit = '', description = ''] = ingredient[1]
          .split(',')
          .map(ing => ing.trim());
        return {
          quantity: +quantity || null,
          unit,
          description,
        };
      });

    // console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const { data } = await sendJSON(
      `${BASE_URL}?key=${API_KEY}`,
      recipe,
      'Cannot Post, Something Went Wrong'
    );
    // console.log('Data', data.recipe);
    state.recipe = createRecipeObject(data.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
export {
  state,
  getRecipes,
  loadRecipe,
  resultsLimit,
  updateRecipeServings,
  addBookmarks,
  removeBookmarks,
  uploadRecipe,
};
