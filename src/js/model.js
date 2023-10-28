const state = {
  recipe: {},
  search: {},
  bookmarks: [],
};

const loadRecipe = async function (recipeId) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`
    );
    // console.log(res);
    if (!res.ok) throw new Error('Recipe not found :(');
    let {
      data: { recipe },
    } = await res.json();
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
    // return recipe;
  } catch (err) {
    console.warn(err);
  }
};
export { state, loadRecipe };
