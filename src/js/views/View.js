import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;
  // _parentElement = document.querySelector('.recipe');
  _errorMsg = 'We could not find that recipe. Please try again';
  _successMsg = `Recipe Found`;
  userGeneratedMarkup = `<div class="recipe__user-generated"><svg><use href="${icons}#icon-user"></use></svg></div>`;

  renderErrorMessage(errorMsg = this._errorMsg) {
    this._parentElement.innerHTML = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${errorMsg}</p>
          </div>`;
  }
  /**
   *
   * @param {string} message
   */
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

  /**
   *
   */
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

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Kartikey Jaiswal
   * @todo Finish Implementation
   */

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

  /**
   * Takes the object and update the DOM with updated parts only without rerendering whole DOM
   * @param {Object | Object[]} data The new data to be rendered
   * @returns
   */
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
