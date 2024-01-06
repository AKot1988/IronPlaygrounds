import mapboxgl from 'mapbox-gl';

import { Router } from '@/routes';
import { IRON_LOGO } from '@/assets/images/svg/svg.js';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function GenerateMarkers(containerID, placesArray) {
  this.containerID = containerID;
  this.placesArray = placesArray;
  this.markers = [];
  this.map = new mapboxgl.Map({
    container: this.containerID,
    style: 'mapbox://styles/kulibabenko/clp9y1en4004601pkfo8j9yqj/draft',
    center: [30.509444, 50.445455],
    zoom: 9,
  });

  this.geojson = {
    type: 'FeatureCollection',
    features: this.createFeatures() || [],
  };
}

GenerateMarkers.prototype.createFeatures = function () {
  return this.placesArray.map((place) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [place.coordinates?.longitude, place.coordinates?.latitude],
    },
    properties: {
      title: `Вирушити ${place.title}`,
      owner: place.author,
      description: `<a href="${`https://www.google.com/maps/search/?api=1&query=${place.coordinates?.latitude},${place.coordinates?.longitude}`}" target="_blank">Go to Google Maps</a>`,
    },
  }));
};

GenerateMarkers.prototype.render = function () {
  this.markers = this.geojson.features.map((marker) => {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.innerHTML = IRON_LOGO;

    if (marker.properties.owner === Router.user.uid) {
      el.className = 'marker-currentUser';
    } else {
      el.className = 'marker-stranger';
    }

    // make a marker for each feature and add to the map
    return new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(
            `<h3>${marker.properties.title}</h3><p>${marker.properties.description}</p>`
          )
      )
      .addTo(this.map);
  });
};
