import icons from 'url:../../img/icons.svg';
// import { Fraction } from 'fractional';
import View from './view.js';
import { numberToFraction as NewFraction } from '../helpers';

class RecipeView extends View {
  _parentContainer = document.querySelector('.recipe');
  _errorMessage = `We could not find that recipe. Please try another one.`;
  _success_message = ``;
  _newServing = 0;

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
        <img src="${this._data.img}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
            <span>${this._data.title}</span>
        </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.time
            }</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings">
                <svg>
                <use href="${icons}#icon-minus-circle"></use>
                </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
                <svg>
                <use href="${icons}#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
        </div>
        <button class="btn--round">
            <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
        </button>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(ing => this._generateMarkupIng(ing))
              .join('')}
        </ul>
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
        </p>
        <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
        >
            <span>Directions</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </a>
        </div>
    `;
  }

  _generateMarkupIng(ing) {
    return `
        <li class="recipe__ingredient">
        <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing?.quantity ? NewFraction(ing?.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
            <span class="recipe__unit">${ing?.unit}</span>
            ${ing?.description}
        </div>
        </li>    

        `;
  }

  addHandlerRender(eventLoad) {
    return ['load', 'hashchange'].forEach(ev =>
      window.addEventListener(ev, eventLoad)
    );
  }

  addHandlerUpdateServing(event) {
    this._parentContainer.addEventListener('click', e => {
      const servingBtn = e.target.closest('.btn--tiny');
      if (!servingBtn) return;

      if (servingBtn.classList.contains('btn--decrease-servings'))
        this._newServing--;
      if (servingBtn.classList.contains('btn--increase-servings'))
        this._newServing++;

      event(this._newServing);
      this._newServing = 0;
    });
  }

  newFeatureAdd(msg = `Hello! world`) {
    console.log(msg);
  }
}

export default new RecipeView();
