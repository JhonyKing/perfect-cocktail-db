class CocktailDB {
  saveIntoDB(drink) {
    const drinks = this.getFromDB();

    drinks.push(drink);

    //Add the new array into the localstorage
    localStorage.setItem("drinks", JSON.stringify(drinks));
  }

  getFromDB() {
    let drinks;

    //Check for localstorage

    if (localStorage.getItem("drinks") === null) {
      drinks = [];
    } else {
      drinks = JSON.parse(localStorage.getItem("drinks"));
    }
    return drinks;
  }
}
