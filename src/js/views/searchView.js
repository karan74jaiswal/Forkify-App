class SearchView {
  #parentElement = document.querySelector('.search');
  #query = '';
  getQuery() {
    this.#query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInputField();
    return this.#query;
  }

  #clearInputField() {
    this.#parentElement.querySelector('.search__field').value = '';
    this.#parentElement.querySelector('.search__field').blur();
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
