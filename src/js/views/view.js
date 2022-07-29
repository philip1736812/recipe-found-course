import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const marker = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', marker);
  }

  update(data) {
    this._data = data;

    const markup = this._generateMarkup();

    // created virtual dom to compare old dom
    const newDOM = document.createRange().createContextualFragment(markup);
    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const crrElement = Array.from(this._parentContainer.querySelectorAll('*'));

    // compare each node list
    newElement.forEach((newEl, key) => {
      const crrEl = crrElement[key];

      // method "isEqualNode" to compare difference node
      // Update changed TEXT
      if (
        !crrEl.isEqualNode(newEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // to selected deep child node
      ) {
        crrEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTE
      if (!crrEl.isEqualNode(newEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          crrEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentContainer.innerHTML = '';
  }

  renderError(err_message = this._errorMessage) {
    const marker = `
            <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${err_message}</p>
            </div>
        `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', marker);
  }

  renderMessage(message = this._success_message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;

    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
}
