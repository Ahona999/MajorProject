mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12',//---> You can also chnge style version like dark, lite and so on // style URL
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});


// Create a default Marker and add it to the map
const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(listing.geometry.coordinates)// ---> Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
    `<h6>${listing.title}</h6><p>Exact Location will be provided after Booking!</p>`))
.addTo(map);
