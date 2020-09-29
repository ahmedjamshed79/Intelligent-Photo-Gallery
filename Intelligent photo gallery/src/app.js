import $ from "jquery";
import styles from "./css/styles.css";
import * as view from "./view.js";
import * as flicker from "./flicker.js";
import * as facebook from "./facebook.js";

//Global declarations//


///////////////////////////////////////Javascript start////////////////////////////////////
$(document).ready(function(){ 
    //// Passing function to models to get data back to app.js ////
    flicker.flickerCB_handler(flickerReady);
    facebook.fbCB_handler(fb_ready);

    // initializing Facebook SDK
    facebook.init_facebookSDK();

    /// search and display interesting photos ///
    flicker.fetchPhoto(); 

    ///////////////////// Event Handlers ////////////////////////////////
    /////Click handler for navigation items under categories////
    $(".scrollmenu .items").each(function(index){
        $(this).click(function(){
            let val = $(this).attr("val");   //values for attribute species embedded in HTML
            flicker.fetch_search(val);       //call fetch_search() to fetch photos related to that value or keyword
        });
    });

    $(".scrollmenu #fb_Tag").each(function(index){
        $(this).click(function(){
            let val = $(this).attr("val");   //values for attribute species embedded in HTML
            flicker.fetch_search(val);       //call fetch_search() to fetch photos related to that value or keyword
        });
    });

    $(".topnav .search-container button").click(search_btn_handler);  //Handles user click on search button
    /// Handle Enter Keypress after typing in search bar ///
    $(".topnav .search-container input").keypress(function(event) {
        if (event.keyCode === 13) { 
            event.preventDefault();
            $(".topnav .search-container button").click(); 
        } 
    }); 

    /////Closing full size image with close button/////
    $('#modal-close').click(function(){
        $("#modal-container").css("display","none");
        $("#modal-content").attr("src", "");
    });
    /////Closing full size image when click on the container(Outside the image in modal) /////
    var modal = document.getElementById('modal-container');
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

////////////////////////////////////// Facebook API ////////////////////////
/// Function to run when user is logged in ///
window.loggedin = function(){
    FB.api('/me', function(response) {
        console.log(response); 
        console.log("hurreeyyy you are logged in");
        facebook.getLikes();
    });
}

/// Receive data from facebook model and send to view to add to the tag bar
function fb_ready(data){
    view.addToTag(data);
    registerClickevent();
}

function registerClickevent(){
    $(".scrollmenu #fb_Tag").each(function(index){
        $(this).click(function(){
            let val = $(this).attr("val");   //values for attribute species embedded in HTML
            flicker.fetch_search(val);       //call fetch_search() to fetch photos related to that value or keyword
        });
    });
}

////////////////////////////////////// Facebook API ////////////////////////
function flickerReady(photos){
    view.display_photo(photos);
    modalRegister();
}

////////////////////////// Modal code /////////////////////////////////////
function modalRegister(){
    ///////Displaying full size image/////////////
    $("#row figure").each(function(index){
        $(this).click(function(){
            $("#modal-container").css("display","block");
            $("#modal-content").attr('src', $(this).attr("data-full"));
            $("#modal-caption").html($(this).attr("data-caption"));
        });
    });
}

//////////////////////Function to handle search button click///////////////////
function search_btn_handler(){
    let userIn = $(".topnav input").val();
    if (userIn != ""){
        flicker.fetch_search(userIn);
    } 
}