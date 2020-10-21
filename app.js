const coffeeList= document.querySelector('#add-coffee-list');
const form = document.querySelector('#add-coffee-form');

function renderCoffee(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let place = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    place.textContent = doc.data().place;
    cross.textContent = "X";

    li.appendChild(name);
    li.appendChild(place);
    li.appendChild(cross);

    coffeeList.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('coffee').doc(id).delete();
    })
}

// db.collection('coffee').orderBy('name').get().then((snapshot)=>{
//     snapshot.docs.forEach(doc => {
//         renderCoffee(doc);
//     })
// })

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('coffee').add({
        name:form.name.value,
        place:form.place.value
    })
    form.name.value="",
    form.place.value=""
})

db.collection('coffee').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            renderCoffee(change.doc)
        } else if(change.type == 'removed'){
            let li = coffeeList.querySelector('[data-id=' + change.doc.id + ']');
            coffeeList.removeChild(li);
        }
    })
})