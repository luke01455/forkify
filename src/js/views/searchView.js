import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
};
const renderRecipe = reciperend => {
    const markup = `
    <li>
        <a class="results__link" href="#${reciperend.recipe.calories}">
            <figure class="results__fig">
                <img src=${reciperend.recipe.image} alt="${reciperend.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${reciperend.recipe.label}</h4>
                <p class="results__author">${reciperend.recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
    
};
export const renderResults = recipes => {
    console.log(recipes)
    recipes.forEach(renderRecipe);
};