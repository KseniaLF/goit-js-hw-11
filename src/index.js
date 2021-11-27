
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import ApiSearch from './js/apiSearch';

const refs =  {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  input: document.querySelector('input'),
}

refs.form.addEventListener('submit', onSearch);
refs.btnLoadMore.addEventListener('click', onLoadMoreBtn);

const apiSearch = new ApiSearch();

refs.btnLoadMore.style.visibility = "hidden";

function onSearch(e) {
  e.preventDefault();
  apiSearch.query = e.currentTarget.elements.searchQuery.value.trim();

  refs.gallery.innerHTML = '';
  refs.form.reset();
  apiSearch.resetPage();

  refs.btnLoadMore.style.visibility = 'visible';

  apiSearch.getPhoto().then(({ hits, total }) => {

    if (apiSearch.query === '') {
      refs.btnLoadMore.style.visibility = "hidden";
      Notify.failure(`Please, enter your query in the search bar!`);
      return;
    }

    if (total < apiSearch.perPage) {
      refs.btnLoadMore.style.visibility = "hidden";
    }
    
    if (total === 0) {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      return;
    }
    
    Notify.success(`Hooray! We found ${total} images.`);
   
    renderGallery(hits);
    lightbox();
    
  })
}

function onLoadMoreBtn() {
  apiSearch.getPhoto().then(({ hits }) => {
    renderGallery(hits);
    lightbox();

    if (hits.length < 40){
      refs.btnLoadMore.style.visibility = "hidden";
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      // return;
    }
  })
}

function renderGallery(hits) {
  const markup = hits.map(el => `
    <div class="photo-card">
      <a class="photo-link" href="${el.largeImageURL}">
          <img class="gallery__image" src="${el.webformatURL}" alt="${el.tags}" loading="lazy" width="300" height="230" />
      </a>
      <div class="info">
          <p class="info-item">
            <b>Likes: </b>${el.likes}
          </p>
          <p class="info-item">
            <b>Views: </b>${el.views}
          </p>
          <p class="info-item">
            <b>Comments: </b>${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads: </b>${el.downloads}
          </p>
      </div>
    </div>`).join("");
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function lightbox() {
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}
