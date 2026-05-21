let slides = document.querySelectorAll(".slide");

let currentSlide = 0;
console.log(slides);
console.log(slides.length);
console.log("presentation.js chargé");

function showSlide(index) {

    slides.forEach(slide => {

        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}


function nextSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {

        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}


/* CHANGEMENT AUTOMATIQUE */

setTimeout(() => {

    nextSlide();

}, 4000);


setTimeout(() => {

    nextSlide();

}, 10000);


setTimeout(() => {

    nextSlide();

}, 18000);


setTimeout(() => {

    nextSlide();

}, 24000);

setTimeout(() => {

    nextSlide();

}, 30000);
setTimeout(() => {

    nextSlide();

}, 35000);
setTimeout(() => {

    nextSlide();

}, 40000);


/* TEXTE DYNAMIQUE */

let dynamicZone =
    document.getElementById("dynamic-text");


let messages = [
    "",

    "bonjour",

    "bonjour monde",

    "bonjour monde étrange",

    "bonjour monde étrange récursif",

    "structure modifiée",

    "nouvelle liaison créée",

    "boucle détectée"
];


let currentMessage = 0;


function updateDynamicText() {

    if (dynamicZone) {

        dynamicZone.textContent =
            messages[currentMessage];

        currentMessage++;

        if (currentMessage >= messages.length) {

            currentMessage = 0;
        }
    }
}


setInterval(updateDynamicText, 1000);

let frames = [
 
    "↞ ↞ ↞ ↞",
    "↞ ↞ ↞ ↞",

    "↞ ↞ ↞ ●",

    "↞ ↞ ● ↞",

    "↞ ● ↞ ↞",

    "● ↞ ↞ ↞",
    
    "↞ ↞ ↞ ↞",

];

let frame = 0;

function updateTransfer() {

    let line = document.getElementById(
        "transfer-line"
    );
    if (line) {
       line.testContent = frames[frame];

        frame++;

        if (frame >= frames.length) frame = 0;
    
    }
}

setInterval(updateTransfer, 1200);