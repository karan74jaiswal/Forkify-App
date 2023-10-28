import icons from 'url:../img/icons.svg'; // Parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { state, loadRecipe } from './model';
import recipeView from './views/recipeView';
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
    if (recipes.length === 0)
      throw new Error('No recipes found for your query! Please try again :)');
    else return recipes;
  } catch (err) {
    console.warn(err);
  }
};

const controlRecipes = async function (e) {
  // const id = e.newURL.split('#')[1];
  const id = window.location.hash.slice(1);
  if (!id) return;
  await loadRecipe(id);
  const { recipe } = state;
  recipeView.renderSpinner();
  recipeView.render(recipe);
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
  window.addEventListener(pageEvent, controlRecipes)
);
