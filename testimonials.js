let reviews = JSON.parse(localStorage.getItem("reviews")) || [
  {
    name: "Botumelo",
    rating: 5,
    comment: "ParchD hibiscus drink is so refreshing. I feel lighter and my digestion has improved."
  },
  {
    name: "Kefilwe",
    rating: 5,
    comment: "The collagen yoghurt is my go-to. My skin is glowing and my gut feels amazing."
  },
  {
    name: "Thato",
    rating: 5,
    comment: "I love that ParchD uses natural ingredients and actually cares about our wellness."
  }
];

let selectedRating = 0;

function saveReviews() {
  localStorage.setItem("reviews", JSON.stringify(reviews));
}

function getStars(rating) {
  let output = "";
  for (let i = 1; i <= 5; i++) {
    output += i <= rating ? "★" : "☆";
  }
  return output;
}

function updateSummary() {
  const avgElement = document.getElementById("average-rating");
  const countElement = document.getElementById("review-count");

  if (!avgElement || !countElement) return;

  if (reviews.length === 0) {
    avgElement.textContent = "0.0/5";
    countElement.textContent = "0 reviews";
    return;
  }

  let total = 0;
  reviews.forEach(function (review) {
    total += review.rating;
  });

  const average = (total / reviews.length).toFixed(1);

  avgElement.textContent = average + "/5";
  countElement.textContent = reviews.length + " reviews";
}

function displayReviews(list = reviews) {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<article><p>No reviews found.</p></article>";
    return;
  }

  list.forEach(function (review) {
    const article = document.createElement("article");
    article.innerHTML = `
      <h3>${review.name}</h3>
      <p class="rating">${getStars(review.rating)}</p>
      <p>${review.comment}</p>
    `;
    container.appendChild(article);
  });

  updateSummary();
}

function filterReviews(rating) {
  if (rating === "all") {
    displayReviews(reviews);
    return;
  }

  const filtered = reviews.filter(function (review) {
    return review.rating === rating;
  });

  displayReviews(filtered);
}

function paintSelectedStars(rating) {
  const starButtons = document.querySelectorAll(".star");

  starButtons.forEach(function (star, index) {
    star.textContent = index < rating ? "★" : "☆";
  });

  const ratingText = document.getElementById("rating-text");
  if (ratingText) {
    ratingText.textContent = "Selected: " + rating + " stars";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const starButtons = document.querySelectorAll(".star");
  const form = document.getElementById("review-form");

  starButtons.forEach(function (star) {
    const value = Number(star.dataset.value);

    star.addEventListener("click", function () {
      selectedRating = value;
      paintSelectedStars(selectedRating);
    });

    star.addEventListener("mouseover", function () {
      const hoverValue = value;
      starButtons.forEach(function (btn, index) {
        btn.textContent = index < hoverValue ? "★" : "☆";
      });
    });

    star.addEventListener("mouseout", function () {
      paintSelectedStars(selectedRating);
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const commentInput = document.getElementById("comment");

      const name = nameInput.value.trim();
      const comment = commentInput.value.trim();

      if (!name || !comment || selectedRating === 0) {
        alert("Please enter your name, select a star rating, and write a review.");
        return;
      }

      reviews.unshift({
        name: name,
        rating: selectedRating,
        comment: comment
      });

      saveReviews();
      console.log("Saved reviews:", reviews);
      console.log("Local storage now:", localStorage.getItem("reviews"));
      displayReviews(reviews);

      form.reset();
      selectedRating = 0;
      paintSelectedStars(0);
    });
  }

  displayReviews(reviews);
  paintSelectedStars(0);
});
