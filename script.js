function loader() {
    document.getElementById("register_div").style.display = "none"
    document.getElementById("load").style.display = "block";
    var timeout = setTimeout(entrar, 1000)

}

function entrar() {
    document.getElementById("register_div").style.display = "none";
    document.getElementById("load").style.display = "none";
    document.getElementById("login_div").style.display = "block";
}

function register_user() {
    var email = document.getElementById("register_user_email").value
    var password = document.getElementById("register_user_password").value
    var name = document.getElementById("register_user_name").value
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Erro: " + errorMessage);
    });
}
//update user location on user DB
function upload_user_location(latitude, longitude, heading) {
    var user = firebase.auth().currentUser;
    var firebase_ref = firebase.database().ref('/users').child(user.uid)
    firebase_ref.update({
        lat: latitude,
        lng: longitude,
        heading: heading,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    })
}

//Login 
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        document.getElementById("login_div").style.display = "none"
        document.getElementById("register_div").style.display = "none"
        document.getElementById("user_div").style.display = "block"
        document.title = user.email

        var user = firebase.auth().currentUser;

        if (user != null) {

            var email_id = user.email;
            var name = document.getElementById("register_user_name").value

            var firebase_ref = firebase.database().ref("/users")
            document.getElementById("user_para").innerHTML = "Você está logado como: " + email_id
            //insere novo user no banco
            if (name != "") {
                firebase_ref.child(user.uid).update({
                    username: name,
                    email: user.email,
                    id: user.uid,
                    // lat: 0,
                    // lng: 0,
                    // heading: 0,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                })
            }
        }

    } else {
        // No user is signed in.
        // document.getElementById("user_div").style.display = "none";
        // document.getElementById("login_div").style.display = "block";

    }
});

function login() {

    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Erro : " + errorMessage);

        // ...
    });

}

function to_main() {
    window.location.href = 'main.html'
}

function logout() {
    firebase.auth().signOut();
    window.location.replace("index.html")
}


//Maps api e funções
// counter for online cars...
var cars_count = 0;
// markers array to store all the markers, so that we could remove marker when any car goes offline and its data will be remove from realtime database...
var markers = [];
var map;
var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -30.1087957, lng: -51.3172272 },
        zoom: 16,
        disableDefaultUI: true,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ebe3cd"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#523735"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f1e6"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#c9b2a6"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#dcd2be"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ae9e90"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#93817c"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a5b076"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#447530"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f1e6"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fdfcf8"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f8c967"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#e9bc62"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e98d58"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#db8555"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#806b63"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8f7d77"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ebe3cd"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b9d3c2"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#92998d"
                    }
                ]
            }
        ]
    })
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                //heading: position.coords.heading
            };

            upload_user_location(position.coords.latitude, position.coords.longitude, position.coords.heading)

            infoWindow.setPosition(pos);
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'https://img.icons8.com/ios-glyphs/30/000000/marker.png',
                title: 'Você está aqui'
            });
            // infoWindow.setContent('Você está aqui.');
            // infoWindow.open(map, marker);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: O serviço de localização falhou.' :
        'Error: Seu navegador não suporta GPS.');
    infoWindow.open(map);
}

// // This Function will create a car icon with angle and add/display that marker on the map
function AddCar(data) {

    // var icon = { // car icon
    //     path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
    //     scale: 0.4,
    //     fillColor: "#a9b4cc", //<-- Bus Color 
    //     fillOpacity: 1,
    //     strokeWeight: 1,
    //     anchor: new google.maps.Point(0, 5),
    //     rotation: data.val().heading //<-- Bus angle
    // };

    var infowindow = new google.maps.InfoWindow({
        content: 'info do coletivo'
    });

    var uluru = {
        lat: parseFloat(data.val().lat),
        lng: parseFloat(data.val().lng)
    };

    var marker = new google.maps.Marker({
        position: uluru,
        icon: 'https://img.icons8.com/ultraviolet/40/000000/trolleybus.png',
        map: map
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
    markers[data.key] = marker; // add marker in the markers array...
    document.getElementById("cars").innerHTML = cars_count;
}

// get firebase database reference...
//var loc_ref = firebase.database().ref('/users')
var bus_loc_ref = firebase.database().ref('/coletivos')

// this event will be triggered when a new object will be added in the database...



bus_loc_ref.on('child_added', function (data) {
    cars_count++;
    AddCar(data)
    //console.log(data.val())
});

//this event will be triggered on location change of any car...
bus_loc_ref.on('child_changed', function (data) {
    markers[data.key].setMap(null);
    AddCar(data);
});

// If any car goes offline then this event will get triggered and we'll remove the marker of that car...  
bus_loc_ref.on('child_removed', function (data) {
    markers[data.key].setMap(null);
    cars_count--;
    document.getElementById("cars").innerHTML = cars_count;
});

//side menu
function open_menu() {
    var user = firebase.auth().currentUser;
    document.getElementById("profile_mail").innerHTML = user.email
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("menu_button").style.display = "none";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("menu_button").style.display = "block";
}
