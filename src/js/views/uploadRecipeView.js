import View from './view';

class UploadRecipeView extends View {
  _parentContainer = document.querySelector('.upload');
  _success_message = `Recipe was successfully uploaded`;
  _errorMessage = `Please use correctly format`;

  constructor() {
    super();

    // method wii active immediately create class
    this._addHandlerClick_upload();
    this._addHandlerClose_window();
  }

  _addHandlerClick_upload(event) {
    return window.addEventListener('click', e => {
      const targetBtn_open = e.target.closest('.nav__btn--add-recipe');
      if (!targetBtn_open) return;
      this._addHandlerToggle_window();
    });
  }

  _addHandlerClose_window() {
    return window.addEventListener('click', e => {
      const targetBtn_close =
        e.target.closest('.btn--close-modal') || e.target.closest('.overlay');
      if (targetBtn_close) {
        this._addHandlerToggle_window();
      }
    });
  }

  _addHandlerToggle_window() {
    this._toggleRecipeView_container();
    this._toggleOverlay();
  }

  _toggleRecipeView_container() {
    const upload_container = document.querySelector('.add-recipe-window');
    upload_container.classList.toggle('hidden');
  }

  _toggleOverlay() {
    const upload_container = document.querySelector('.overlay');
    upload_container.classList.toggle('hidden');
  }

  _addHandler_data(event) {
    this._parentContainer.addEventListener('submit', function (e) {
      e.preventDefault();

      // get data from "Form" in unreadable format
      const dataArr = [...new FormData(this)]; // ---> spread format to Array
      const data = Object.fromEntries(dataArr); // convert Array to Obj
      event(data);
    });
  }

  _generateMarkup() {
    return `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="" required="" name="title" type="text">
          <label>URL</label>
          <input value="" required="" name="sourceUrl" type="text">
          <label>Image URL</label>
          <input value="" required="" name="image" type="text">
          <label>Publisher</label>
          <input value="" required="" name="publisher" type="text">
          <label>Prep time</label>
          <input value="" required="" name="cookingTime" type="number">
          <label>Servings</label>
          <input value="" required="" name="servings" type="number">
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input value="" type="text" required="" name="ingredient-1" placeholder="Format: 'Quantity,Unit,Description'">
          <label>Ingredient 2</label>
          <input value="" type="text" name="ingredient-2" placeholder="Format: 'Quantity,Unit,Description'">
          <label>Ingredient 3</label>
          <input value="" type="text" name="ingredient-3" placeholder="Format: 'Quantity,Unit,Description'">
          <label>Ingredient 4</label>
          <input type="text" name="ingredient-4" placeholder="Format: 'Quantity,Unit,Description'">
          <label>Ingredient 5</label>
          <input type="text" name="ingredient-5" placeholder="Format: 'Quantity,Unit,Description'">
          <label>Ingredient 6</label>
          <input type="text" name="ingredient-6" placeholder="Format: 'Quantity,Unit,Description'">
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="/icons.21bad73c.svg#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
    `;
  }
}

export default new UploadRecipeView();
