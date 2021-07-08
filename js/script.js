document
  .querySelector("#search-button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (validateSearch()) {
      $("#image-grid").html("");
      let rawSearch = $("#search-field").val();
      let search = rawSearch.trim().replace(/\s/g, "%20");
      let url = `https://images-api.nasa.gov/search?q=${search}&media_type=image`;
      populateImages(url, rawSearch);
    } else {
      alert("Search string cannot be blank.");
    }
  });

async function populateImages(url, search) {
  let response = await fetch(url);
  data = await response.json();

  if (data.collection.items.length == 0) {
    $("#image-grid").html(
      `<h3>The search term "${search}" returned no results.</h3>`
    );
  } else {
    let numImages =
      data.collection.items.length < 30 ? data.collection.items.length : 30;

    for (let i = 0; i < numImages; i++) {
      let buttonId = `image-btn-${i}`;
      let img = `${data.collection.items[`${i}`].links[0].href}`;
      let metadata = `${data.collection.items[`${i}`].data[0]}`;

      $("#image-grid").append(
        `<div class="col"><button id="${buttonId}" class="img-btn" data-bs-toggle="modal" data-bs-target="#image-modal"><img class="img-thumbnail" src="${img}"></button></div>`
      );

      document
        .querySelector(`#${buttonId}`)
        .addEventListener("click", function () {
          $("#modal-img").html(`<img src="${img}">`);
          $("#img-title").html(
            `${data.collection.items[`${i}`].data[0].title}`
          );
          $("#img-photographer").html(
            `${data.collection.items[`${i}`].data[0].photographer}`
          );
          $("#img-description").html(
            `${data.collection.items[`${i}`].data[0].description}`
          );
        });
    }
  }
}

function validateSearch() {
  return $("#search-field").val().trim() == "" ? false : true;
}

// populateImages();
