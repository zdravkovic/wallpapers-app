// api key
const api = {
   clientId: 'iiPfxlpEEdZNtRBIbultavmXU6rjDfd_00yRNbubj_A',
};

// select elements in DOM
const searchInput = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__btn');
const searchForm = document.querySelector('.search-form');
const recentPhotos = document.querySelector('.recent-gallery');

let currentImage = 0;
let recentImages;


const recentPhotosHandler = async () => {
   try {
      //fetch data from api with client ID
      await fetch(`https://api.unsplash.com/photos/?page=1&per_page=10&client_id=${api.clientId}`)
      .then(res => res.json())
      .then(data => {
         // save data to variable
         recentImages = data;
         console.log(recentImages)
         // create images using saved data
         makeImages(recentImages);
      });
   } catch (error) {
      console.error(error);
   }
}

const makeImages = (images) => {
   images.forEach((item, index) => {
      // create single img element
      let singleImage = document.createElement('img');
      // give image src attribute from data
      singleImage.src = item.urls.regular;
      // add class to img element
      singleImage.className = 'recent-gallery__photo';

      // append as child element in DOM
      recentPhotos.appendChild(singleImage);

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
   const popoup = document.querySelector('.image-popup');
   const downloadBtn = document.querySelector('.image-popup__download-btn');
   const closeBtn = document.querySelector('.image-popup__close-btn');
   const image = document.querySelector('.image-popup__large-img');

   // unhide element by removing class 'hidden'
   popoup.classList.remove('hidden');
   // set href attribute for download button
   downloadBtn.href = item.links.html;
   // set src attribute from data
   image.src = item.urls.regular;

   // add click listener to close button
   closeBtn.addEventListener('click', () => {
      // hide popup by adding class 'hidden'
      popoup.classList.add('hidden');
   })
}

// Controls for viewing images

// select button elements in DOM
const preBtn = document.querySelector('.pre-btn');
const nextBtn = document.querySelector('.next-btn');

// add click listener
preBtn.addEventListener('click', () => {
   // check index of current image
   if(currentImage > 0) {
      // if 0 then subtract index by one
      currentImage--;
      // show current image
      showPopup(recentImages[currentImage]);
   }
})

nextBtn.addEventListener('click', () => {
   if(currentImage < recentImages.length - 1) {
      // if current index is smaller than length of whole array add + 1 to index
      currentImage++;
      // show current image
      showPopup(recentImages[currentImage]);
   }
});


const init = () => {
   // list recent photos
   recentPhotosHandler();
}


init();



