import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;
  // _parentElement = document.querySelector('.recipe');
  _errorMsg = 'We could not find that recipe. Please try again';
  _successMsg = `Recipe Found`;

  renderErrorMessage() {
    this._parentElement.innerHTML = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>No recipes found for your query. Please try again!</p>
          </div>`;
  }

  renderSuccessMsg(message = this._successMsg) {
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this._clear();
    this._parentElement.innerHTML = markup;
  }

  renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  render(data, render = true) {
    try {
      if (Array.isArray(data) && data.length === 0)
        throw new Error('no recipes found');
      this._data = data;
      const markup = this._generateMarkup();
      if (!render) return markup;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    } catch (err) {
      this.renderErrorMessage();
    }
  }

  update(data) {
    if (!data) return this.renderErrorMessage();
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, index) => {
      const curEl = curElements[index];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attribute => {
          curEl.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }
}
