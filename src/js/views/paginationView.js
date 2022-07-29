import icons from 'url:../../img/icons.svg';
import View from './view.js';

class PaginationView extends View {
  _parentContainer = document.querySelector('.pagination');

  _addHandlerClick(event) {
    this._parentContainer.addEventListener('click', e => {
      const target_btn = e.target.closest('.btn--inline');
      if (!target_btn) return;

      const gotoPage = target_btn.dataset.goto;
      event(gotoPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // 1) page 1 and other page
    if (this._data.page == 1 && numPages > 1) {
      return this._generateMarkup_nextBtn();
    }

    // 2) last page
    if (this._data.page == numPages && numPages > 1) {
      console.log(this._data.page);
      console.log(numPages);
      return this._generateMarkup_previousBtn();
    }

    // 3) Other page
    if (this._data.page < numPages && numPages > 1) {
      return [
        this._generateMarkup_previousBtn(),
        this._generateMarkup_nextBtn(),
      ].join('');
    }

    // 4) Only 1 page
    return ``;
  }

  _generateMarkup_previousBtn() {
    return `
    <button data-goto="${
      +this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${+this._data.page - 1}</span>
    </button>
    `;
  }

  _generateMarkup_nextBtn() {
    return `
    <button data-goto="${
      +this._data.page + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${+this._data.page + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;
  }
}

export default new PaginationView();
