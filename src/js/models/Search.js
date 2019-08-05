
import axios from 'axios';

export default class Search {
    constructor(query)  {
        this.query = query;
    }

    async getResults() {
        // const proxy = 'https://cors-anywhere.herokuapp.com/'
        const key = '9d6a8dff90dc9c611f86b709c52ce096';
        const ID =  'd182ebf1';
        try {  
            const res = await axios(`https://api.edamam.com/search?q=${this.query}&app_id=${ID}&app_key=${key}`);
            this.result = res.data.hits;
            //res.data.hits[0].recipe.calories;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    
            
    }
}

