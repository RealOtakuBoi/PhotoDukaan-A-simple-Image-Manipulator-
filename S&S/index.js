

const fileInput = document.querySelector(".file-input");
const previewImg = document.querySelector(".preview-image img");

const filterOptions = document.querySelectorAll(".filters button");
const filterName = document.querySelector(".filter-info .name");
const filterIntensity = document.querySelector(".sliders input");
const filterValue = document.querySelector(".filter-info .value");

const rotateOptions = document.querySelectorAll(".rotations button");

const chooseBtn = document.querySelector(".choose-img");
const resetFilterBtn = document.querySelector(".reset-filters");
const saveImgBtn = document.querySelector(".save-img");


let brightness = 100;
let saturation = 100;
let inversion = 0;
let grayscale = 0;

let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;








const selectedImg = () => {
    let file = fileInput.files[0];
    if(!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load",() => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
};

fileInput.addEventListener("change",selectedImg)
chooseBtn.addEventListener("click", () => fileInput.click());
resetFilterBtn.addEventListener("click",resetFilter);
saveImgBtn.addEventListener("click",saveImage);


filterOptions.forEach(option => {
    option.addEventListener("click",() => {
        document.querySelector(".filters .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === 'brightness'){
            filterIntensity.max = "200"
            filterIntensity.value = brightness;
            filterValue.innerText = `${brightness}%`
        }
        else if(option.id === 'saturation'){
            filterIntensity.max = "200"
            filterIntensity.value = saturation;
            filterValue.innerText = `${saturation}%`
        }
        else if(option.id === 'inversion'){
            filterIntensity.max = "100"
            filterIntensity.value = inversion;
            filterValue.innerText = `${inversion}%`
        }
        else{
            filterIntensity.max = "100"
            filterIntensity.value = grayscale;
            filterValue.innerText = `${grayscale}%`
        }
    })
});



const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}


filterIntensity.addEventListener("input",updateFilter);


function updateFilter(){
    filterValue.innerText = `${filterIntensity.value}%`;
    const selectedFilter = document.querySelector(".filters .active");

    if(selectedFilter.id === "brightness"){
        brightness = filterIntensity.value;
    }
    else if(selectedFilter.id === "saturation"){
        saturation = filterIntensity.value;
    }
    else if(selectedFilter.id === 'inversion'){
        inversion = filterIntensity.value;
    }
    else{
        grayscale = filterIntensity.value;
    }

    applyFilter();
};


rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;
        } else if(option.id === "right") {
            rotate += 90;
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});


function resetFilter(){
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
};



function saveImage(){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
  };