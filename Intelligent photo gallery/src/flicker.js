import $ from "jquery";

/// Global declarations ////
const API_KEY = "dc140afe3fd3a251c2fdf9dcd835be5c";
let getSizeReq = "https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key="+API_KEY+"&photo_id=";
let searchReq = "https://www.flickr.com/services/rest/?method=flickr.photos.search&per_page=40&safe_search=1&format=json&nojsoncallback=1&api_key="+API_KEY+"&text=";
let interestingReq = "https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&per_page=40&safe_search=1&format=json&nojsoncallback=1&api_key="+API_KEY;
let recentReq = "https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=10&format=json&nojsoncallback=1&api_key="+API_KEY;
let urls= [interestingReq,recentReq]; // an array of URLs to fetch
let fetchPromises = urls.map(url => fetch(url)); // creates an array of promises
let photos = [];
let nRequest = 0;
let nReceived = 0;
let readyForCB;



export function flickerCB_handler(func){
    readyForCB = func;
}

////////////////////Function to fetch photo from interesting request////////////////
export function fetchPhoto(){
    // $.get(interestingReq, function(data){
    //     nRequest = data.photos.photo.length;
    //     for (let i=0; i < data.photos.photo.length; i++){
    //         let photoFetched = {"id": data.photos.photo[i].id, "title": data.photos.photo[i].title};
    //         photos.push(photoFetched);
    //         getSizes(photoFetched);
    //     }
    // });

    // fetch(interestingReq).then(response => {
    //     return response.json();
    // }).then(data => {
    //     nRequest = data.photos.photo.length;
    //     for (let i=0; i < data.photos.photo.length; i++){
    //         let photoFetched = {"id": data.photos.photo[i].id, "title": data.photos.photo[i].title};
    //         photos.push(photoFetched);
    //         getSizes(photoFetched);
    //     }
    // });

    Promise.all(fetchPromises).then(responses => { // we get an array of response objects
        return Promise.all(responses.map(resp => resp.json())); // need another round of Promise.all()
    }).then (jsons => { // to decode the json response.
        let data = jsons;
        nRequest = data[0].photos.photo.length;
        for (let i=0; i < data[0].photos.photo.length; i++){
            let photoFetched = {"id": data[0].photos.photo[i].id, "title": data[0].photos.photo[i].title};
            photos.push(photoFetched);
            getSizes(photoFetched);
        }
    });
}

//////////////////Function to fetch photo requested by user//////////////////
export function fetch_search(reqTitle){
    let search = searchReq+reqTitle;
    // $.get(search, function(data){
    //     nRequest = data.photos.photo.length;
    //     for (let i=0; i < data.photos.photo.length; i++){
    //         let photoFetched = {"id": data.photos.photo[i].id, "title": data.photos.photo[i].title};
    //         photos.push(photoFetched);
    //         getSizes(photoFetched);
    //     }
    // });

    fetch(search).then(response => {
        return response.json();
    }).then(data => {
        nRequest = data.photos.photo.length;
        for (let i=0; i < data.photos.photo.length; i++){
            let photoFetched = {"id": data.photos.photo[i].id, "title": data.photos.photo[i].title};
            photos.push(photoFetched);
            getSizes(photoFetched);
        }
    });
}

/////////////////////Function to get sizes for the fetched interesting photo//////////////
function getSizes(photoFetched){
    let PhotoSize = getSizeReq+photoFetched.id;
    $.get(PhotoSize, function(data){
        nReceived++;
        photoFetched.file = data.sizes.size[4].source;  //small size photo for main thumbnail
        photoFetched.full = data.sizes.size[data.sizes.size.length-1].source; //Large size photo for full size view
        if(nRequest == nReceived){
            console.log("in the CB");
            readyForCB(photos);
            /////Global variables are resetted so that opening a different category doesn't contain previous category photos
            photos = [];
            nRequest = 0;
            nReceived = 0;
        }
    });
}