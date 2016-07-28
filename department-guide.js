$(function(){
  
  var state = [
    "美洲",
    "亞洲"
  ];

  //get data
  $.getJSON('data.json', function(response){

    //render html to #guide
    renderGuide(response);
  });

  /**
   * render html to #guide
   * @param { array } data - array of school objects
   */
  function renderGuide(data)
  {
    //order data with data[i].state, data[i].country
    data = orderData(data);

    //generate html text
    //yet implemented
    var htmlText = generateHtml(data);

    //render text
    $('#guide').html(htmlText);
    
    //implement click event
    $(document).ready(function() {
      var x;
      $("input").click(function() {
        if ($(this).attr("id") == x) {
          this.checked = false;
          x = 0;
        } else {
          x = $(this).attr("id");
        }
        $(".school-label label").removeClass("focus-label");
        $(".school-label label[for='" + $("input:checked").attr("id") + "']").addClass("focus-label");
      });
    });
  }

  /**
   * order data with data[i].state, data[i].country
   * @param  { array } data - array of school objects
   * @return { array } data
   */
  function orderData(data)
  {
    //sort by state
    data = data.sort(function(a, b){
      return a.state - b.state;
    });

        //array of arrays for part
    var filtered = [],

        //arrays of same state
        part     = [],

        //determine when state changes
        last     = 0;

    //break same state into arrays
    part.push(data[0]);
    for(var i = 1; i < data.length; i++)
    {
      if(data[i].state != last)
      {
        filtered.push(part);
        part = [];
        last = data[i].state;
      }

      part.push(data[i]);

      if(i == data.length - 1)
        filtered.push(part);
    }

    //sort each array by country
    for(var i = 0; i < filtered.length; i++)
    {
      filtered[i] = filtered[i].sort(function(a, b){
        return a.country.localeCompare(b.country);
      });
    }

    //merge the arrays
    data = [];
    for(var i = 0; i < filtered.length; i++)
      for(var k = 0; k < filtered[i].length; k++)
        data.push(filtered[i][k]);

    return data;
  }
  
  /**
   * generate html
   * @param  { array } data - array of school objects
   * @return { string } htmlText
   */
  function generateHtml(data)
  {
    var htmlText    = "",

        //count to determine when to break a new line
        count       = 0,

        //determine when to output new state
        lastState   = -1,

        //determine when to output new country
        lastCountry = "last",

        //data cache(five record each time)
        cache       = [];

    for(var i = 0; i < data.length; i++)
    {
      //add explore div
      if(data[i].country != lastCountry)
        htmlText += "<div class='explore'>";

      //title if state change
      if(data[i].state != lastState)
      {
        htmlText += "<span class='explore-title'>";
        htmlText += state[data[i].state];
        htmlText += "</span>";

        lastState = data[i].state;
      }

      //add sub-title if country change
      if(data[i].country != lastCountry)
      {
        htmlText += "<h4>" + data[i].country + "</h4>";

        lastCountry = data[i].country;
      }

      //add content if
      //1. change sub-title
      //2. cache.length == 5
      count ++;
      cache.push(data[i]);

      if(count == 5 || i == data.length -1 || data[i + 1].country != data[i].country)
      {
        //output
        htmlText += createContent(cache);
        
        //reset cache and count
        count = 0;
        cache = [];
      }

      //close tag for explore div
      if(i == data.length - 1 || data[i].country != data[i + 1].country)
        htmlText += "</div>";
    }

    return htmlText;
  }

  /**
   * create content for explore div
   * @param  { array } data - one row of data(max to five)
   * @return { string } htmlText
   */
  function createContent(data)
  {
    var htmlText = "";
    
    //school labels
    htmlText += "<div class='school-label'>";
    for(var i = 0; i < data.length; i++)
    {
      htmlText += "<label for='" + data[i].term + "' style='cursor:pointer;'>";
      htmlText += data[i].name;
      htmlText += "</label>";
    }
    htmlText += "</div>";

    //contents
    for(var i = 0; i < data.length; i++)
    {
      htmlText += "<input class='invisible toggle' id='";
      htmlText += data[i].term;
      htmlText += "' name='schools' type='radio'>";

      htmlText += "<div class='toggle-content'>";
      htmlText +=   "<label class='close-content' for='";
      htmlText +=   data[i].term;
      htmlText +=   "'>x</label>";
      htmlText +=   "<a href='" + data[i].url + "'>全部科系列表</a>";

      for(var k = 0; k < data[i].colleges.length; k++)
      {
        var college = data[i].colleges[k];
        htmlText += "<div>" + college.name + "</div>";

        for(var j = 0; j < college.departments.length; j++)
        {
          var department = college.departments[j];
          htmlText += "<a href='" + department.url + "'>";
          htmlText += department.name;
          htmlText += "</a>";
        }

        htmlText += "<br><br>";
      }

      htmlText += "</div>";
    }

    return htmlText;
  }
});
