import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationsView from "./views/paginationsView.js";

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
//Loading recipe

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //Load search results
    await model.loadSerachResult(query);
    //Render results
    resultView.render(model.getSearchResultPage());

    //Render initial pagination buttons
    paginationsView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //Render New results
  resultView.render(model.getSearchResultPage(goToPage));

  //Render New pagination buttons
  paginationsView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationsView.addHandlerClick(controlPagination);
};
init();
