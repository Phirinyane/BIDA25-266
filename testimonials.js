let reviews = JSON.parse(localStorage.getItem("reviews")) || [
  { name: "Botumelo", rating: 5, comment: "Amazing drink!" },
  { name: "Kefilwe", rating: 4, comment: "Very tasty yoghurt." }
];

let selectedRating = 0;

function saveReviews() {
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

function stars(r) {
  let s = "";
  for (let i = 1; i <= 5; i++) {
    s += i <= r ? "★" : "☆";
  }
  return s;
}

function updateSummary() {
  let avg = 0;
  reviews.forEach(r => avg += r.rating);
  avg = reviews.length ? (avg / reviews.length).toFixed(1) : 0;

  const avgEl = document.getElementById("average-rating");
  const countEl = document.getElementById("review-count");

  if (avgEl) avgEl.textContent = avg + "/5";
  if (countEl) countEl.textContent = reviews.length + " reviews";
}

function display(list = reviews) {
  const box = document.getElementById("reviews-container");
  if (!box) return;

  box.innerHTML = "";

  list.forEach(r => {
    const el = document.createElement("article");

    el.innerHTML = `
      <h3>${r.name}</h3>
      <p class="rating">${stars(r.rating)}</p>
      <p>${r.comment}</p>
    `;

    box.appendChild(el);
  });

  updateSummary();
}

function filterReviews(r) {
  if (r === "all") {
    display(reviews);
    return;
  }

  display(reviews.filter(x => x.rating === r));
}

function setRating(r) {
  selectedRating = r;

  const starElements = document.querySelectorAll(".star");

  starElements.forEach((star, index) => {
    if (index < r) {
      star.textContent = "★";
    } else {
      star.textContent = "☆";
    }
  });

  document.getElementById("rating-text").textContent =
    "Selected: " + r + " stars";
}

  const ratingText = document.getElementById("rating-text");
  if (ratingText) {
    ratingText.textContent = "Selected: " + r + " stars";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("review-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const comment = document.getElementById("comment").value.trim();

      if (!name || !comment || selectedRating === 0) {
        alert("Fill everything");
        return;
      }

      reviews.unshift({
        name: name,
        rating: selectedRating,
        comment: comment
      });

      saveReviews();

      console.log("Saved reviews:", reviews);
      console.log("Stored in localStorage:", localStorage.getItem("reviews"));

      display();

     this.reset();
selectedRating = 0;
setRating(0);
  }

  display();
});

