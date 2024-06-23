// query DOM
const imageUpload = document.querySelector("#image-upload");
const fileInput = document.querySelector("#image");
const imagePreview = document.querySelector("#image-preview");

// declare functions
const fileInputClick = () => {
  fileInput.click();
};

const updateImage = () => {
  const [file] = fileInput.files;
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
};

// bind events
imageUpload.addEventListener("click", fileInputClick);
fileInput.addEventListener("change", updateImage);
