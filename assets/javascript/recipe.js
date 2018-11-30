
$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const drinkId = urlParams.get('id');

    var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        drink = response.drinks[0];
        displayRecipe(drink);
    });

});

function getIngredientsArray(drink) {
    var ingridients = [];
    for (var i = 1; i < 16; i++) {
        var ingredientKey = "strIngredient" + i;
        var ingredientValue = drink[ingredientKey];

        var measureKey = "strMeasure" + i;
        var measureValue = drink[measureKey];

        if (
            (ingredientValue != null) &&
            (ingredientValue.trim() !== "") &&
            (measureValue != null) &&
            (measureValue.trim() !== "")
        ) {
            ingridients.push(
                {
                    ingredient: ingredientValue,
                    measure: measureValue
                }
            );
        }

    }

    return ingridients;
}

function displayRecipe(drink) {
    console.log(drink);

    var cocktailDiv = $("<div class='cocktailRecipe'>");
    var p = $("<p>").append(`<h4>${drink.strDrink}</h4>`);
    var imageUrl = drink.strDrinkThumb;
    var cocktailImage = $("<img class='bigImage'>");
    cocktailImage.attr("src", imageUrl);
    cocktailDiv.append(p);
    cocktailDiv.append(cocktailImage);

    var instruction = drink.strInstructions;
    var ingridients = getIngredientsArray(drink);

    var ingridientsHtml = $("<div>");
    ingridientsHtml.append($("<p>").append("<h4>Ingredients:</h4>"));
    ingridients.forEach(function (item, index) {
        var p = $("<p>").text(`${item.ingredient}: ${item.measure}`);
        ingridientsHtml.append(p);
    });

    cocktailDiv.append(ingridientsHtml);

    cocktailDiv.append($("<p>").append("<h4>Instruction:</h4>"));
    cocktailDiv.append($("<p>").text(instruction));

    console.log(ingridients);

    $("#cocktailRecipe").append(cocktailDiv);
}