/*
  -------------------------------------------------------------------------
  == BottomsUp ==
  * Search articles related to drinks, cocktails, etc. using free, public
    API on other web sites.
  -------------------------------------------------------------------------
*/

//
// Prepare button click event listners
//
$(document).ready(() => {
  const article = new NYTimes();       // NYTimes API
  const web = new GCSE();              // Google custom search engine
  const video = new YTSL();             // YouTube search list

  // Submit button click event
  $('#submit-button').click(event => {
    event.preventDefault();
    const searchInput = new SearchInput();
    searchRecipes(searchInput.cocktail.toLowerCase(), searchInput.ingredient.toLowerCase());
    article.searchArticles(searchInput.getSearchTerms());
  });

  // "Article" tab button click event
  $('#tab-articles').click(event => {
    event.preventDefault();
    article.searchArticles(new SearchInput().getSearchTerms());
  });

  // "Web" tab button click event
  $('#tab-web').click(event => {
    event.preventDefault();
    web.searchArticles(new SearchInput().getSearchTerms());
  });

  // "Video" tab button click event
  $('#tab-video').click(event => {
    event.preventDefault();
    video.searchArticles(new SearchInput().getSearchTerms());
  });
});

function hasIngredient(drink, ingredient) {
  for (var i = 1; i < 16; i++) {
    var key = "strIngredient" + i;
    var value = drink[key];

    if ((value != null) && (value.trim().toLowerCase() === ingredient) ) {
      return true;
    }
  }

  return false;
}

function filterByIngredient(drinks, ingredient, callback) {
  for (var i = 0; i < drinks.length; i++) {
    var drink = drinks[i];

    if ( (ingredient === "") || (hasIngredient(drink, ingredient)) ) {
      callback(drink);
    }
  }
}

function searchByCocktailName(cocktailName, ingredient, callback) {
  var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktailName;

  $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response){
      var drinks = response.drinks;
      filterByIngredient(drinks, ingredient, callback);
    });
}

function getDrinkById(drinkId, callback) {
  var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkId;

  $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response){
      drink = response.drinks[0];
      callback(drink);
    });
}

function searchByIngredient(ingredient, callback) {
  var queryURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient;

  $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response){
      var drinks = response.drinks;

      for (var i = 0; i < drinks.length; i++) {
        getDrinkById(drinks[i].idDrink, callback);
      }
    });
}

function displayRecipe(drink) {
  console.log("drink: ", drink.strDrink);
  console.log("image url: ", drink.strDrinkThumb);

  var cocktailDiv = $("<div class='cocktailDiv'>");
  var p = $("<p>").text(drink.strDrink);
  var imageUrl = drink.strDrinkThumb;
  var href = $("<a>");
  href.attr("href", "recipePage.html?id="+drink.idDrink);
  var cocktailImage = $("<img class='thumbNail'>");
  cocktailImage.attr("src", imageUrl);
  href.append(cocktailImage)
  cocktailDiv.append(p);
  cocktailDiv.append(href);

  $("#searchResults").append(cocktailDiv);
}

function searchRecipes(cocktailName, ingredient) {
  console.log("cocktail name: " + cocktailName);

  if (cocktailName !== "") {
    searchByCocktailName(cocktailName, ingredient, displayRecipe);
  } else if (ingredient !== "") {
    searchByIngredient(ingredient, displayRecipe);
  }
}

//
// Cocktail and Ingredient search input texts
// Validate and construct a search string
//
class SearchInput {
  constructor() {
    this.cocktail = $('#cocktail-name-input').val().trim();
    this.ingredient = $('#ingredient-input').val().trim();
  }
  
  //
  // Validate input text string for search by cocktail name
  //
  validateCocktailName() {
    const result = this.validate(this.cocktail);

    if (result === false) {
      window.status = 'Check "cocktail" name';
    }

    return result;
  }

  //
  // Validate input text string for search by ingredient
  //
  validateIngredientName() {
    const result = this.validate(this.ingredient);

    if (result === false) {
      window.status ='Check "ingredient" name';
    }

    return result;
  }

  //
  // Validate input text string for search
  // TO-DO: only simple validation so far, need to elaborate more?
  //
  // RETURN:
  // * true, if the inputText has been validated
  // * false, otherwise
  //
  validate(inputText) {
    let input = inputText.trim();

    // the input text is blank
    if (input.length === 0) {
      return undefined;
    }

    // the input text does NOT contain at least
    // 1+ alpha-numeric characters
    if (/^[\W_]*$/.test(input)) {
      return false;
    }

    return true;
  }

  //
  // Construct a string of search term(s)
  //
  // RETURN:
  // * Multiple terms/words, if any, are concatenated by white space
  // * null, IF input validation has failed
  //
  searchTerms() {
    console.log(`cocktail text input is "${this.cocktail}"`);
    console.log(`ingredient text input is "${this.ingredient}"`);

    if (this.validateCocktailName() === false) {
      return null;
    }
    if (this.validateIngredientName() === false) {
      return null;
    }

    return (this.cocktail + " " + this.ingredient).trim();
  }

  //
  // Validate search strings
  //
  // RETURN:
  // * IF validated, search terms string possibly split by white space(s)
  // * ELSE undefined
  //
  // TO-DO: Pop-up (not alert) or pop-over warning for user
  //
  getSearchTerms() {
    const searchTerms = this.searchTerms();

    if (!searchTerms) {
      console.log("Invalid search term");
      return;
    }
    console.log("Search for " + searchTerms);

    return searchTerms;
  }
}

//
// Abstract class for search using free, public API
//
class APISearch {
  constructor() {
    this.url = undefined;   // API url 
    this.endPt = undefined; // API endpoint name
  }

  //
  // Search and retrieve articles from the API
  //
  // PARAMS:
  // 1. searchTerm = search query string/keyword
  // 2. callbackFunc = a function to take
  // 3. params = parameters for the query
  //
  getArticles(searchTerm, callbackFunc, params) {
    const queryURL = this.queryString(searchTerm, params);

    console.log('query string: ' + queryURL);
  
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (result) {
      callbackFunc(result);
    }).fail(function (err) {
      throw err;
    });
  }


  //
  // Construct a search query string
  //
  // PARAM:
  // * searchTerm = search query string/keyword
  //
  // RETURN:
  // * a concatenated url query string
  //
  queryString(searchTerm, params) {
    console.log("in queryString, searchTerm is " + searchTerm);
    let stmt = this.url + '/' + this.endPt;
    let parameters = Object.assign({
      'q': searchTerm,
    }, params);

    return stmt += '?' + $.param(parameters);
  }
}

//
// Search articles on NYTimes API and display the results
//
class NYTimes extends APISearch {
  constructor() {
    super();
    this.url = "https://api.nytimes.com/svc/search/v2";
    this.endPt = "articlesearch.json";
    this.numItems = 0;      // # of search result items
  }

  //
  // Set up NYTimes specific query parameters.
  //
  // Need a heavy "filter query"(fq) setting in order to get reasonable
  // results for (non-)alcoholic drinks. However, this also back-fires
  // for not-so-popular cocktails and ingredients.
  // https://github.com/NYTimes/public_api_specs/blob/master/article_search/article_search_v2.md
  //
  queryParams(searchTerm) {
    const params = {
      'fq': `(snippet:("${searchTerm}") OR headline:("${searchTerm}") OR abstract:("${searchTerm}")) AND
       news_desk:("Arts & Leisure" "Business" "Culture" "Dining" "Fashion & Style" "Food" "Favorites" "Style" "Society" "Weekend")
       AND section_name:("Dining & Wine" "Dining and Wine" "Food" "Style")`,
      'page': this.offset,
      'sort': "newest", 
      'api-key': '5260dec6c5a34dab92a984130fa8b6d6',
    }

    return params;
  }

  //
  // Search articles through jQuery.AJAX call
  //
  // PARAMS:
  // * searchTerm = search terms string
  // * clear = IF true, clear the selector contents before populating
  // *         ELSE, append found articles to the target selector
  //
  searchArticles(searchTerm, clear = true) {
    if (searchTerm.length === 0 || /^[\W_]*$/.test(searchTerm)) {
      return;
    }

    if (clear) {
      $('#articlesResult').text("");
      $('#articlesResult').prepend(`<h2>Articles about "${searchTerm}"</h2><br>`);
    }

    super.getArticles(searchTerm, this.showArticles, this.queryParams(searchTerm));
  }

  //
  // Show articles -- this is a callback function passed to getArticles
  //
  showArticles(result) {
    const docs = result.response.docs;
    let numItems = 0;

    if (docs.length === 0) {
      $('#articlesResult').html('<h5>No matching result found</h5>');
      return;
    }

    // console.log('JSON: ' + JSON.stringify(docs));
    docs.forEach(item => {
      const div = $('<div>');
      const h5 = $('<h5>');
      const h5Link = $('<a>');
      const link = $('<a>');
      const p = $('<p>');
      const br = $('<br>');

      h5Link.attr('href', item.web_url);
      h5Link.attr('style', "color: #3355dd;")
      h5Link.text(item.headline.main);
      h5.append(h5Link);
      link.attr('href', item.web_url);
      link.text(item.web_url);
      link.attr('style', "color: lightslategray;");
      p.text(item.snippet);

      if (numItems % 2 === 0) {
        div.attr('style', 'background-color: #F7FFFA;');
      }

      div.append(h5).append(link).append(p).append(br);
      $('#articlesResult').append(div);
      numItems++;
    });
  }
}

//
// Search articles using Google Custom Search Engine
//
class GCSE extends APISearch {
  constructor() {
    super();
    this.url = "https://www.googleapis.com";
    this.endPt = "customsearch/v1";
    this.numArticles = 0; // Keeps track of the number of articles
  }

  queryParams() {
    const params = {
      // extra keywords to facilitate a better query results
      'hq': ['cocktail', 'news', 'article'].join('+'),
      // save search option: "active" OR "off"
      'safe': 'active',
      // custom search engine identifier
      'cx': decodeURIComponent('013726863933950087168%3A0bb4-rj_v_0'),
      // api key
      'key': 'AIzaSyDL4ZpojkavjkSy-vXsQnUocH2eE1i5f1k',
    }

    return params;
  }

  searchArticles(searchTerm, clear = true) {
    if (searchTerm.length === 0 || /^[\W_]*$/.test(searchTerm)) {
      return;
    }
    if (clear) {
      $('#articlesResult').text("");
      $('#articlesResult').prepend(`<h2>Search result for "${searchTerm}"</h2><br>`);
    }
    super.getArticles(searchTerm, this.showArticles, this.queryParams());
  }

  //
  // Show articles -- this is a callback function passed to super.getArticles
  //
  showArticles(result) {
    const items = result.items;
    let numItems = 0;

    // console.log('JSON: ' + JSON.stringify(items));
    items.forEach(item => {
      const div = $('<div>');
      const h5 = $('<h5>');
      const h5Link = $('<a>');
      const link = $('<a>');
      const p = $('<p>');
      const br = $('<br>');
      let img = null;

      h5Link.attr('href', item.link);
      h5Link.attr('style', "color: #3355dd;")
      h5Link.text(item.title);
      h5.append(h5Link);
      link.attr('href', item.link);
      link.text(item.link);
      link.attr('style', "color: lightslategray;");
      p.text(item.snippet);

      if ("cse_thumbnail" in item.pagemap) {
        img = $('<img>');
        img.attr('src', item.pagemap.cse_thumbnail[0].src);
        img.attr('alt', 'missing image');
        // img.attr('style', "float: right;")
        img.addClass("img-fluid rounded float-right");
      }

      if (numItems % 2 === 0) {
        div.attr('style', 'background-color: #F7FFFA;');
      }
      div.append(h5).append(link).append(p);
      if (img) {
        div.append(img);
      }
      div.append(br);
      $('#articlesResult').append(div);
      numItems++;
    });
  }
}

//
// Search videos using youtube search list
//
class YTSL extends APISearch {
  constructor() {
    super();
    this.url = "https://www.googleapis.com";
    this.endPt = "youtube/v3/search";
    this.numArticles = 0; // Keeps track of the number of articles
  }

  queryParams() {
    const params = {
      // search resource properties that the API response will include.
      'part': 'snippet',
      // extra keywords to facilitate a better query results
      'hq': ['cocktail', 'news', 'article'].join('+'),
      // save search option: "active" OR "off"
      'safe': 'active',
      // custom search engine identifier
      'cx': decodeURIComponent('013726863933950087168%3A0bb4-rj_v_0'),
      // api key
      'key': 'AIzaSyDL4ZpojkavjkSy-vXsQnUocH2eE1i5f1k',
    }

    return params;
  }

  searchArticles(searchTerm, clear = true) {
    if (searchTerm.length === 0 || /^[\W_]*$/.test(searchTerm)) {
      return;
    }
    if (clear) {
      $('#articlesResult').text("");
      $('#articlesResult').prepend(`<h2>Search result for "${searchTerm}"</h2><br>`);
    }
    super.getArticles(searchTerm, this.showArticles, this.queryParams());
  }

  //
  // Show articles -- this is a callback function passed to super.getArticles
  //
  showArticles(result) {
    const items = result.items;
    let numItems = 0;

    // console.log('JSON: ' + JSON.stringify(items));
    items.forEach(item => {
      const div = $('<div>');
      const p = $('<p>');
      const iframe = $('<iframe>');
      const videoId = item.id.videoId;

      iframe.attr('src', `https://www.youtube.com/embed/${videoId}`);
      iframe.attr('width', 450);
      iframe.attr('height', 350);
      p.text(item.snippet.title);
      div.append(iframe).append(p);
      div.attr('style', 'float: left;'); // would this work?
      $('#articlesResult').append(div);
      numItems++;
    });
  }
}