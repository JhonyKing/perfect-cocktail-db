//Instanciate the classes

const ui = new UI(),
  cocktail = new CocktailAPI();
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
}

function documentReady() {
  //Select the search category select
  const searchCategory = document.querySelector(".search-category");
  if (searchCategory) {
    ui.displayCategories();
  }
}
