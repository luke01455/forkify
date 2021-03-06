import { elements } from './base';
import { limitRecipeTitle } from './searchView'

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    //selecting a child of recipe love class
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
    // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    // Ternary operator to set visibility on html class likes menu
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
`;
elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLikes = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}