import "./css/styles.css";
import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const searchQuery = document.querySelector('.form-input');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';
let lightbox;

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

function handleSubmit(event) {
  event.preventDefault();
  const query = searchQuery.value.trim();

  if (query === '') {
    return;
  }

  page = 1;
  currentQuery = query;
  fetchImages(currentQuery, page);
}

async function fetchImages(query, page) {
  const apiKey = '35951094-a93acafa222cd42a3edf336d6';
  const url = 'https://pixabay.com/api/';

  try {
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });
    const { hits, totalHits } = response.data;
    
    if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    
    renderGallery(hits);
    
    if (totalHits > gallery.children.length) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong. Please try again later.');
  }
}

function renderGallery(images) {
  if (page === 1) {
    gallery.innerHTML = '';
  }
  
  images.forEach(image => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
    
    const card = `
      <a href="${largeImageURL}" class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </a>
    `;
    
    gallery.insertAdjacentHTML('beforeend', card);
  });
  
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', { /* options */ });
  }
}

function handleLoadMore() {
  page++;
  fetchImages(currentQuery, page);
}