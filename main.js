class Hero {
  constructor(name, realName, species, citizenship, gender, birthDay, deathDay, status, actors, photo, movies ) {
    this.name = name;
    this.realName = realName;
    this.species = species;
    this.gender = gender;
    this.citizenship = citizenship;
    this.birthDay = birthDay;
    this.deathDay = deathDay;
    this.status = status;
    this.actors = actors;
    this.photo = photo;
    this.movies = movies;
    this.captionMap = {
      name: "Name",
      realName: "Real name",
      species: "Species",
      gender: "Gender",
      citizenship: "Citizenship",
      birthDay: "Birth day",
      deathDay: "Death day",
      status: "Status",
      actors: "Actors",
      movies: "Movies",
    }  
  }

  convertToHTML() {
    let innerHTML = "";

    for (let property in this) {
      if (this[property] !== null && this[property] !== undefined) {
        if (property === 'photo' || property === 'captionMap') {
          continue;
        } else if (property === 'movies') {
          innerHTML += `<p class="hero-${property} character-description"><span class="info-first">${this.captionMap[property]}:</span> <span class="${property} info-second">${this[property].join(', ')}</span></p>`;
        } else {
          innerHTML += `<p class="hero-${property} character-description"><span class="info-first">${this.captionMap[property]}:</span> <span class="${property} info-second">${this[property]}</span></p>`;
        }
      }
    }

    return innerHTML;
  }
}

const render = (items) => {
  const heroContainer = document.querySelector('.container__heros');

  heroContainer.innerHTML = '';

  for (let item of items) {
    const heroDiv = document.createElement('div'),
          imageWrapper = document.createElement('div'),
          infoWrapper = document.createElement('div');

    heroDiv.classList.add('hero-card');
    imageWrapper.classList.add('image-wrapper');
    infoWrapper.classList.add('info-wrapper');

    imageWrapper.innerHTML = `<img class="hero-image" src="./db/${item.photo}" alt="На этом месте мог бы быть ты!">`;
    infoWrapper.innerHTML = item.convertToHTML();
    
    heroDiv.appendChild(imageWrapper);
    heroDiv.appendChild(infoWrapper);
    heroContainer.appendChild(heroDiv);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let heroes = [];

  fetch('./db/dbHeroes.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    if(response.status !== 200) {
      throw new Error(`Что-то пошло не так, код ошибки - ${response.status}`)
    }

    return response.json();
  })
  .then((response) => {
    console.log(response);

    for (let item of response) {
      heroes.push(new Hero(item.name, item.realName, item.species, item.citizenship, item.gender, item.birthDay, item.deathDay, item.status, item.actors, item.photo, item.movies));
    }
    
    render(heroes);

    console.log(heroes);
  })
  .catch((error) => {
    console.log(error);
  });

  const moviesSelect = document.querySelector('.movies-select');
  
  moviesSelect.addEventListener('change', () => {
  const filteredHeroes = [],
        selectedValue = moviesSelect.options[moviesSelect.selectedIndex].value;

  if (selectedValue === '') {
    render(heroes);
  } else {
    heroes.forEach(item => {
      if (item.movies != undefined && item.movies.includes(selectedValue)) {
        filteredHeroes.push(item);
      }
    });

    render(filteredHeroes);
  }
});
})