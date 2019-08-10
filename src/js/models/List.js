import uniqid from 'uniqid'

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient,
            
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);
       // splice -  [2, 4, 8] splice(1, 2) (start and how many elements we want to take)--> returns [4, 8] and original array is mutated [2]
       // slice - [2, 4, 8] slice(1, 2) (start index and end index) ---> returns 4 and original array is still [2, 4, 8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // returns the element rather than index
        this.items.find(el => el.id === id).count = newCount;
    }
}