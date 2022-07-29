import View from './view.js';

class SearchView extends View {
  _form = document.querySelector('.search');

  query() {
    return document.querySelector('.search__field').value;
  }

  _clear() {
    this._form.blur();
    this._form.reset();
  }

  addHandler_searchEvent(event) {
    return this._form.addEventListener('submit', e => {
      e.preventDefault();
      event();
    });
  }
}

export default new SearchView();
