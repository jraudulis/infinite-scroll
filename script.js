// Unsplash API
const photoContainer = document.getElementById('picture-container');
const loadingScreen = document.getElementById('loader-container');
const apiKey = 'so2V6iCiqSgz7kgwSsRCx9r_Xb7S0z04bUZvTV8wIMs';
let initialPhotoLoad = true;
let count = 5;
let unsplashApi = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

let finished = false;
let photosLoaded = 0;
let totalPhotos = 0;
let photoData = [];

function updateApiUrlCount(newCount){
    const timeStamp = Date.now();
    unsplashApi = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${newCount}&timeStamp=${timeStamp}`;
}

function CheckAllPhotosLoaded() {
    photosLoaded++;
    if (photosLoaded === totalPhotos) {
        finished = true;
        loadingScreen.hidden = true;
    }
}
// Fetch photos and update ammount of photos fetched
async function fetchPhotos() {
    try {
        const response = await fetch(unsplashApi);
        photoData = await response.json();
        displayPhotos();
        if (initialPhotoLoad) {
            updateApiUrlCount(20);
            initialPhotoLoad = false;
        }
    } catch (error){
        console.log('Failed to fetch', error)
    }
}

// Helper function for setting attributes on DOM image and link elements
function setAttributes(element, attributes) {
    for (const key in attributes ) {
        element.setAttribute(key, attributes[key]);
    }
}

// Display photos function
function displayPhotos() {
    photosLoaded = 0;
    totalPhotos = photoData.length;
    photoData.forEach((photo) =>{
    // Creat new links and connect them to unsplash image links
    const unsplashLink = document.createElement('a');
    setAttributes(unsplashLink, {
        href: photo.links.html,
        target: '_blank'
    })
    // Create img element to add unsplash photo
    const unsplashPhoto = document.createElement('img');
    setAttributes(unsplashPhoto, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description
    })
    // Check when all the images are finished loading 
    unsplashPhoto.addEventListener('load', CheckAllPhotosLoaded);
    // Add unsplash photo to previously created <a> tag
    unsplashLink.appendChild(unsplashPhoto);
    photoContainer.appendChild(unsplashLink);
    });
}
// Check if the scrollbar is at the bottom and trigger on that event displayPhotos function to keep display going
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && finished) {
        fetchPhotos()
    }
})

fetchPhotos();

