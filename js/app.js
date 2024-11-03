//Instanciate the classes

const ui = new UI();
//Create the event listeners

function eventListeners() {
  const searchForm = document.querySelector("#search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", getCocktails);
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
  }
  console.log(searchTerm);
}
