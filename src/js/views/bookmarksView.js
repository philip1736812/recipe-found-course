import View from './view';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class Bookmarks extends View {
  _parentContainer = document.querySelector('.bookmarks__list');

  addHandlerClickBookmarks(event) {
    const btn__bookmarks = document.querySelector('.recipe');
    btn__bookmarks.addEventListener('click', e => {
      const target__btn = e.target.closest('.btn--round');
      if (!target__btn) return;

      event();
    });
  }

  _generateMarkup() {
    return this._data
      .map(Bookmark => previewView.render(Bookmark, false))
      .join('');
  }

  addHandlerBookmarksRender(eventLoad) {
    return window.addEventListener('load', eventLoad);
  }

  renderError() {
    const marker = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>
            No bookmarks yet. Find a nice recipe and bookmark it :)
          </p>
        </div>
        `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', marker);
  }
}

export default new Bookmarks();
