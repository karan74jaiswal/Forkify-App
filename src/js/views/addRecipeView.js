import icons from 'url:../../img/icons.svg';
import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _openModalBtn = document.querySelector('.nav__btn--add-recipe');
  _closeModalBtn = document.querySelector('.btn--close-modal');
  _uploadRecipeBtn = document.querySelector('.upload__btn');

  constructor() {
    super();
    this._addHandlerShowModal();
  }
  _generateMarkup() {}

  toogleModal() {
    [this._window, this._overlay].forEach(el => el.classList.toggle('hidden'));
  }
  _addHandlerShowModal() {
    [this._openModalBtn, this._closeModalBtn, this._overlay].forEach(el =>
      el.addEventListener('click', this.toogleModal.bind(this))
    );
  }

  recipeUploadHandler(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
}

export default new AddRecipeView();
