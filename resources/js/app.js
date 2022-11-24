// api key
const api = {
   clientId: 'iiPfxlpEEdZNtRBIbultavmXU6rjDfd_00yRNbubj_A',
};

// api urls
const recentUrl = `https://api.unsplash.com/photos/?page=1&per_page=20&client_id=${api.clientId}`;
const searchUrl = `https://api.unsplash.com/search/photos/?per_page=30&client_id=${api.clientId}`;



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
const pages = document.querySelectorAll('.page-link');
const loadMoreBtn = document.querySelector('.button');
const nextPage = document.querySelector('.next-page');
const homeIcon = document.querySelector('.home-icon');
const backToTopButton = document.querySelector(".back-to-top");


// declare variables
let currentImage = 0;
let imageData;
let searchQuery;
let currentPage = 1;


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
      // add home icon
      homeIcon.style.display = 'block';
      //remove focus from input
      searchInput.blur();
      // do the search
      searchPhoto(searchQuery);
   });
}

const searchPhoto = async (query, page) => {
   try {
      await fetch(`${searchUrl}&page=${page}&query=${query}`)
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
            changeSearchIcon();
            searchForm.classList.add('searched');
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
            changeSearchIcon();
            searchForm.classList.add('searched');
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

// Add click listener to Load More button
loadMoreBtn.addEventListener('click', (e2) => {
   e2.preventDefault();
   // Load second page content
   currentPage++;

   searchPhoto(searchQuery, currentPage);
});

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
   console.log(images);
   images.forEach((item, index) => {
      // cleate new parent element
      let imageParent = document.createElement('div');
      // give parent element class
      imageParent.className = 'recent-gallery__item'
      // create single img element
      let singleImage = document.createElement('img');
      // give image src attribute from data
      singleImage.src = item.urls.small;
      // add class to img element
      singleImage.className = cl;
      // append single image to parent element
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
   const background = document.querySelector('.image-popup__background');

   // unhide element by removing class 'hidden'
   popup.classList.remove('hidden');
   // unhide popup background
   background.style.display = 'block';
   // set href attribute for download button
   downloadBtn.href = item.links.html;
   // set src attribute from data
   image.src = item.urls.regular;

   background.addEventListener('click', () => {
      popup.classList.add('hidden');
      background.style.display = 'none';
   })

   // add click listener to close button
   closeBtn.addEventListener('click', () => {
      // hide popup by adding class 'hidden'
      popup.classList.add('hidden');
      //hide popup background
      background.style.display = 'none';
   });
}

// select buttons elements in DOM
const preBtn = document.querySelector('.pre-btn');
const nextBtn = document.querySelector('.next-btn');


// view images on popup with arows
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

// view images on popup with arows
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
});

// add click listener
nextBtn.addEventListener('click', () => {
   if(currentImage < imageData.length - 1) {
      // if current index is smaller than length of whole array add + 1 to index
      currentImage++;
      // show current image
      showPopup(imageData[currentImage]);
   }
});

// instead of 'search' text show search icon
const changeSearchIcon = () => {
   // clear button text
   searchBtn.innerHTML = '';
   // make icon
   const img = `<img class="search-icon" src="./resources//images/search.png" alt="seach-icon">`;
   // add seach icon to button
   searchBtn.insertAdjacentHTML('beforeend', img);
}

// when the user scrolls down 20px from the top of the document, show the button
window.onscroll = () => {scrollFunction()};

const scrollFunction = () => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
}

// when the user clicks on the button, scroll to the top of the document
const topFunction = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

const init = () => {

   // list recent photos
   recentPhotosHandler();
   // search for some photo
   submitSearch();
}


init();