import $ from "jquery";
import photosTemplate from "./templates/photos.handlebars";


/////////////////Function to display all the fetched photos/////////////////
export function display_photo(data){
    let photos = {photos: data};
    $("#row").html(photosTemplate(photos));
}

/// Display page names retrieved from facebook model to the tag bar
export function addToTag(data){
    let items = {items: data};
    $(".scrollmenu").append(photosTemplate(items)); // Appends to the div
}