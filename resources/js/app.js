// api key
const api = {
   clientId: 'iiPfxlpEEdZNtRBIbultavmXU6rjDfd_00yRNbubj_A',
};

// api urls
const recentUrl = `https://api.unsplash.com/photos/?page=1&per_page=20&client_id=${api.clientId}`;
const randomPhotoUrl = `https://api.unsplash.com/photos/random/?query=mountains&orientation=landscape&client_id=${api.clientId}`;
const searchUrl = `https://api.unsplash.com/search/photos/?per_page=30&client_id=${api.clientId}`;

// page number
const page = 1;


// select elements in DOM
const searchInput = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__btn');
const searchForm = document.querySelector('.search-form');
const searchWrap = document.querySelector('.search-form__wrapper');
const recentGallery = document.querySelector('.recent');
const recentPhotos = document.querySelector('.recent-gallery');
const galleryTitle = document.querySelector('.gallery-title');
const headerElement = document.querySelector('.header');
const headerText = document.querySelector('.header__text');
const pagination = document.querySelector('.pagination');
const noPhotos = document.querySelector('.no-photos');
const notFound = document.querySelector('.not-found');
const loader = document.querySelector('.loader-back');
const popup = document.querySelector('.image-popup');

// declare variables
let currentImage = 0;
let imageData;
let searchQuery;
let searchImages;


const submitSearch = () => {
   // add listener to form submit
   searchForm.addEventListener('submit', (e)=> {
      // prevent default behavior
      e.preventDefault();
      // clear image data
      imageData = [];
      // clear last search
      recentPhotos.innerHTML = '';
      // save input value to variable
      searchQuery = searchInput.value;
      // clear input field
      searchInput.value = '';
      // remove pagination
      pagination.style.display = 'none';
      // add loader
      loader.style.display = 'block';
      // do the search
      searchPhoto(searchQuery);
   });
}


const searchPhoto = async (query) => {
   try {
      await fetch(`${searchUrl}&query=${query}`)
      .then(res => res.json())
      .then(data => {
         // save data to a variable
         imageData = data.results;
         // hide loader
         loader.style.display = 'none';

         if (imageData.length > 0) {
            // make images using data
            makeImages(imageData, 'recent-gallery__photo');

            // change section title based on search query
            galleryTitle.textContent = `Photos of ${query}`;

            // change DOM element styles
            headerText.style.display = 'none';
            galleryTitle.classList.remove('hidden');
            noPhotos.classList.add('hidden');
            notFound.classList.add('hidden');
            headerElement.classList.add('search-header');
            searchWrap.classList.add('search-wrap');
            searchBtn.classList.add('searched-btn');
            searchInput.classList.add('searched-input');
            recentGallery.style.height = 'auto';
            pagination.style.display = 'flex';

         } else {
            // change DOM element styles
            headerText.style.display = 'none';
            galleryTitle.classList.add('hidden');
            noPhotos.classList.remove('hidden');
            notFound.classList.remove('hidden');
            headerElement.classList.add('search-header');
            searchWrap.classList.add('search-wrap');
            searchBtn.classList.add('searched-btn');
            searchInput.classList.add('searched-input');
            recentGallery.style.height = 'auto';
         }
      })
   } catch(error) {
      console.error(error);
   }
}

const recentPhotosHandler = async () => {
   try {
      //fetch data from api with client ID
      await fetch(recentUrl)
      .then(res => res.json())
      .then(data => {
         // save data to variable
         imageData = data;
         // create images using saved data
         makeImages(imageData, 'recent-gallery__photo');
      });
   } catch (error) {
      console.error(error);
   }
}

const makeImages = (images, cl) => {
   images.forEach((item, index) => {
      
      // cleate new parent element
      let imageParent = document.createElement('div');
      // give parent element class
      imageParent.className = 'recent-gallery__item'
      // create single img element
      let singleImage = document.createElement('img');
      // give image src attribute from data
      singleImage.src = item.urls.regular;
      // add class to img element
      singleImage.className = cl;

      imageParent.appendChild(singleImage);

      // append as child element in DOM
      recentPhotos.appendChild(imageParent);

      // add click listener
      singleImage.addEventListener('click', () => {
         // save clicked index as currentImage variable
         currentImage = index;
         showPopup(item);
      });
   });
}

const showPopup = (item) => {
   // select elements in DOM
   const downloadBtn = document.querySelector('.image-popup__download-btn');
   const closeBtn = document.querySelector('.image-popup__close-btn');
   const image = document.querySelector('.image-popup__large-img');

   // unhide element by removing class 'hidden'
   popup.classList.remove('hidden');
   // set href attribute for download button
   downloadBtn.href = item.links.html;
   // set src attribute from data
   image.src = item.urls.regular;

   // add click listener to close button
   closeBtn.addEventListener('click', () => {
      // hide popup by adding class 'hidden'
      popup.classList.add('hidden');
   })
}

// Controls for viewing images

// select button elements in DOM
const preBtn = document.querySelector('.pre-btn');
const nextBtn = document.querySelector('.next-btn');

document.addEventListener('keydown', (e)=> {
   if (e.key === 'ArrowLeft') {
      if (!popup.classList.contains('hidden')) {
         if(currentImage > 0) {
            // if 0 then subtract index by one
            currentImage--;
            // show current image
            showPopup(imageData[currentImage]);
         }
      }
   }
});


document.addEventListener('keydown', (e)=> {
   if (e.key === 'ArrowRight') {
      if (!popup.classList.contains('hidden')) {
         if(currentImage < imageData.length - 1) {
            // if current index is smaller than length of whole array add + 1 to index
            currentImage++;
            // show current image
            showPopup(imageData[currentImage]);
         }
      }
   }
});

// add click listener
preBtn.addEventListener('click', () => {
   // check index of current image
   if(currentImage > 0) {
      // if 0 then subtract index by one
      currentImage--;
      // show current image
      showPopup(imageData[currentImage]);
   }
})

nextBtn.addEventListener('click', () => {
   if(currentImage < imageData.length - 1) {
      // if current index is smaller than length of whole array add + 1 to index
      currentImage++;
      // show current image
      showPopup(imageData[currentImage]);
   }
});
console.log()


const init = () => {
   // list recent photos
   recentPhotosHandler();
   // search for some photo
   submitSearch();
}


init();