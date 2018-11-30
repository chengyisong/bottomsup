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
  // const article = new NewsAPI();       // News API
  const web = new GCSE();              // Google custom search engine
  const video = new YTSL();            // YouTube search list

  // Submit button click event
  $('#submit-button').click(event => {
    event.preventDefault();
    article.searchArticles(new SearchInput().getSearchTerms());
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
      const errMsg = 'The "cocktail" name appears invalid';
      console.log(errMsg);
      // Pop-up isn't working for unknown reason...
      document.getElementById("cocktail-name-input").setCustomValidity(errMsg);
    }

    return result;
  }

  //
  // Validate input text string for search by ingredient
  //
  validateIngredientName() {
    const result = this.validate(this.ingredient);

    if (result === false) {
      console.log('The "ingredient" appears invalid');
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
// A class for reading text using Web Speech API
//
class ReadText {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.voiceSetting = null;
    this.utter = new SpeechSynthesisUtterance();
  }

  //
  // Collect all available voices
  // getVoices() is very flaky returning nothing ... 
  //
  collectVoices() {
    return this.voices = this.synth.getVoices();
  }

  //
  // Set default voice, pitch, and rate
  // lang: "en-US"
  //
  defaultVoice() {
    this.voiceSetting = { 'id': 1, 'pitch': 1, 'rate': 1, 'volume': 1 };
    let ndx = -1;

    if (this.voices.length === 0) {
      this.collectVoices();
    }
    console.log(`# ofvoices: ${this.voices.length}`);

    // seaerch for the 1st available US English voice
    for (let i = 0; i < this.voices.length; i++) {
      if (/en-US/.test(this.voices[i]['lang'])) {
        ndx = i;
        break;
      }
    }

    if (ndx > -1) {
      this.voiceSetting['id'] = ndx;
      console.log(`ndx: ${ndx}, ${this.voices[ndx]['name']}`);
    } else {
      this.voiceSetting['id'] = 0;
      console.log(`en-US Not found ndx: ${ndx}, ${this.voices[ndx]['name']}`);
    }
    // for debugging, iOS(iphone)
    // got ndx: 14, Aaron, so appears to be set but still no voice...
    // well, as it turned out, it workds now.. this API just seems super flaky
    // alert(`ndx: ${ndx}, ${this.voices[ndx]['name']}`);

    return this.voiceSetting;
  }

  //
  // Read out the "text"
  //
  readOut(text) {
    this.utter.text = text;
    this.defaultVoice();
    this.utter.voice = this.voices[this.voiceSetting['id']];
    // this.collectVoices();
    // this.utter.voice = this.voices[1];
    // this.utter.pitch = 1; // this.voiceSetting['pitch'];
    // this.utter.rate = 1; // this.voiceSetting['rate'];
    this.utter.pitch = this.voiceSetting['pitch'];
    this.utter.rate = this.voiceSetting['rate'];
    this.utter.volume = this.voiceSetting['volume'];

    this.synth.speak(this.utter);
  }

  //
  // Get title and article of the current item and read out
  // See fuctnion showArticles(result) of NYTimes and GCSE classes
  //
  article(event) {
    const self = event.data;

    // --> TO-DO: an idea is to avoid redundant text on the web page
    // const title = $(`${this} h5 a`).text();
    // const text = $(`${this} p`).text();
    // self.readOut(text);

    self.readOut($(this).attr('text'));
  }
}

// Instanciate ReadText to be used by classes
const readText = new ReadText(); 

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
// News API
//
class NewsAPI extends APISearch {
  constructor() {
    super();
    this.url = "https://newsapi.org/v2";
    this.endPt = "everything";
  }

  //
  // Set up News API specific query parameters.
  //
  // With or without newsSources, the query results have been disappointing...
  //
  queryParams(searchTerm) {
    const newsSources = ["associated-press", "buzzfeed", "business-insider",
                          "google-news", "usa-today",
                          "the-new-york-times", "time", "the-huffington-post",
                          "fortune"];

    const params = {
      'sortBy': "relevancy", // "popularity", 
      'sources': newsSources.join(","),
      'apiKey': '432e28734a904d0abe30f89e021f1759',
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
    let boostedTerm = searchTerm;  // for getting a better query result

    if (searchTerm.length === 0 || /^[\W_]*$/.test(searchTerm)) {
      return;
    }

    // revise the search term by adding "cocktail drink" at the end
    if (!/cocktail/.test(searchTerm)) { 
      boostedTerm += ' cocktail';
    }

    if (clear) {
      $('#articlesResult').html(`<div>
        <h2 style="display: inline-block;">Articles about "${searchTerm}"</h2>
        <span style="font-size: 0.8em; float: right">powered by News API</span>
        </div>`);
    }

    super.getArticles(boostedTerm, this.showArticles, this.queryParams(searchTerm));
  }

  //
  // Show articles -- this is a callback function passed to getArticles
  //
  showArticles(result) {
    const docs = result.articles;
    let numItems = 0;

    if (docs.length === 0) {
      $('#articlesResult').html('<h5>No matching result found</h5>');
      return;
    }

    // console.log('JSON: ' + JSON.stringify(docs));
    docs.forEach(item => {
      const div = $('<div>');
      const h5 = $('<h5 class="mb-1">');
      const h5Link = $('<a>');
      const link = $('<a>');
      const p = $('<p class="mb-1">');
      const p2 = $('<p class="mb-1">');
      const br = $('<br>');
      let img = null;

      h5Link.attr('href', item.url).attr('target', '_blank');
      h5Link.attr('style', "color: #3355dd;")
      h5Link.text(item.title);
      h5.append(h5Link);
      link.attr('href', item.url).attr('target', '_blank');
      link.text(item.url);
      link.attr('style', "color: lightslategray; font-size: 0.8em");
      p.text(item.description);
      p2.text(item.publishedAt + " written by " + item.author);
      p2.attr('style', 'font-size: 0.7em');

      if (item.urlToImage) {
        img = $('<img>');
        img.attr('src', item.urlToImage);
        img.attr('alt', 'missing image');
        img.attr('style', 'width: 15vw');
        img.addClass("img-fluid .img-thumbnail rounded float-right");
      }
      div.addClass('w-50 d-inline-block mb-2');

      div.append(h5).append(p).append(link).append(p2);
      $('#articlesResult').append(div).append(img).append(br);
      numItems++;
    });
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
    this.currentTerm = "";  // current serach keyword
  }

  //
  // Set up NYTimes specific query parameters.
  //
  // Need a heavy "filter query"(fq) setting in order to get reasonable
  // results for (non-)alcoholic drinks. However, this also back-fires
  // for not-so-popular cocktails and ingredients w/o getting any results.
  // https://github.com/NYTimes/public_api_specs/blob/master/article_search/article_search_v2.md
  //
  queryParams(searchTerm) {
    const numArticles = this.numOfArticles();
    let pageOffset = (numArticles === 0) ? 0 : Math.floor((numArticles - 1) / 10);

    if (numArticles > pageOffset * 10) {
      pageOffset += 1;
    }
    console.log(`# of articles ${numArticles}, page offset ${pageOffset} `);

    const params = {
      'fq': `(snippet:("${searchTerm}") OR headline:("${searchTerm}") OR ` +
            `abstract:("${searchTerm}")) AND news_desk:("Arts & Leisure" ` +
            `"Business" "Culture" "Dining" "Fashion & Style" "Food" ` +
            `"Favorites" "Style" "Society" "Weekend") AND section_name:(` +
            `"Dining & Wine" "Dining and Wine" "Food" "Style")`,
      'page': pageOffset,
      'sort': "newest", 
      'api-key': '5260dec6c5a34dab92a984130fa8b6d6',
    };

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
  // NOTE: an implementation of fetching more articles is unexpectedly
  //       complicated in this interface having multiple tabs. Because
  //       a user could go back and forth on different tabs while
  //       different search for web and video also populate the same
  //       target section with search results. So, not implemented...
  //
  searchArticles(searchTerm, clear = true) {
    if (!searchTerm || /^(\W|_)*$/.test(searchTerm) || searchTerm.length === 0) {
      return;
    }

    const isNewSearch = (this.currentTerm === searchTerm) ? false : true;

    if (clear || isNewSearch) {
      console.log(`New serach word ${searchTerm} (old: ${this.currentTerm})`);
      $('#articlesResult').text("");
      $('#articlesResult').prepend(`<h2>Articles about "${searchTerm}"</h2><br>`);
      this.currentTerm = searchTerm;
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
      const h5 = $('<h5>').text('No (additional) matching result found');
      $('#articlesResult').append(h5);
      return;
    }

    // console.log('JSON: ' + JSON.stringify(docs));
    docs.forEach(item => {
      const div = $('<div>');
      const h5 = $('<h5>');
      const h5Link = $('<a>');
      const link = $('<a>');
      const button = $('<button>');
      const p = $('<p>');
      const br = $('<br>');

      numItems++;
      div.addClass(`article article-${numItems}`);
      h5Link.attr('href', item.web_url).attr('target', '_blank');
      h5Link.attr('style', "color: #3355dd;")
      h5Link.text(item.headline.main);
      h5.append(h5Link);
      link.attr('href', item.web_url)
      link.attr('target', '_blank')
      link.attr('style', "color: lightslategray;");
      link.text(item.web_url);
      p.text(item.snippet);

      // TO-DO: for now to get a quick access to the text
      button.attr('text', h5Link.text() + '. ' + p.text());
      button.text('read');
      button.addClass('btn btn-outline-success btn-sm ml-3 px-1 py-0');
      button.bind("click", readText, readText.article);

      h5.append(button);
      div.append(h5).append(link).append(p).append(br);
      $('#articlesResult').append(div);
    });
  }

  //
  // Find the current number of articles displayed on the web page
  //
  numOfArticles() {
    const num = $('.article').length;
    console.log("The number of articles: " + num);

    return num;
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
  }

  //
  // Set up serach query option parameters
  //
  queryParams() {
    const params = {
      // extra keywords to facilitate a better query result
      'hq': ['cocktail', 'news', 'article'].join('+'),
      // safe search option: "active" OR "off"
      'safe': 'active',
      // custom search engine identifier
      'cx': decodeURIComponent('013726863933950087168%3A0bb4-rj_v_0'),
      // api key
      'key': 'AIzaSyDL4ZpojkavjkSy-vXsQnUocH2eE1i5f1k',
    }

    return params;
  }

  //
  // Search articles (Google search)
  //
  searchArticles(searchTerm, clear = true) {
    if (!searchTerm || /^(\W|_)*$/.test(searchTerm) || searchTerm.length === 0) {
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
    if ($('.articles-container').length === 0) {
      const container = $('<div>').addClass('container articles-container');
      $('#articlesResult').append(container);
    }

    // console.log('JSON: ' + JSON.stringify(items));
    items.forEach(item => {
      const row = $('<div class="row">');
      const col = $('<div class="col-md-10">');
      const h5 = $('<h5>');
      const h5Link = $('<a>');
      const link = $('<a>');
      const p = $('<p>');
      const br = $('<br>');
      let img = null;

      // Article Title
      h5Link.attr('href', item.link).attr('target', '_blank');
      h5Link.attr('style', "color: #3355dd;")
      h5Link.text(item.title);
      h5.append(h5Link);

      // Hyperlink to the article 
      link.attr('href', item.link).attr('target', '_blank');
      link.text(item.link);
      link.attr('style', "color: lightslategray;");
      p.text(item.snippet);
      col.append(h5).append(link).append(p);
      row.append(col);

      // If thumbnail is availabe, include it.
      if ("cse_thumbnail" in item.pagemap) {
        const imgCol = $('<div class="col-md-2">');

        img = $('<img>');
        img.attr('src', item.pagemap.cse_thumbnail[0].src);
        img.attr('alt', 'missing image');
        img.addClass("img-fluid rounded float-right");

        row.append(imgCol.append(img));
      }

      $('#articlesResult').append(row);
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
  }

  //
  // Set up serach query option parameters
  //
  queryParams() {
    const params = {
      // search resource properties that the API response will include.
      'part': 'snippet',
      // 1 - 50(max) default=5
      'maxResults': 10,
      // safe search option: "none" OR "moderate" OR "strict"
      'safeSearch': 'moderate',
      // type: video,channel,playlist (default)
      'type': 'video',
      // videoEmbeddable: any OR true
      'videoEmbeddable': 'true',
      // restrict a search to only videos that can be played outside youtube.com.
      // Need to set type=video; any OR true
      'videoSyndicated': 'true',
      // Check out videoCategories at the following url and excute the
      // sample javascript
      // https://developers.google.com/youtube/v3/docs/videoCategories/list
      // 26 = Howto & Style
      'videoCategoryId': '26',
      // custom search engine identifier
      'cx': decodeURIComponent('013726863933950087168%3A0bb4-rj_v_0'),
      // api key
      'key': 'AIzaSyDL4ZpojkavjkSy-vXsQnUocH2eE1i5f1k',
    }

    return params;
  }

  //
  // Search articles(youtube videos)
  //
  searchArticles(searchTerm, clear = true) {
    let boostedTerm = searchTerm;  // for getting a better query result

    if (!searchTerm || /^(\W|_)*$/.test(searchTerm) || searchTerm.length === 0) {
      return;
    }

    // revise the search term by adding "drink" at the end
    if (!/drink/.test(searchTerm)) { 
      boostedTerm += ' drink';
    }

    if (clear) {
      $('#articlesResult').text("");
      $('#articlesResult').prepend(`<h2>Search result for "${searchTerm}"</h2><br>`);
    }
    super.getArticles(boostedTerm, this.showArticles, this.queryParams());
  }

  //
  // Show articles -- this is a callback function passed to super.getArticles
  //
  showArticles(result) {
    const items = result.items;

    // console.log('JSON: ' + JSON.stringify(items));
    items.forEach(item => {
      const div = $('<div>');
      const p = $('<p>');
      const iframe = $('<iframe>');
      const videoId = item.id.videoId;

      iframe.attr('src', `https://www.youtube.com/embed/${videoId}`);
      iframe.attr('width', 300).attr('height', 225);
      iframe.addClass("embed-responsive embed-responsive-4by3");
      iframe.attr('allowfullscreen', '')
      p.text(item.snippet.title);
      div.append(iframe).append(p);
      div.addClass("float-md-left m-auto p-2");
      $('#articlesResult').append(div);
    });
  }
}

