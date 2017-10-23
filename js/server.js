const https = require("https"); 
var firebase = require('firebase'); 

var config = {
  apiKey: "AIzaSyADnVGr84Qq2qeRz5vc2bZ3MQbjJ6GKSOU",
  authDomain: "cchs-carpool.firebaseapp.com",
  databaseURL: "https://cchs-carpool.firebaseio.com",
  projectId: "cchs-carpool",
  storageBucket: "cchs-carpool.appspot.com",
  messagingSenderId: "136028210350"
};
firebase.initializeApp(config);

const url = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBDNGE0_gOFq0YbFjSB9OxtdwBcHSRm5_s"

var name = "Cali";
firebase.database().ref('Students/' + name).set({
    address: "1600 Amphitheatre Parkway",
    town: "Mountain View", 
    state: "CA", 
    zipcode: "94043"
});

https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log(
      `City: ${body.results[0].formatted_address} -`,
      `Latitude: ${body.results[0].geometry.location.lat} -`,
      `Longitude: ${body.results[0].geometry.location.lng}`
    );
  });
});
