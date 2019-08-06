import { elements } from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
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
        <a class="results__link" href="#${reciperend.recipe.uri}">
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

const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    
</button>
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if(page === 1 && pages > 1) {
        // only button to go to next page
        button = createButton(page, 'next');
    } else if(page === pages) {
     // only button to previous cage
        button = createButton(page, 'prev');
    
    } else if (page < pages) {
           // both buttons
        button = 
    `${createButton(page, 'prev')}
     ${createButton(page, 'next')}
     `;
     
    } else {
        // no buttons
    }
  
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


export const renderResults = (recipes, page = 1, resPerPage = 8) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

