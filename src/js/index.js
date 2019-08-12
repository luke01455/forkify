import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';



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
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)
            );
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


/**
 * List Controller
 * */
state.likes = new Likes();

 const controlList = () => {
    // Create a new list if there isnt already one
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
 }

// Handle delete and update list items
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;  // dataset.itemid references data-itemid=$ , not sure how but apparantly it does

    //handle the delete button

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);
        // delete from UI
        listView.deleteItem(id);

        //handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * Like Controller
 * */
// TESTING


 const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;


    // user has not yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle the like button
        likesView.toggleLikeBtn(true);
        // add like to UI list
        likesView.renderLike(newLike);

    // user has liked current recipe
    } else {

        // Remove like to the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);
        // remove  like from UI list
        likesView.deleteLikes(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

 }



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
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {

        // add ingredient to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});
