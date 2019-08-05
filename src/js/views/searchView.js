import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length >= limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        }, 0)
        return `${newTitle.join(' ')} ...`
    }
    return title;
}


const renderRecipe = reciperend => {
    const newtitle = limitRecipeTitle(reciperend.recipe.label)
    const markup = `
    <li>
        <a class="results__link" href="#${reciperend.recipe.calories}">
            <figure class="results__fig">
                <img src=${reciperend.recipe.image} alt="${reciperend.recipe.label}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${newtitle}</h4>
                <p class="results__author">${reciperend.recipe.source}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
    
};
export const renderResults = recipes => {
    console.log(recipes);
    recipes.forEach(renderRecipe);
};