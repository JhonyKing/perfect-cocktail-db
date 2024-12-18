class UI {
  //Display all the drinks categories
  displayCategories() {
    const categoryList = cocktail.getCategories().then((categories) => {
      const catList = categories.categories.drinks;

      //Append a first option without value
      const firstOption = document.createElement("option");
      firstOption.textContent = "-Select-";
      firstOption.value = "";
      document.querySelector("#search").appendChild(firstOption);

      //Append into the Select
      catList.forEach((category) => {
        const option = document.createElement("option");
        option.textContent = category.strCategory;
        option.value = category.strCategory.split(" ").join("_");
        document.querySelector("#search").appendChild(option);
      });
    });
  }

  displayDrinksWithIngredients(drinks) {
    //Show the results first
    const resultsWrapper = document.querySelector(".results-wrapper");
    resultsWrapper.style.display = "block";

    //Insert the results
    const resultsDiv = document.querySelector("#results");
    drinks.forEach((drink) => {
      resultsDiv.innerHTML += `
            <div class="col-md-6">
                <div class="card my-3">
                    <button type="button" data-id="${
                      drink.idDrink
                    }" class="favorite-btn btn btn-outline-info">
                    +
                    </button> 
                    <img class="card-img-top" src="${
                      drink.strDrinkThumb
                    }" alt="${drink.strDrink}">

                    <div class="card-body">
                        <h2 class="card-title text-center">${
                          drink.strDrink
                        }</h2>
                        <p class="card-text font-weight-bold">Instructions</p> 
                        <p class="card-text"> 
                            ${drink.strInstructions}
                        </p>
                        <p class="card-text">
                            <ul class="list-group">
                                <li class="list-group-item alert alert-danger">Ingredients</li>
                                ${this.displayIngredients(drink)}
                            </ul>
                        </p>
                        <p class="card-text font-weight-bold">Extra information:</p>
                        <p class="card-text">
                            <span class="badge badge-pill badge-success">
                                ${drink.strAlcoholic}
                            </span>
                            <span class="badge badge-pill badge-warning">
                                Category: ${drink.strCategory}
                            </span>
                        </p>

                    </div>

                </div>
            </div>
        `;
    });
    this.isFavorite();
  }

  //Display single recipe
  displaySingleRecipe(recipe) {
    //Get variables
    const modalTitle = document.querySelector(".modal-title"),
      modalDescription = document.querySelector(
        ".modal-body .description-text"
      ),
      modalIngredients = document.querySelector(
        ".modal-body .ingredient-list .list-group"
      );

    //Set the values
    modalTitle.innerHTML = recipe.strDrink;
    modalDescription.innerHTML = recipe.strInstructions;

    //Display the ingredients
    modalIngredients.innerHTML = this.displayIngredients(recipe);
  }

  displayIngredients(drink) {
    let ingredients = [];
    for (let i = 1; i < 16; i++) {
      const ingredientMeasure = {};

      if (
        drink[`strIngredient${i}`] !== null &&
        drink[`strIngredient${i}`] !== ""
      ) {
        ingredientMeasure.ingredient = drink[`strIngredient${i}`];
        if (drink[`strMeasure${i}`] === null) {
          ingredientMeasure.measure = "";
        } else {
          ingredientMeasure.measure = " - " + drink[`strMeasure${i}`];
        }
        ingredients.push(ingredientMeasure);
      }
    }

    //Build the template
    let ingredientsTemplate = "";
    ingredients.forEach((ingredient) => {
      ingredientsTemplate += `
            <li class="list-group-item">${ingredient.ingredient} ${ingredient.measure}</li> 
        `;
    });

    return ingredientsTemplate;
  }

  //Display the cocktails without ingredients
  displayDrinks(drinks) {
    console.log(drinks);
    const resultsWrapper = document.querySelector(".results-wrapper");
    resultsWrapper.style.display = "block";

    //Insert thhe results
    const resultsDiv = document.querySelector("#results");
    drinks.forEach((drink) => {
      resultsDiv.innerHTML += `
            <div class="col-md-6">
                <div class="card my-3">
                    <button type="button" data-id="${drink.idDrink}" class="favorite-btn btn btn-outline-info">
                    +
                    </button>
                    <img class="card-img-top" src="${drink.strDrinkThumb}" alt="${drink.strDrink}">

                    <div class="card-body">
                        <h2 class="card-title text-center">${drink.strDrink}</h2>
                        
                        <a data-target="#recipe" class="btn btn-success get-recipe" href="#" data-toggle="modal" data-id="${drink.idDrink}">Get Recipe</a>
                        
                    </div>

                </div>
            </div>
        `;
    });
    this.isFavorite();
  }

  //Display favorites from storage
  displayFavorites(favorites) {
    const favoritesTable = document.querySelector("#favorites tbody");
    favorites.forEach((drink) => {
      const tr = document.createElement("tr");

      tr.innerHTML += `
        <td>
          <img src="${drink.image}" alt="${drink.name}" width=100>
        </td>
        <td>
          ${drink.name}
        </td>
        <td>
          <a href="#" data-toggle="modal" data-target="#recipe" data-id="${drink.id}" class="btn btn-success get-recipe"> View </a>
        </td>
        <td>
          <a href="#" data-id="${drink.id}" class="btn btn-danger remove-recipe"> Remove </a>
        </td>
      `;

      favoritesTable.appendChild(tr);
    });
  }

  //Display a Custom Message
  printMessage(message, className) {
    const div = document.createElement("div");

    //Add the HTML
    div.innerHTML = `
    <div class="alert alert-dismissible alert-${className}">
        <button type="button" class="close" data-dismiss="alert">x</button>
        ${message}
    </div>
    `;

    //Insert before
    const reference = document.querySelector(".jumbotron h1");
    const parentNode = reference.parentElement;
    parentNode.insertBefore(div, reference);

    //Remove after 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  clearResults() {
    const resultsDiv = document.querySelector("#results");
    resultsDiv.innerHTML = "";
  }

  removeFavorite(element) {
    element.remove();
  }

  //Add a Class when cocktail is favorite
  isFavorite() {
    const drinks = cocktailDB.getFromDB();
    drinks.forEach((drink) => {
      let { id } = drink;
      //Select the favorites
      let favoriteDrink = document.querySelector(`[data-id="${id}"]`);
      if (favoriteDrink) {
        favoriteDrink.classList.add("is-favorite");
        favoriteDrink.textContent = "-";
      }
    });
  }
}
