/* Initially used to get variable data from URL
 * source: http://www.tek-tips.com/faqs.cfm?fid=5442  */
function getFromURL(varname)
{
  // First, we load the URL into a variable
  var url = window.location.href;

  // Next, split the url by the ?
  var qparts = url.split("?");

  // Check that there is a querystring, return "" if not
  if (qparts.length == 0)
  {
    return "";
  }

  // Then find the querystring, everything after the ?
  var query = qparts[1];

  // Split the query string into variables (separates by &s)
  var vars = query.split("&");

  // Initialize the value with "" as default
  var value = "";

  // Iterate through vars, checking each one for varname
  for (i=0;i<vars.length;i++)
  {
    // Split the variable by =, which splits name and value
    var parts = vars[i].split("=");

    // Check if the correct variable
    if (parts[0] == varname)
    {
      // Load value into variable
      value = parts[1];

      // End the loop
      break;
    }
  }

  // Convert escape code
  value = unescape(value);

  // Convert "+"s to " "s
  value.replace(/\+/g," ");

  // Return the value
  return value;
}

/* From Learing WebGL's Cookbook. Allows an include function like in php
 * Source: http://learningwebgl.com/cookbook/index.php/Useful_include_function */
function include(url){
  var element;
  switch(url.split(".").pop()){
    case "css":{
      element=document.createElement("link");
      element.setAttribute("rel","stylesheet");
      element.setAttribute("type","text/css")
      element.setAttribute("href",url)
    }break;
    case "js":{
      element=document.createElement("script");
      element.setAttribute("language","javascript")
      element.setAttribute("src",url)
    }break;
    default:window.console && window.console.error("could not identify",url,"skip include");return;
  }
  var head=document.querySelector("head");
  if(head.innerHTML.indexOf(element.outerHTML)!=-1){
    window.console && window.console.warn("Duplicate include, skipping:",url);
  }else{
    head.appendChild(element);
  }
}

function sleep(milliSeconds){
var startTime = new Date().getTime(); // get the current time
while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}