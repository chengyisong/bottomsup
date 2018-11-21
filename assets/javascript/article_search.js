/*
  -------------------------------------------------------------------------
  == BottomsUp ==
  * Search articles related to drinks, cocktails, etc. using free, public
    API on other web sites.
  * The current prototype version uses NYTimes API that likely need
    further improvements on the search results, potentially utilizing
    other API's.
  -------------------------------------------------------------------------
*/



//
// Search using free, public API
//
// * currently customized to use NYTimes.
//   * The Article Search API returns a max of 10 results at a time.
//
class APISearch {
  constructor() {
    this.apiURL = "https://api.nytimes.com/svc/search/v2/"
    this.apiType = "articlesearch.json";    // API search category/type
    this.apiKey = '5260dec6c5a34dab92a984130fa8b6d6';  // For NYT (for now)
    this.offset = 0;      // an page offset value for query items
  }

  //
  // Search and retrieve articles from the API
  //
  // PARAMS:
  // 1. searchTerm = search query string/keyword
  // 2. callbackFunc = a function to take
  //
  // RETURN:
  // * AJAX search result, IF the call was successful
  // * throw an error, otherwise
  //
  getArticles(searchTerm) {
    let queryURL = this.queryString(searchTerm);
    let queryResult;
  
    console.log('query string: ' + queryURL);

    $.ajax({
      url: this.queryString(item, numImages),
      method: 'GET'
    }).done(function(result) {
      console.log(result);
      queryResult = result;
    }).fail(function(err) {
      throw err;
    });

    return queryResult;
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
  queryString(searchTerm) {
    let stmt = this.apiURL;
    stmt += '?' + $.param({
      'api-key': this.apiKey,
      'q': searchTerm,
      'page': this.offset,
      'sort': "newest",  // hard-coded here for now
    });

    return stmt;
  }
}


//
// Search articles on NYTimes API and display the results
//
class NYTimes extends APISearch {
  constructor() {
    super();
    this.numArticles = 0; // Keeps track of the number of articles
    this.targetID = $('#articlesResult');
  }

  //
  // Show articles 
  //
  showArticles(searchTerm) {
    let result = super.getArticles(searchTerm);

    this.numArticles += result.docs.length;

    
  }
}