let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function fetchToys(url){
    return fetch(url)
    .then(res => res.json())
  }

  function createToys(url, body){
    return fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify(body),
    })
    .then(res => res.json())
  }

  function updateLikes(url, body){
    return fetch(url,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        "likes":body
      }),
    })
    .then(res => res.json())
  }

  function handleUpdateLikes(event, id, currLikes){
    //console.log(currLikes)
    updateLikes(`http://localhost:3000/toys/${id}`, currLikes)
    .catch(e => console.error(e))
    console.log(event.target.parentElement.querySelector("p").textContent=`${currLikes} likes`);
  }

  function handleForm(e){
    e.preventDefault();

    const toy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }

    createToys('http://localhost:3000/toys', toy)
    .then(renderToyCard)
    .catch(e => console.error(e))
  }

  function renderToyCard(toyData){
    const card = document.createElement('div')
    const h2 = document.createElement('h2');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const button = document.createElement('button');

    h2.textContent = toyData.name;
    img.src = toyData.image;
    img.className = 'toy-avatar';
    p.textContent = `${toyData.likes} likes`;
    button.textContent = 'like';
    card.className = 'card';
  
    card.append(h2,img,p,button);

    button.addEventListener('click',(e)=>handleUpdateLikes(e, toyData.id, ++toyData.likes))
    document.querySelector('#toy-collection').append(card);
  }

  fetchToys('http://localhost:3000/toys')
  .then(toys => toys.forEach(renderToyCard))
  .catch(e => console.error(e))

  document.querySelector('.add-toy-form').addEventListener('submit', handleForm)

});
