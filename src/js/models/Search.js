
import axios from 'axios';
import {key, proxy, mealID, ID} from '../config';

export default class Search {
    constructor(query)  {
        this.query = query;
    }

    async getResults() {
        // const proxy = 'https://cors-anywhere.herokuapp.com/'

        try {  
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //res.data.hits[0].recipe.calories;
            console.log(res);
            //console.log(res.data)
        } catch (error) {
            alert(error);
        }
    
            
    }
}

