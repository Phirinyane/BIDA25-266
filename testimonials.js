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

  document.getElementById("average-rating").textContent = avg + "/5";
  document.getElementById("review-count").textContent = reviews.length + " reviews";
}

function display(list = reviews) {
  const box = document.getElementById("reviews-container");
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
  if (r === "all") return display();
  display(reviews.filter(x => x.rating === r));
}

function setRating(r) {
  selectedRating = r;

  const stars = document.querySelectorAll(".star");

  stars.forEach((s, i) => {
    s.textContent = i < r ? "★" : "☆";
  });

  document.getElementById("rating-text").textContent = "Selected: " + r + " stars";
}

document.getElementById("review-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const comment = document.getElementById("comment").value;

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
  display();

  this.reset();
  setRating(0);
});

display();

