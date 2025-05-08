
const API_KEY =`09d4d155f252fcf9cec509ee46d291f2`
const image_path =`https://image.tmdb.org/t/p/w1280`



function setupArrows() {
  const arrows = document.querySelectorAll(".arrow");

  arrows.forEach((arrow) => {
    const wrapper = arrow.closest('.movie-list-wrapper');
    const movieList = wrapper.querySelector('.movie-list');
    const itemNumber = movieList.querySelectorAll(".movie-list-item").length;
    const ratio = Math.floor(window.innerWidth / 270);
    let clickCounter = 0;
    let currentTranslateX = 0;

    arrow.addEventListener("click", () => {
      clickCounter++;
      if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
        currentTranslateX -= 300;
        movieList.style.transform = `translateX(${currentTranslateX}px)`;
      } else {
        currentTranslateX = 0;
        movieList.style.transform = `translateX(0)`;
        clickCounter = 0;
      }
    });
  });
}


const featuredItems = [
  {
      backgroundImage: 'img/f-1.jpg',
      titleImage: 'img/f-t-1.png',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto illo dolordeserunt nam assumenda ipsa eligendi dolore, ipsum id fugiat quo enim impedit, laboriosam omnisminima voluptatibus incidunt. Accusamus, provident.'
  },
  {
      backgroundImage: 'img/f-2.jpg',
      titleImage: 'img/f-t-2.png',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto illo dolor deserunt nam assumenda ipsa eligendi dolore, ipsum id fugiat quo enim impedit, laboriosam omnis minima voluptatibus incidunt. Accusamus, provident.'
  }
];

let currentIndex = 0;

function updateFeaturedContent() {
  const item = featuredItems[currentIndex];

  const featuredContent = document.querySelector('.featured-content');
  featuredContent.style.background = `linear-gradient(to bottom, rgba(0,0,0,0), #151515), url('${item.backgroundImage}')`;
  featuredContent.style.backgroundSize = 'cover';
  featuredContent.style.backgroundPosition = 'center';

  const featuredTitle = document.querySelector('.featured-title');
  featuredTitle.src = item.titleImage;

  const featuredDesc = document.querySelector('.featured-desc');
  featuredDesc.textContent = item.description;

  currentIndex = (currentIndex + 1) % featuredItems.length;
}

setInterval(updateFeaturedContent, 4000);
updateFeaturedContent();


const searchBtn = document.getElementById('search-icon');
const searchPanel = document.getElementById('search-panel');
const closeBtn = document.getElementById('close-search');

searchBtn.addEventListener('click', () => {
  searchPanel.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
  searchPanel.classList.add('hidden');
});


const input=document.querySelector('.search-header input')
const movie_list_item=document.querySelector('.search-results')
const top_10=document.getElementById('top10')

async function get_movie_by_search(search_term){
  const resp=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`)
  const respData= await resp.json()
  return respData.results
}

async function get_top_movies() {
  const resp = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_count.gte=1000&api_key=${API_KEY}&language=en`);
  const respData = await resp.json();
  return respData.results.slice(0, 10);
}

async function get_new_reales_movies() {
  const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
  const respData = await resp.json();
  return respData.results;
}

async function get_movies() {
  const resp = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en&page=1`);
  const respData = await resp.json();
  return respData.results;
}

async function get_series() {
  const resp = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en&page=1`);
  const respData = await resp.json();
  return respData.results;
}


let timeout = null

input.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    if (input.value.trim() !== '') {
      add_search_movie_to_dom()
    } else {
      movie_list_item.innerHTML = ''
    }
  }, 400)
})


async function add_search_movie_to_dom() {
  const data = await get_movie_by_search(input.value)
  console.log(data)

  movie_list_item.innerHTML = data.map(e => {
    return `
      <div class="movie-list-item" data-id='${e.id}' data-type="movie">
        <img class="movie-list-item-img" src="${image_path + e.poster_path}" alt="">
        <span class="movie-list-item-title">${e.title}</span>
        <p class="movie-list-item-desc">
                   ${e.overview ? e.overview.slice(0, 100) + '...' : 'No description available.'}
        </p>
        <button class="movie-list-item-button">Watch</button>
      </div>
    `
  }).join('')
  const cards = document.querySelectorAll('.movie-list-item')
  add_click_effect_to_card(cards)
}



add_search_movie_to_dom_top_10()

async function add_search_movie_to_dom_top_10() {
  const data = await get_top_movies()
  top_10.innerHTML = data.map(e => {
    return `
      <div class="movie-list-item" data-id='${e.id}' data-type="movie">
        <img class="movie-list-item-img" src="${image_path + e.poster_path}" alt="">
        <span class="movie-list-item-title">${e.title}</span>
        <p class="movie-list-item-desc">
                   ${e.overview ? e.overview.slice(0, 100) + '...' : 'No description available.'}
        </p>
        <button class="movie-list-item-button">Watch</button>
      </div>
    `
  }).join('')
  const cards = document.querySelectorAll('.movie-list-item')
  add_click_effect_to_card(cards)
  setupArrows()
}
const new_realise=document.getElementById('new_releases')
add_search_movie_to_dom_new_realise()

async function add_search_movie_to_dom_new_realise() {
  const data = await get_new_reales_movies()
  new_realise.innerHTML = data.map(e => {
    return `
      <div class="movie-list-item" data-id='${e.id} data-type="movie"'>
        <img class="movie-list-item-img" src="${image_path + e.poster_path}" alt="">
        <span class="movie-list-item-title">${e.title}</span>
        <p class="movie-list-item-desc">
                   ${e.overview ? e.overview.slice(0, 100) + '...' : 'No description available.'}
        </p>
        <button class="movie-list-item-button">Watch</button>
      </div>
    `
  }).join('')
  const cards = document.querySelectorAll('.movie-list-item')
  add_click_effect_to_card(cards)
  setupArrows()
}

const get_movie=document.getElementById('movies')
add_search_movie_to_dom_movies()

async function add_search_movie_to_dom_movies() {
  const data = await get_movies()
  get_movie.innerHTML = data.map(e => {
    return `
      <div class="movie-list-item" data-id='${e.id} data-type="movie"'>
        <img class="movie-list-item-img" src="${image_path + e.poster_path}" alt="">
        <span class="movie-list-item-title">${e.title}</span>
        <p class="movie-list-item-desc">
                   ${e.overview ? e.overview.slice(0, 100) + '...' : 'No description available.'}
        </p>
        <button class="movie-list-item-button">Watch</button>
      </div>
    `
  }).join('')
  const cards = document.querySelectorAll('.movie-list-item')
  add_click_effect_to_card(cards)
  setupArrows()
}

const get_serie=document.getElementById('series')
add_search_movie_to_dom_series()
async function add_search_movie_to_dom_series() {
  const data = await get_series()
  get_serie.innerHTML = data.map(e => {
    return `
      <div class="movie-list-item" data-id="${e.id}" data-type="tv">
        <img class="movie-list-item-img" src="${image_path + e.poster_path}" alt="">
        <span class="movie-list-item-title">${e.name}</span>
        <p class="movie-list-item-desc">
          ${e.overview ? e.overview.slice(0, 100) + '...' : 'No description available.'}
        </p>
        <button class="movie-list-item-button">Watch</button>
      </div>
    `
  }).join('')

  const cards = document.querySelectorAll('.movie-list-item')
  add_click_effect_to_card(cards)
  setupArrows()
}


const popup_container = document.querySelector('.popup-container')

function add_click_effect_to_card (cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => show_popup(card))
    })

}


async function get_movie_by_id (id) {
  const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
  const respData = await resp.json()
  return respData
}
async function get_tv_show_by_id(id) {
  const resp = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
  const respData = await resp.json();
  return respData;
}

async function get_movie_trailer(id, type = 'movie') {
  const resp = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
  const respData = await resp.json();
  const trailer = respData.results.find(video => video.type === "Trailer" && video.site === "YouTube");
  return trailer ? trailer.key : null;
}


// async function show_popup (card) {
//  popup_container.classList.add('show-popup')
//  const movie_id = card.getAttribute('data-id')
//     const movie = await get_movie_by_id(movie_id)
//     const movie_trailer = await get_movie_trailer(movie_id)

//     popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`

//     popup_container.innerHTML = `
//             <span class="x-icon">&#10006;</span>
//             <div class="content">
//                 <div class="left">
//                     <div class="poster-img">
//                         <img src="${image_path + movie.poster_path}" alt="">
//                     </div>
//                     <div class="single-info">
//                         <span>Add to favorites:</span>
//                         <span class="heart-icon">&#9829;</span>
//                     </div>
//                 </div>
//                 <div class="right">
//                     <h1>${movie.title}</h1>
//                     <h3>${movie.tagline}</h3>
//                     <div class="single-info-container">
//                         <div class="single-info">
//                             <span>Language:</span>
//                             <span>${movie.spoken_languages[0].name}</span>
//                         </div>
//                         <div class="single-info">
//                             <span>Length:</span>
//                             <span>${movie.runtime} minutes</span>
//                         </div>
//                         <div class="single-info">
//                             <span>Rate:</span>
//                             <span>${movie.vote_average} / 10</span>
//                         </div>
//                         <div class="single-info">
//                             <span>Budget:</span>
//                             <span>$ ${movie.budget}</span>
//                         </div>
//                         <div class="single-info">
//                             <span>Release Date:</span>
//                             <span>${movie.release_date}</span>
//                         </div>
//                     </div>
//                     <div class="genres">
//                         <h2>Genres</h2>
//                         <ul>
//                             ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
//                         </ul>
//                     </div>
//                     <div class="overview">
//                         <h2>Overview</h2>
//                         <p>${movie.overview}</p>
//                     </div>
//                     <div class="trailer">
//                         <h2>Trailer</h2>
//                         <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
//                     </div>
//                 </div>
//             </div>
//     `
//     const x_icon = document.querySelector('.x-icon')
//     x_icon.addEventListener('click', () => popup_container.classList.remove('show-popup'))
// }

async function show_popup(card) {
  popup_container.classList.add('show-popup');
  const movie_id = card.getAttribute('data-id');
  const type = card.getAttribute('data-type') || 'movie'; // Προσθέτεις τύπο: 'movie' ή 'tv'

  const movie = type === 'movie'
    ? await get_movie_by_id(movie_id)
    : await get_tv_show_by_id(movie_id);

  const movie_trailer = await get_movie_trailer(movie_id, type);

  const title = movie.title || movie.name || 'Χωρίς τίτλο';
  const releaseDate = movie.release_date || movie.first_air_date || 'Άγνωστη';
  const runtime = movie.runtime || (movie.episode_run_time ? movie.episode_run_time[0] : null);
  const budget = movie.budget !== undefined ? `$ ${movie.budget}` : 'N/A';
  const tagline = movie.tagline || '';
  const language = movie.spoken_languages?.[0]?.name || 'N/A';

  popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`;

  popup_container.innerHTML = `
    <span class="x-icon">&#10006;</span>
    <div class="content">
      <div class="left">
        <div class="poster-img">
          <img src="${image_path + movie.poster_path}" alt="">
        </div>
        <div class="single-info">
          <span>Add to favorites:</span>
          <span class="heart-icon">&#9829;</span>
        </div>
      </div>
      <div class="right">
        <h1>${title}</h1>
        <h3>${tagline}</h3>
        <div class="single-info-container">
          <div class="single-info">
            <span>Language:</span>
            <span>${language}</span>
          </div>
          <div class="single-info">
            <span>Length:</span>
            <span>${runtime ? runtime + ' minutes' : 'N/A'}</span>
          </div>
          <div class="single-info">
            <span>Rate:</span>
            <span>${movie.vote_average} / 10</span>
          </div>
          <div class="single-info">
            <span>Budget:</span>
            <span>${budget}</span>
          </div>
          <div class="single-info">
            <span>Release Date:</span>
            <span>${releaseDate}</span>
          </div>
        </div>
        <div class="genres">
          <h2>Genres</h2>
          <ul>
            ${(movie.genres || []).map(e => `<li>${e.name}</li>`).join('')}
          </ul>
        </div>
        <div class="overview">
          <h2>Overview</h2>
          <p>${movie.overview}</p>
        </div>
        <div class="trailer">
          <h2>Trailer</h2>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  document.querySelector('.x-icon').addEventListener('click', () => {
    popup_container.classList.remove('show-popup');
  });




//local strore for heart

const heart_icon = popup_container.querySelector('.heart-icon');

const movie_ids = await get_ls(); 
for (let i = 0; i < movie_ids.length; i++) {
  if (movie_ids[i].id == movie_id && movie_ids[i].type == type) {
    heart_icon.classList.add('change-color');
    break;
  }
}

heart_icon.addEventListener('click', async () => {
  if (heart_icon.classList.contains('change-color')) {
       await remove_ls(movie_id, type);
    heart_icon.classList.remove('change-color');
  } else {
     await add_ls(movie_id, type);
    heart_icon.classList.add('change-color');
  }
  fetch_favorite_movies();
});

}

// Local Storage
 async function get_ls() {
  const raw = localStorage.getItem('favorites');
  return raw ? JSON.parse(raw) : [];
}

async function add_ls(id, type = 'movie') {
   const favorites = await get_ls();
    const exists = favorites.some(item => item.id === id && item.type === type);
    if (!exists) {
      favorites.push({ id, type });
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

async function remove_ls(id, type = 'movie') {
  const favorites = await get_ls(); 
  const updated = favorites.filter(item => !(item.id === id && item.type === type));
  localStorage.setItem('favorites', JSON.stringify(updated));
}



fetch_favorite_movies();

async function fetch_favorite_movies() {
  const main_grid = document.querySelector('.favorites-list');
  main_grid.innerHTML = '';

  const movies_LS =  await get_ls(); // Παίρνει [{id, type}]
  if (movies_LS.length === 0) {
    main_grid.innerHTML = ' ';
    return;
  }

  for (const { id, type } of movies_LS) {
    let movie = type === 'movie'
      ? await get_movie_by_id(id)
      : await get_tv_show_by_id(id);

    add_favorites_to_dom_from_LS(movie, type);
  }
}

function add_favorites_to_dom_from_LS(movie_data, type) {
  const main_grid = document.getElementById('favorites-list');

  const title = movie_data.title || movie_data.name || 'Χωρίς τίτλο';
  const overview = movie_data.overview
    ? movie_data.overview.slice(0, 100) + '...'
    : 'No description available.';

  const card = document.createElement('div');
  card.classList.add('movie-list-item');
  card.setAttribute('data-id', movie_data.id);
  card.setAttribute('data-type', type);
  card.innerHTML = `
    <img class="movie-list-item-img" src="${image_path + movie_data.poster_path}" alt="">
    <span class="movie-list-item-title">${title}</span>
    <p class="movie-list-item-desc">${overview}</p>
    <button class="movie-list-item-button">Watch</button>
  `;

    main_grid.appendChild(card);
    const cards=document.querySelectorAll('.movie-list-item')
    add_click_effect_to_card(cards)
  
}

document.querySelector('#favorites-icon').addEventListener('click', () => {
  document.querySelector('#favorites-container').classList.remove('hidden');
  fetch_favorite_movies();
});

document.querySelector('.close-favorites').addEventListener('click', () => {
  document.querySelector('#favorites-container').classList.add('hidden');
});
