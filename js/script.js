$(document).ready(function () {
  /**
   * Event listener for "search again" botton. Clears html content of main
   * and performs animations: hide main, show header.
   */
  document.querySelector("#top").addEventListener("click", function () {
    $("header").slideToggle();
    $("#top").toggle();
    $("footer").toggleClass("vis");
    $("#image-grid").html("");
    $("#result-txt").html("");
  });

  /**
   * Event listener for #search-field. Performs validation and search if keypress
   * is "Enter".
   */
  document
    .querySelector("#search-field")
    .addEventListener("keypress", function (event) {
      if (event.which == 13) {
        search(event);
      }
    });

  /**
   * Event listener for "search button".
   */
  document
    .querySelector("#search-button")
    .addEventListener("click", function (event) {
      search(event);
    });

  function search(event) {
    event.preventDefault();

    // Proceeds if contents of search field pass validation, error otherwise
    if (validateSearch()) {
      // Process input and build url string
      let rawSearch = $("#search-field").val();
      let search = rawSearch.trim().replace(/\s/g, "%20");
      let url = `https://images-api.nasa.gov/search?q=${search}&media_type=image`;

      // Issue fetch request to NASA API and display results
      populateImages(url, rawSearch);

      // Perform animations to hide header and show main
      $("header").slideToggle();
      $("#top").toggle();
      $("footer").toggleClass("vis");
    } else {
      alert("Search string cannot be blank.");
    }
  }

  /**
   * Issues fetch request to NASA API endpoint, plays animations and
   * builds #image-gallery.
   * @param {string} url API endpoint
   * @param {string} search Unedited search term
   */
  async function populateImages(url, search) {
    let response = await fetch(url);
    data = await response.json();

    if (data.collection.items.length == 0) {
      // Display message if no results found
      $("#result-txt").html(
        `<h3>The search term "${search}" returned no results.</h3>`
      );
    } else {
      // Limit number of results to 30 (arbitrary, can be up to 100 per request)
      let numImages =
        data.collection.items.length < 30 ? data.collection.items.length : 30;

      // Builds image grid as buttons with (modal) data-target
      for (let i = 0; i < numImages; i++) {
        let buttonId = `image-btn-${i}`;
        let img = `${data.collection.items[`${i}`].links[0].href}`;
        let metadata = `${data.collection.items[`${i}`].data[0]}`;

        $("#image-grid").append(
          `<div class="card"><button id="${buttonId}" class="img-btn" data-toggle="modal" data-target="#image-modal"><img class="card-img-top" src="${img}"></button></div>`
        );

        // Adds event listener to each button (img), which shows modal on click
        document
          .querySelector(`#${buttonId}`)
          .addEventListener("click", function () {
            $("#modal-img").html(
              `<img class="rounded img-fluid" src="${img}">`
            );
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

  /**
   * Performs input validation on #search-field. Will return false if
   * @returns {boolean} False if search string is empty, true if otherwise
   */
  function validateSearch() {
    return $("#search-field").val().trim() == "" ? false : true;
  }
});
