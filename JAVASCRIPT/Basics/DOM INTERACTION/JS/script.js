const CTAELEMENT = document.querySelector(".cta a");

if ( CTAELEMENT.hasAttribute("target")) {
    console.log(CTAELEMENT.getAttribute("target"));
} else {
    CTAELEMENT.setAttribute("target","blank");
}

console.log(CTAELEMENT.attributes);

document.querySelectorAll('h3').style.color = 'green';

const FEATURED = document.querySelector(".flex-active-slide");
const THEIMAGE = FEATURED.querySelector("img");

var altText = THEIMAGE.getAttribute('alt');

var captionElement = document.createElement('figcaption');

var captionText = document.createTextNode(altText);

captionElement.appendChild(captionTet);

FEATURED.appendChild(captionElement);

THEIMAGE.setAttribute("alt","");


