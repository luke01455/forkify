import axios from 'axios';


async function getResults(query) {
    // const proxy = 'https://cors-anywhere.herokuapp.com/'
    const key = '9d6a8dff90dc9c611f86b709c52ce096';
    const ID =  'd182ebf1';
    try {  
        const res = await axios(`https://api.edamam.com/search?q=${query}&app_id=${ID}&app_key=${key}`);
        const recipes = res.data.hits;
        //res.data.hits[0].recipe.calories;
        console.log(recipes);
    } catch (error) {
        alert(error);
    }

        
}
//getResults('pasta');