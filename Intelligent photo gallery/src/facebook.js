import $ from "jquery";

/// Global Declaration ///
let readyForCB;
const APP_ID = "240977783894894";


export function fbCB_handler(func){
  readyForCB = func;
}

///// Initialize Facebook SDK /////////////
export function init_facebookSDK(){
    $.ajaxSetup({ cache: true });
    $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
      FB.init({
        appId: APP_ID,
        version: 'v6.0', // or v2.1, v2.2, v2.3, ...
        xfbml: 1,
      });     
      FB.getLoginStatus(updateStatusCallback);
    });
}

////////// Function to get user likes //////////////
export function getLikes(){
  FB.api('me?fields=id,name,likes.limit(10)', function(response) {;
    let likesarr = seperateLikes(response);
    readyForCB(likesarr);
  });
}


/// This function seperate Page names from the likes array of JSON data retrieved from facebook ////
function seperateLikes(response){
  let likesarr = [];
  for (let i=0; i < response.likes.data.length; i++){
    likesarr.push(response.likes.data[i].name);
  }
  return likesarr;
}


////////////////////////////////////////////////////////////////////////////////
function updateStatusCallback(response){
    if (response.status === 'connected') {
        // The user is logged in and has authenticated your
        // app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed
        // request, and the time the access token 
        // and signed request each expire.
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        console.log("connected");
        getLikes();
      } else if (response.status === 'not_authorized') {
        // The user hasn't authorized your application.  They
        // must click the Login button, or you must call FB.login
        // in response to a user gesture, to launch a login dialog.
        console.log("not authorized");
      } else {
        // The user isn't logged in to Facebook. You can launch a
        // login dialog with a user gesture, but the user may have
        // to log in to Facebook before authorizing your application.
        console.log("not logged in");
      }
}