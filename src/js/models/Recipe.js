import axios from 'axios';

import {key, proxy, ID, mealID} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

            //console.log(res);
        } catch (error) {
            console.log(error);
        }

    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients.
        const numIng = this.ingredients.length
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredients.
            // make new array of each word in the ingredient array
            const arrIng = ingredient.split(' '); 
            // find which word matches in the ingredient array matches a word in unitsShort
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));


            let objIng;
            if (unitIndex > -1 ){
                // there is an index for a  unit of measurment
                // Ex. 4 1/2 cups, arrCount will be [4, 1/2]  ----> eval("4+1/2") --> 4.5
                // Ex 4 cups, arrCount will be [4]
                const arrCount = arrIng.slice(0, unitIndex); 

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }


            } else if (parseInt(arrIng[0], 10)) {
                // tries parseIng on first part of array, will either return number(true) or Nan(false)
                // There is no unit, but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    // joins the rest of the ingredient back together but removes the first part (the count) [0]
                    ingredient: arrIng.slice(1).join(' ')
                }

            }
            else if (unitIndex === -1) {
                // There is NO unit and no number in first position
                objIng= {
                    count: 1,
                    unit: '',
                    // assigns ingredient, to ingredient
                    ingredient
                }
            }
            

            return objIng;
        });
        this.ingredients = newIngredients;
    }
}