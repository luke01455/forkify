import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';


/**  Global state of the app
* - Search object
*- Current recipe object
*- Shopping list object
* - Liked recipes
*/

const state = {};


/**
 * Search Controller
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
                    // 4) Search for recipes
        await state.search.getResults();

        // 5) render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        //console.log(state.search.result)
        } catch (error) {
            alert('somethign went wrong with the search...');
            clearLoader();
        }

    }
}


 
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {  
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/**
 * Recipe Controller
 * */
 
const controlRecipe = async () => {

    // Get ID from url

    const id = window.location.hash.replace('#', '');
    

    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highligh selected search item
        if(state.search) {searchView.highlightSelected(id)};


        // Create new recipe object 
        state.recipe = new Recipe(id);


        try {
        // Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        
        // Calculate servings and time
        state.recipe.calcServings();
        state.recipe.calcTime();
        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        }
        catch (error){
            alert('error processing recipe');
        }
    }
}

window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe); -UNCOMMENT IN FINAL COMMENTED DUE TO API CLICKS ISSUE 

// or written another way, bit pointless though
//['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // if the click matches the button decrease or any child of the button decrease
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if(state.recipe.servings > 1) {
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
        }
    }

    if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
});


window.l = new List();