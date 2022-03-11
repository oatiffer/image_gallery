// Randomize Picsum URL page number

const randomizeURL = () => {
  const url = "https://picsum.photos/v2/list?page=1&limit=15";
  let randomPageNum = Math.floor(Math.random() * 21);

  return url.replace(/page=1/i, `page=${randomPageNum}`);
};

// Set image URL size to 800

const normalizeImageURL = (url, width, height = width) => {
  let urlArr = url.split("/");

  urlArr.splice(-2, 2, width, height);
  return urlArr.join("/");
};

// Create thumbnails based on fetched image list

const createThumbnail = (url) => {
  const thumbnailWrapperEl = document.createElement("a");
  thumbnailWrapperEl.classList.add("thumbnail__link");
  thumbnailWrapperEl.href = "#";

  const thumbnailEl = document.createElement("img");
  thumbnailEl.classList.add("thumbnail");
  thumbnailEl.src = url;

  thumbnailWrapperEl.appendChild(thumbnailEl);

  return thumbnailWrapperEl;
};

// Populate thumbnails with images from fetched list
// Fetch image list and assign first image to main container

const mainImageEl = document.querySelector(".main-image");
const thumbnailContainerEl = document.querySelector(".thumbnail-container");

fetch(randomizeURL())
  .then((response) => {
    return response.json();
  })
  .then((imageList) => {
    imageList.forEach((image) => {
      const thumbnailEl = createThumbnail(
        normalizeImageURL(image.download_url, 80)
      );
      thumbnailContainerEl.appendChild(thumbnailEl);
    });

    thumbnailContainerEl.firstElementChild.classList.add("selected");

    mainImageEl.src = normalizeImageURL(imageList[0].download_url, 800);
    mainImageEl.classList.add("show");
  })
  .catch((error) => {
    console.log(error);
  });

// Add event listener to Thumbnail Container

thumbnailContainerEl.addEventListener("click", (e) => {
  const clickedThumbnailEl = e.target;
  if (!clickedThumbnailEl.classList.contains("thumbnail")) {
    return;
  }

  e.preventDefault();

  const selectedThumbnailEl = thumbnailContainerEl.querySelector(
    ".thumbnail__link.selected"
  );
  if (selectedThumbnailEl) {
    selectedThumbnailEl.classList.remove("selected");
  }

  clickedThumbnailEl.parentElement.classList.add("selected");

  const loaderContainerEl = document.querySelector(".loader-container");
  loaderContainerEl.classList.add("show");
  loaderContainerEl.firstElementChild.classList.add("enable");

  const imageInstance = new Image();
  imageInstance.src = normalizeImageURL(clickedThumbnailEl.src, 800);
  imageInstance.onload = () => {
    loaderContainerEl.classList.remove("show");
    loaderContainerEl.firstElementChild.classList.remove("enable");
  };

  mainImageEl.src = normalizeImageURL(clickedThumbnailEl.src, 800);
});

// Add pseudo element to clicked menu item

let menuItems = document.querySelectorAll(".menu__link");

menuItems.forEach(function (item) {
  item.addEventListener("click", setActive);
});

function setActive(e) {
  e.preventDefault();

  let linkItems = document.querySelectorAll(".menu__link");

  linkItems.forEach( (linkItem) => {
    if (linkItem.classList.contains("active")) {
      linkItem.classList.remove("active");
    }
  });

  e.target.classList.add("active");

  let listItem = e.target.parentElement;
  listItem.parentElement.classList.add("paint-pseudo");
  listItem.parentElement.style.setProperty("--pos-y", listItem.offsetTop - 10 + "px");
}
