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
  			lastState   = "last",

  			//determine when to output new country
  			lastCountry = "last";

  	for(var i = 0; i < data.length; i++)
  	{
  		
  	}

  	return htmlText;
  }

});