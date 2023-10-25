import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');
const resultsList = document.querySelector('.results');
const searchForm = document.querySelector('.search');
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const renderSpinner = function (parentEl) {
  const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};
const getRecipes = async function (query) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
    );
    if (!res.ok) throw new Error(`${res.status}`);
    const {
      data: { recipes },
    } = await res.json();
    console.log(recipes);
    if (recipes.length === 0)
      throw new Error('No recipes found for your query! Please try again :)');
    else return recipes;
  } catch (err) {
    console.warn(err);
  }
};

const getRecipe = async function (recipeId) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${recipeId}`
    );
    // console.log(res);
    if (!res.ok) throw new Error('Recipe not found :(');
    let {
      data: { recipe },
    } = await res.json();
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    return recipe;
  } catch (err) {
    console.warn(err);
  }
};

const renderRecipe = async function (e) {
  // const id = e.newURL.split('#')[1];
  const id = window.location.hash.slice(1);
  if (!id) return;
  const recipe = await getRecipe(id);

  renderSpinner(recipeContainer);
  const markup = `<figure class="recipe__fig">
          <img src="${recipe.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${recipe.ingredients
            .map(
              ingredient =>
                `<li class="recipe__ingredient">
            <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${ingredient.quantity || ''}</div>
            <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit || ''}</span>
              ${ingredient.description}
            </div>
            </li>`
            )
            .join('')}

            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">0.5</div>
              <div class="recipe__description">
                <span class="recipe__unit">cup</span>
                ricotta cheese
              </div>
            </li>
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
};

const renderSearchResults = async function (query) {
  renderSpinner(resultsList);
  const recipes = await getRecipes(query);
  resultsList.innerHTML = '';
  if (!recipes)
    resultsList.innerHTML = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>No recipes found for your query. Please try again!</p>
          </div>`;
  else
    recipes.forEach(recipe => {
      resultsList.insertAdjacentHTML(
        'beforeend',
        `<li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image_url}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
              </div>
            </a>
          </li>`
      );
    });
};
// renderSearchResults('burger');
// renderRecipe();
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// renderRecipe();

// Event handlers

// user search for a recipe
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchForm.querySelector('.search__field').value;
  if (!query) return;
  renderSearchResults(query);
});

// user clicks on a recipe
// Method 1
// resultsList.addEventListener('hashchange', function (e) {
//   const clicked = e.target.closest('.preview__link');
//   if (!clicked) return;
//   document
//     .querySelector('.preview__link--active')
//     ?.classList.remove('preview__link--active');

//   clicked.classList.add('preview__link--active');
//   const recipeId = clicked.href.split('#')[1];
//   renderRecipe(recipeId);
// });
// Method 2
['load', 'hashchange'].forEach(pageEvent =>
  window.addEventListener(pageEvent, renderRecipe)
);
