$(document).ready(function () {
  // Core function: PokeCard creation with PokeAPI & CanvasJS
  const createPokeCard = function (id) {

    // RESTful API HTTP GET request
    var settings = {
      url: `https://pokeapi.co/api/v2/pokemon/${id}`,
      method: "GET",
      dataType: "json",
      timeout: 0,
    };

    // AJAX call
    $.ajax(settings).done(function (response) {
      // Pokemon generation asignment function (data not available in PokeAPI at all)
      const findGeneration = (id) => {
        switch (true) {
          case id >= 1 && id <= 151:
            return 1;
          case id >= 152 && id <= 251:
            return 2;
          case id >= 252 && id <= 386:
            return 3;
          case id >= 387 && id <= 493:
            return 4;
          case id >= 494 && id <= 649:
            return 5;
          case id >= 650 && id <= 721:
            return 6;
          case id >= 722 && id <= 809:
            return 7;
          case id >= 810 && id <= 905:
            return 8;
          default:
            return 9;
        }
      };

      // Pokemon types' traditional color palette
      const pokeColors = {
        normal: "#c1c2c1",
        fighting: "#ffac59",
        flying: "#add2f5",
        poison: "#b884dd",
        ground: "#b88e6f",
        rock: "#cbc7ad",
        bug: "#b8c26a",
        ghost: "#a284a2",
        steel: "#98c2d1",
        fire: "#ef7374",
        water: "#74acf5",
        grass: "#82c274",
        electric: "#fcd659",
        psychic: "#f584a8",
        ice: "#81dff7",
        dragon: "#8d98ec",
        dark: "#998b8c",
        fairy: "#f5a2f5",
        unknown: "#808080",
        shadow: "#333333",
      };

      // PokeCard class definition
      class pokeCard {
        constructor(
          sprite,
          number,
          generation,
          name,
          nameRender,
          primaryTypeHTML,
          secondaryTypeHTML,
          primaryTypeCSS,
          secondaryTypeCSS,
          primaryTypeRender,
          secondaryTypeRender,
          specialAbility,
          height,
          weight,
          hitpoints,
          attack,
          defense,
          specialAttack,
          specialDefense,
          speed
        ) {
          this.sprite = sprite;
          this.number = number;
          // Generation asignment
          this.generation = findGeneration(generation);
          this.name = name;
          // Uppercase
          this.nameRender =
            nameRender.charAt(0).toUpperCase() + nameRender.slice(1);
          this.primaryTypeHTML = primaryTypeHTML;
          this.secondaryTypeHTML = secondaryTypeHTML;
          this.primaryTypeCSS = primaryTypeCSS;
          this.secondaryTypeCSS = secondaryTypeCSS;
          this.primaryTypeRender = primaryTypeRender;
          this.secondaryTypeRender = secondaryTypeRender;
          this.specialAbility =
            specialAbility.charAt(0).toUpperCase() + specialAbility.slice(1);
          // Metric unit conversion
          this.height = (height * 0.1).toFixed(2);
          this.weight = (weight * 0.1).toFixed(2);
          this.hitpoints = hitpoints;
          this.attack = attack;
          this.defense = defense;
          this.specialAttack = specialAttack;
          this.specialDefense = specialDefense;
          this.speed = speed;
        }
      }

      // PokeCard instantiation with API response data
      const card = new pokeCard(
        response.sprites.front_default,
        response.id,
        response.id,
        response.name,
        response.name,
        // API array slides (cannot be called in class definition)
        response.types[0].type.name,
        response.types[1] ? response.types[1].type.name : "",
        pokeColors[response.types[0].type.name],
        response.types[1]
          ? pokeColors[response.types[1].type.name]
          : pokeColors[response.types[0].type.name],
        `<span class="badge border border-dark text-light" style="background-color: ${
          pokeColors[response.types[0].type.name]
        }">${
          response.types[0].type.name.charAt(0).toUpperCase() +
          response.types[0].type.name.slice(1)
        }</span>`,
        response.types[1]
          ? ` / <span class="badge border border-dark text-light" style="background-color: ${
              pokeColors[response.types[1].type.name]
            }">${
              response.types[1].type.name.charAt(0).toUpperCase() +
              response.types[1].type.name.slice(1)
            }</span>`
          : "",
        response.abilities[0].ability.name,
        response.height,
        response.weight,
        response.stats[0].base_stat,
        response.stats[1].base_stat,
        response.stats[2].base_stat,
        response.stats[3].base_stat,
        response.stats[4].base_stat,
        response.stats[5].base_stat
      );

      // PokeCard HTML string array
      const pokeCardRender = [
        `<div class="row mt-5 justify-content-center poke-card number-${card.number} generation-${card.generation} name-${card.name} primarytype-${card.primaryTypeHTML} ${card.primaryTypeHTML} secondarytype-${card.secondaryTypeHTML} ${card.secondaryTypeHTML} height-${card.height} weight-${card.weight} hitpoints-${card.hitpoints} attack-${card.attack} defense-${card.defense} specialattack-${card.specialAttack} specialdefense-${card.specialDefense} speed-${card.speed}">`,
        `<div class="card px-0 fw-bold text-light" style="width: 18rem; background: linear-gradient(to left, ${card.primaryTypeCSS}, ${card.secondaryTypeCSS});">`,
        `<img class="card-img-top" src="${card.sprite}" alt="${card.name}">`,
        `<ul class="list-group list-group-flush">`,
        `<span class="border border-dark py-2">#${card.number} ${card.nameRender}</span>`,
        `<span class="border border-dark py-2">Type(s): ${card.primaryTypeRender}${card.secondaryTypeRender}</span>`,
        `<span class="border border-dark py-2">Special ability: ${card.specialAbility}</span>`,
        `<span class="border border-dark py-2">Height: ${card.height} meters</span>`,
        `<span class="border border-dark py-2">Weight: ${card.weight} kilograms</span>`,
        `</ul>`,
        `</div>`,
        `<div class="card stats-card-${card.number}" style="width: 18rem; height: 36rem; background: linear-gradient(to right, ${card.primaryTypeCSS}, ${card.secondaryTypeCSS});">`,
        `</div>`,
        `</div>`,
      ];

      // PokeCard renderization
      $("#render").append(pokeCardRender.join(""));

      // PokeCard stats with CanvaJS
      $(`.stats-card-${card.number}`).each(function () {
        $(this).CanvasJSChart({
          backgroundColor: "transparent",
          title: {
            text: `${card.nameRender} Stats`,
            padding: 24,
            fontSize: 24,
            fontFamily: "sans-serif",
            fontColor: "#f8f9fa",
          },
          legend: {
            fontSize: 14,
            fontFamily: "sans-serif",
            fontColor: "#f8f9fa",
          },
          data: [
            {
              type: "pie",
              radius: "75%",
              startAngle: 60,
              showInLegend: true,
              toolTipContent: "{label} <br/> {y}",
              indexLabel: "{y}",
              indexLabelFontSize: 14,
              indexLabelFontFamily: "sans-serif",
              indexLabelFontColor: "#f8f9fa",
              dataPoints: [
                {
                  label: "Hitpoints",
                  y: `${card.hitpoints}`,
                  color: "#0d6efd",
                  legendText: "Hitpoints",
                },
                {
                  label: "Attack",
                  y: `${card.attack}`,
                  color: "#dc3545",
                  legendText: "Attack",
                },
                {
                  label: "Defense",
                  y: `${card.defense}`,
                  color: "#198754",
                  legendText: "Defense",
                },
                {
                  label: "Special Attack",
                  y: `${card.specialAttack}`,
                  color: "#ffc107",
                  legendText: "Special Attack",
                },
                {
                  label: "Special Defense",
                  y: `${card.specialDefense}`,
                  color: "#6f42c1",
                  legendText: "Special Defense",
                },
                {
                  label: "Speed",
                  y: `${card.speed}`,
                  color: "#fd7e14",
                  legendText: "Speed",
                },
              ],
            },
          ],
        });
      });
    });
  };

  // Main PokeCard creation form
  $("#main-select").on("submit", function (event) {
    event.preventDefault();
    let id = $("#main-input").val();
    const pattern = /^[1-9]\d*$/;
    if (pattern.test(id) === false || id > 1025) {
      $("#alert").html(
        [
          `<div class="alert alert-danger alert-dismissible col-8 col-sm-5 col-md-4 col-lg-3 mx-auto" role="alert">`,
          `<span>Por favor ingrese un número del 1 al 1025</span>`,
          `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
          `</div>`,
        ].join("")
      );
    } else {
      $("#alert").html("");
      createPokeCard(id);
    }
  });

  // Nav PokeCard creation form
  $("#nav-select").on("submit", function (event) {
    event.preventDefault();
    // Exception handling
    let id = $("#nav-input").val();
    const pattern = /^[1-9]\d*$/;
    if (pattern.test(id) === false || id > 1025) {
      $("#alert").html(
        [
          `<div class="alert alert-danger alert-dismissible col-8 col-sm-5 col-md-4 col-lg-3 mx-auto" role="alert">`,
          `<span>Por favor ingrese un número del 1 al 1025</span>`,
          `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
          `</div>`,
        ].join("")
      );
    } else {
      // Alert clearing
      $("#alert").html("");
      // PokeCard creation
      createPokeCard(id);
    }
  });

  // Toggle control switches
  $("#where-switch").change(function () {
    if ($("#main-where").hasClass("d-none")) {
      $("#main-where").removeClass("d-none");
    } else {
      $("#main-where").addClass("d-none");
    }
  });
  $("#order-by-switch").change(function () {
    if ($("#main-order-by").hasClass("d-none")) {
      $("#main-order-by").removeClass("d-none");
    } else {
      $("#main-order-by").addClass("d-none");
    }
  });

  // PokeCard filter function
  const filterPokeCard = function (value, boolean) {
    // A boolean is used to secure proper behaviour
    if (boolean === true) {
      // Include
      $(`.${value}`).removeClass("d-none");
    } else {
      // Exclude
      $(`.${value}`).addClass("d-none");
    }
  };

  // PokeCard filter controls
  $('.form-check-input[type="checkbox"]').change(function () {
    let value = $(this).val();
    if ($(this).prop("checked")) {
      // All checkboxes (main & nav) with the same value are checked without being triggered
      $(`.form-check-input[type="checkbox"][value="${value}"]`)
        .not(this)
        .prop("checked", true);
      // PokeCards are filtered in the chosen criteria
      filterPokeCard(value, true);
    } else {
      // All radios (main & nav) with the same value are unchecked without being triggered
      $(`.form-check-input[type="checkbox"][value="${value}"]`)
        .not(this)
        .prop("checked", false);
      // PokeCards are filtered in the chosen criteria
      filterPokeCard(value, false);
    }
  });

  // PokeCards array shouldn't be defined inside the function, preventing bugs
  const pokeCards = [];
  // PokeCard sort function
  const orderPokeCard = function (value) {
    // Current PokeCards to be sorted
    const pokeCardsRender = document.querySelectorAll(".poke-card");
    // DOM into array conversion
    pokeCardsRender.forEach((card) => {
      pokeCards.unshift(card);
    });
    // Sorting the array
    // Pokemon numbers are sorted in ascending order
    if (value === "number") {
      pokeCards.sort(function (a, b) {
        let valueA = parseInt(
          $(a)
            .attr("class")
            // HTML classes array
            .split(" ")
            // Finds corresponding HTML class through preffix
            .find((c) => c.startsWith(`${value}-`))
            // Finds data through suffix
            .split("-")[1]
        );
        let valueB = parseInt(
          $(b)
            .attr("class")
            .split(" ")
            .find((c) => c.startsWith(`${value}-`))
            .split("-")[1]
        );
        return valueA - valueB;
      });
    // Pokemon names and Pokemon types are sorted in alphabetic order
    } else if (
      value === "name" ||
      value === "primarytype" ||
      value === "secondarytype"
    ) {
      pokeCards.sort(function (a, b) {
        let valueA = $(a)
          .attr("class")
          .split(" ")
          .find((c) => c.startsWith(`${value}-`))
          .split("-")[1];
        let valueB = $(b)
          .attr("class")
          .split(" ")
          .find((c) => c.startsWith(`${value}-`))
          .split("-")[1];
        return valueA.localeCompare(valueB);
      });
    // Pokemon numeric data (other than Pokemon number) is sorted in descending order
    } else {
      pokeCards.sort(function (a, b) {
        let valueA = parseInt(
          $(a)
            .attr("class")
            .split(" ")
            .find((c) => c.startsWith(`${value}-`))
            .split("-")[1]
        );
        let valueB = parseInt(
          $(b)
            .attr("class")
            .split(" ")
            .find((c) => c.startsWith(`${value}-`))
            .split("-")[1]
        );
        return valueB - valueA;
      });
    }
    // DOM clearing
    $("#render").html("");
    // Sorted PokeCards are now renderized
    pokeCards.forEach((card) => {
      $("#render").append(card);
    });
  };

  // PokeCard sort controls
  $('.form-check-input[type="radio"]').change(function () {
    let value = $(this).val();
    if ($(this).prop("checked")) {
      // All radios (main & nav) with the same value are checked without being triggered
      $(`.form-check-input[type="radio"][value="${value}"]`)
        .not(this)
        .prop("checked", true);
      // All other radios are unchecked
      $(`.form-check-input[type="radio"]:not([value="${value}"])`).prop(
        "checked",
        false
      );
      // PokeCards are sorted in the chosen order
      orderPokeCard(value);
    }
  });
});
