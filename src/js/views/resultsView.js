import icons from 'url:../../img/icons.svg';
import View from './view.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentContainer = document.querySelector('.results');
  _errorMessage = `No recipe found for your searching`;

  _generateMarkup() {
    return this._data.map(rec => previewView.render(rec, false)).join('');
  }

  /*  ----> toggle mark active

  _addHandlerClick_selected() {
    this._parentContainer.addEventListener('click', e =>
      this._addSelected_style(e)
    );
  }

  _addSelected_style(e) {
    const selected = e.target.closest('.preview__link');
    if (!selected) return;

    this._resetSelected_style();
    selected.classList.add('preview__link--active');
  }

  _resetSelected_style() {
    const selected = document.querySelectorAll('.preview__link');
    selected.forEach(el => el.classList.remove('preview__link--active'));
  }
  */
}

export default new ResultsView();
