import icons from 'url:../../img/icons.svg';
import View from './View';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _modalWindow = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _openModalBtn = document.querySelector('.nav__btn--add-recipe');
  _closeModalBtn = document.querySelector('.btn--close-modal');
  _uploadRecipeBtn = document.querySelector('.upload__btn');
  _formMarkup = this._parentElement.innerHTML;

  constructor() {
    super();
    this._addHandlerShowModal();
  }

  resetForm() {
    this._parentElement.innerHTML = this._formMarkup;
    // this._addHandlerShowModal();
  }

  openModal() {
    [this._modalWindow, this._overlay].forEach(element => {
      element.classList.remove('hidden');
    });
  }
  closeModal() {
    [this._modalWindow, this._overlay].forEach(element => {
      element.classList.add('hidden');
    });
  }
  _addHandlerShowModal() {
    [this._closeModalBtn, this._overlay].forEach(element => {
      element.addEventListener('click', this.closeModal.bind(this));
      this._openModalBtn.addEventListener('click', this.openModal.bind(this));
    });
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
