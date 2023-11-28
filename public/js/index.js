




// Share on Instagram function
function shareOnInstagram(title, image) {
const url = `https://www.instagram.com/?url=${encodeURIComponent(image)}`;
window.open(url, "_blank");
}

// Add event listener to Instagram sharing buttons
const instagramButtons = document.getElementsByClassName("instagram-button");
Array.from(instagramButtons).forEach(button => {
const title = button.getAttribute("data-title");
const image = button.getAttribute("data-image");
button.addEventListener("click", function () {
shareOnInstagram(title, image);
});
});


