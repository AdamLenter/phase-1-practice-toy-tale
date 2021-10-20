let addToy = false;
let numberOfLikes = [];

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

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((responseInfo) => processToys(responseInfo))

  const addToyForm = document.getElementsByClassName("add-toy-form")[0];

  addToyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    toyName = addToyForm.getElementsByTagName("input")[0].value;
    imageURL = addToyForm.getElementsByTagName("input")[1].value;

    addToyForm.getElementsByTagName("input")[0].value = "";
    addToyForm.getElementsByTagName("input")[1].value = "";

    const configurationObject = {
        

        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
            "name": toyName,  
            "image": imageURL, 
            "likes": 0
        })
      };
  
      fetch("http://localhost:3000/toys", configurationObject)
      .then(response => response.json())
      .then(body => createCard(body))
      })
});


function processToys(toys) {
  for(toy of toys)
    {
    createCard(toy)
    }
}

function generateSingularOrPluralWord(number, singularWord, pluralWord) {
  if(number === 1) {
    return singularWord;
  }
  else {
    return pluralWord;
  }
}

function createCard(newToyInfo) {
  const card = document.createElement("div");
  card.classList.add("card");
  document.getElementById("toy-collection").appendChild(card);
  
  const heading = document.createElement("h2");
  heading.textContent = newToyInfo.name;
  card.appendChild(heading);

  const image = document.createElement("img");
  image.src = newToyInfo.image;
  image.classList.add("toy-avatar");
  card.appendChild(image);

  const paragraph = document.createElement("p");
  numberOfLikes[newToyInfo.id] = newToyInfo.likes;
  paragraph.textContent = `${newToyInfo.likes} ${generateSingularOrPluralWord(newToyInfo.likes, "like", "likes")}`;
  card.appendChild(paragraph)

  const btn = document.createElement("button");
  btn.classList.add("like-btn")
  btn.id = newToyInfo.id;
  btn.textContent = "Like ";
  card.appendChild(btn);

  btn.addEventListener("click", (event) => {
    numberOfLikes[event.target.id]++;
    const configurationObject = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
            "likes": (numberOfLikes[event.target.id])
        })
      };
  
      const fetchURL = `http://localhost:3000/toys/${event.target.id}`;
      fetch(fetchURL, configurationObject)
      .then(response => response.json())
      .then(body => updateLikes(event.target.id))
      })

return;
}

function updateLikes(characterId) {
  const characterLikes = document.getElementById(characterId).previousSibling;
  characterLikes.textContent = `${numberOfLikes[characterId]} ${generateSingularOrPluralWord(numberOfLikes[characterId], "like", "likes")}`;
}