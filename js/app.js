//Instanciate the classes

const ui = new UI(),
  cocktail = new CocktailAPI(),
  cocktailDB = new CocktailDB();
//Create the event listeners

function eventListeners() {
  //Document ready
  document.addEventListener("DOMContentLoaded", documentReady);

  //Add event listener when form is submitted
  const searchForm = document.querySelector("#search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", getCocktails);
  }

  //The results div listeners
  const resultsDiv = document.querySelector("#results");
  if (resultsDiv) {
    resultsDiv.addEventListener("click", resultsDelegation);
  }
}

eventListeners();

//Get the cocktails function
function getCocktails(e) {
  e.preventDefault();
  const searchTerm = document.querySelector("#search").value;

  //Check something is on te search input

  if (searchTerm === "") {
    //Call ui send message
    ui.printMessage("Please add something into the form", "danger");
  } else {
    //Server response from promise
    let serverResponse;

    //Type of search (ingrdients, cocktails, or name)
    const type = document.querySelector("#type").value;

    //Evaluate the type of method and then execute the query
    switch (type) {
      case "name":
        serverResponse = cocktail.getDrinksByName(searchTerm);
        break;
      case "ingredient":
        serverResponse = cocktail.getDrinksByIngredient(searchTerm);
        break;
      case "category":
        serverResponse = cocktail.getDrinksByCategory(searchTerm);
        break;
      case "alcohol":
        serverResponse = cocktail.getDrinksByAlcohol(searchTerm);
        break;
    }

    ui.clearResults();

    serverResponse.then((cocktails) => {
      if (cocktails.cocktails.drinks === null) {
        ui.printMessage("There are no results, try a different term", "danger");
      } else {
        if (type === "name") {
          //Display with ingredients
          ui.displayDrinksWithIngredients(cocktails.cocktails.drinks);
        } else {
          //Display without Ingredients (category, alcohol, ingredient)
          ui.displayDrinks(cocktails.cocktails.drinks);
        }
      }
    });
  }
  console.log(searchTerm);
}

//Delegation for the #results area
function resultsDelegation(e) {
  e.preventDefault();

  if (e.target.classList.contains("get-recipe")) {
    cocktail.getSingleRecipe(e.target.dataset.id).then((recipe) => {
      //Displays single recipe in a modal

      ui.displaySingleRecipe(recipe.recipe.drinks[0]);
    });
  }

  if (e.target.classList.contains("favorite-btn")) {
    if (e.target.classList.contains("is-favorite")) {
      //Remove the class
      e.target.classList.remove("is-favorite");
      e.target.textContent = "+";
      //Remove from the storage
      cocktailDB.removeFromDB(e.target.dataset.id);
    } else {
      e.target.classList.add("is-favorite");
      e.target.textContent = "-";

      //Get info
      const cardBody = e.target.parentElement;

      const drinkInfo = {
        id: e.target.dataset.id,
        name: cardBody.querySelector(".card-title").textContent,
        image: cardBody.querySelector(".card-img-top").src,
      };
      console.log(drinkInfo);

      //Add to the storage
      cocktailDB.saveIntoDB(drinkInfo);
    }
  }
}

function documentReady() {
  //Display on load that favorites from storage
  ui.isFavorite();

  //Select the search category select
  const searchCategory = document.querySelector(".search-category");
  if (searchCategory) {
    ui.displayCategories();
  }

  //When favorites page
  const favoritesTable = document.querySelector("#favorites");
  if (favoritesTable) {
    //Get the favorites from
    const drinks = cocktailDB.getFromDB();
    ui.displayFavorites(drinks);

    //When view or delete are clicked

    favoritesTable.addEventListener("click", (e) => {
      e.preventDefault();

      //Delegation
      if (e.target.classList.contains("get-recipe")) {
        cocktail.getSingleRecipe(e.target.dataset.id).then((recipe) => {
          //Displays single recipe into a modal
          ui.displaySingleRecipe(recipe.recipe.drinks[0]);
        });
      }
      //When remove button is clicked
      if (e.target.classList.contains("remove-recipe")) {
        cocktail.getSingleRecipe(e.target.dataset.id).then((recipe) => {
          //Remove from dom
          ui.removeFavorite(e.target.parentElement.parentElement);
          //Remove from the LS
          cocktailDB.removeFromDB(e.target.dataset.id);
        });
      }
    });
  }
}
