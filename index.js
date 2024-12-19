// JavaScript file for Ramen Rater App
document.addEventListener("DOMContentLoaded", main);

function main() {
    displayRamens();
    addSubmitListener();
    addEditListener();
}

// Core Deliverables
function displayRamens() {
    fetch("http://localhost:3000/ramens")
        .then((response) => response.json())
        .then((ramens) => {
            const ramenMenu = document.getElementById("ramen-menu");
            ramens.forEach((ramen) => {
                const img = document.createElement("img");
                img.src = ramen.image;
                img.alt = ramen.name;
                img.addEventListener("click", () => handleClick(ramen));
                ramenMenu.appendChild(img);
            });
            if (ramens.length > 0) handleClick(ramens[0]); // Display the first ramen details initially
        });
}

function handleClick(ramen) {
    const detailDiv = document.getElementById("ramen-detail");
    detailDiv.querySelector(".detail-image").src = ramen.image;
    detailDiv.querySelector(".detail-image").alt = ramen.name;
    detailDiv.querySelector(".name").textContent = ramen.name;
    detailDiv.querySelector(".restaurant").textContent = ramen.restaurant;
    document.getElementById("rating-display").textContent = ramen.rating;
    document.getElementById("comment-display").textContent = ramen.comment;

    // Prepopulate the edit form
    document.getElementById("new-rating").value = ramen.rating;
    document.getElementById("new-comment").value = ramen.comment;
    document.getElementById("edit-ramen").dataset.id = ramen.id;
}

function addSubmitListener() {
    const form = document.getElementById("new-ramen");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newRamen = {
            name: e.target.name.value,
            restaurant: e.target.restaurant.value,
            image: e.target.image.value,
            rating: e.target.rating.value,
            comment: e.target.comment.value,
        };

        // Add to the #ramen-menu div
        const ramenMenu = document.getElementById("ramen-menu");
        const img = document.createElement("img");
        img.src = newRamen.image;
        img.alt = newRamen.name;
        img.addEventListener("click", () => handleClick(newRamen));
        ramenMenu.appendChild(img);

        // Reset the form
        form.reset();
    });
}

// Advanced Deliverables
function addEditListener() {
    const editForm = document.getElementById("edit-ramen");
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const ramenId = e.target.dataset.id;
        const updatedRating = e.target["new-rating"].value;
        const updatedComment = e.target["new-comment"].value;

        // Update the display
        document.getElementById("rating-display").textContent = updatedRating;
        document.getElementById("comment-display").textContent = updatedComment;

        // Persist changes via PATCH request
        fetch(`http://localhost:3000/ramens/${ramenId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating: updatedRating, comment: updatedComment }),
        });
    });
}

// Extra Advanced Deliverables (Adding a Delete Button)
function addDeleteListener() {
    const deleteButton = document.getElementById("delete-ramen");
    deleteButton.addEventListener("click", () => {
        const ramenId = document.getElementById("edit-ramen").dataset.id;

        // Remove ramen from DOM
        const ramenMenu = document.getElementById("ramen-menu");
        const images = ramenMenu.querySelectorAll("img");
        images.forEach((img) => {
            if (img.alt === document.querySelector("#ramen-detail .name").textContent) {
                ramenMenu.removeChild(img);
            }
        });

        // Clear details display
        const detailDiv = document.getElementById("ramen-detail");
        detailDiv.querySelector(".name").textContent = "";
        detailDiv.querySelector(".restaurant").textContent = "";
        detailDiv.querySelector(".detail-image").src = "./assets/image-placeholder.jpg";
        detailDiv.querySelector(".detail-image").alt = "";
        document.getElementById("rating-display").textContent = "";
        document.getElementById("comment-display").textContent = "";

        // Persist deletion via DELETE request
        fetch(`http://localhost:3000/ramens/${ramenId}`, {
            method: "DELETE",
        });
    });
}
