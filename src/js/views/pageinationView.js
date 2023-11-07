import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numberOfpages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (numberOfpages <= 1) return '';
    if (this._data.currentPage === 1)
      return `<button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    if (this._data.currentPage === numberOfpages)
      return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.currentPage - 1}</span>
          </button>`;
    return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.currentPage - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  addUpdationHandler(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

export default new PaginationView();
