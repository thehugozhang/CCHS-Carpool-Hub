var config = {
  apiKey: "AIzaSyADnVGr84Qq2qeRz5vc2bZ3MQbjJ6GKSOU",
  authDomain: "cchs-carpool.firebaseapp.com",
  databaseURL: "https://cchs-carpool.firebaseio.com",
  projectId: "cchs-carpool",
  storageBucket: "cchs-carpool.appspot.com",
  messagingSenderId: "136028210350"
};
firebase.initializeApp(config);


function initFirebase(){

  var database = firebase.database(); 
}


function addUser(){
    // gets the field from the form
    var name = document.getElementById('name').value; 
    // console.log(name); 
    var address = document.getElementById('address').value; 
    var town = document.getElementById('town').value; 
    var zipcode = document.getElementById('zipcode').value; 
    var state = document.getElementById('state').value; 
    try{
      if(name == "") throw "Empty name error";
      if(address == "") throw "Empty name error";

      if(town == "") throw "Empty name error";

      if(zipcode == "") throw "Empty name error";

      if(state == "") throw "Empty name error";


      firebase.database().ref('Students/' + name).set({
        "address": address, 
        "town": town, 
        "zipcode": zipcode, 
        "state": state

      });
      console.log("added"); 
    }
    catch(err){
      console.log("error:" + err);
    }

    

  }
  initFirebase(); 

// gets the reference of students 
var studentsRef = firebase.database().ref('Students'); 
    function initMap() {
      var pos = { lat: 0, lng: 0 };
if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            map.setCenter(pos);
          });
        } else {
          // Browser doesn't support Geolocation
        }
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: pos
  });

  var geocoder = new google.maps.Geocoder;
  

    // listener that checks for added children
    studentsRef.on("child_added", function(snapshot) {



      // name
      var key = snapshot.key; 
      // fields 
      var val = snapshot.val(); 

      console.log(key); 
      var address = val["address"] + " " + val["town"] + " " + val["state"] + " " + val["zipcode"];


      geocodeAddress(geocoder, map, address, key);


    });

    

    

    document.getElementById('addaddress').addEventListener('click', function() {
      // var address = document.getElementById('address').value + " " + document.getElementById('town').value + " " + document.getElementById('state').value + " " + document.getElementById('zipcode').value;
      // geocodeAddress(geocoder, map, infowindow, address);
      addUser(); 
    });
  }


  function getStudents(){
    studentsRef.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          // key is the name of the child
          var key = childSnapshot.key;
       
          // val is all the fields stored in a json object 
          // so if you want to get the lat u do val["lat"]
          var val = childSnapshot.val(); 

          var address = val["address"] + " " + val["town"] + " " + val["state"] + " " + val["zipcode"];

          



      });


    });
  }


  function geocodeAddress (geocoder, map, address, name) {
    // console.log(name); 
    // console.log(address); 
    // turns the address into an array, should change later by sending the actual object for better code 
    

    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
          // sets the latlng field on the student with name "name"
          console.log(results[0].geometry.location.lat()); 
          firebase.database().ref('Students/' + name).update({
            "lat": results[0].geometry.location.lat(),
            "long": results[0].geometry.location.lng()

          });
          addMarker(map, results[0].geometry.location, address, name)
          } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });

  }


  function addMarker(map, pos, address, name) {

    var addressArray = address.split(" "); 
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h5 id="firstHeading" class="firstHeading">' + name + '</h5>'+
    '<div id="bodyContent">'+ '<p>' + addressArray[0] + ' ' + addressArray[1] + '  ' + addressArray[2] + '  ' + ',' + '  ' + addressArray[3] + '  ' + addressArray[4] + '  ' + addressArray[5] + '<br/>123-456-7890</p>'
    '</div>'+
    '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
            map: map,
            position: pos
          });
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
        
  }

  //AUTOCOMPLETE SEARCH BAR YEET
  var placeSearch, autocomplete;

  function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
          {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
      }

      function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        console.log(place)
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (addressType == 'street_number') {
            document.getElementById('address').value = place.address_components[i]['long_name'];
          }
          else if (addressType == 'route') {
            document.getElementById('address').value = document.getElementById('address').value + " " + place.address_components[i]['long_name'];
          }
          else if (addressType == 'locality') {
            document.getElementById('town').value = place.address_components[i]['long_name'];

          }
          else if (addressType == 'administrative_area_level_1') {
            document.getElementById('state').value = place.address_components[i]['long_name'];

          }
          else if (addressType == 'postal_code') {
            document.getElementById('zipcode').value = place.address_components[i]['long_name'];

          }
        }

        
      }

      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }

      function initialize() {
       initMap();
       initAutocomplete();
     }
