import { Map } from '@/utils';

import { IronCard } from '@/components';

import './SingleCardPage.scss';

export default function SingleCardPage(data) {
  this.data = data;
  this.elements = {
    wrapper: document.createElement('div'),
    cardWrapper: document.createElement('div'),
    card: new IronCard(this.data),
    mapWrapper: document.createElement('div'),
    map: document.createElement('div'),
  };
}

SingleCardPage.prototype.render = async function (parent) {
  const mapContainerID = 'singlePagePlaygroundMap';

  this.elements.wrapper.classList.add('map-page');
  this.elements.cardWrapper.classList.add('map-page__card-wrapper');
  this.elements.mapWrapper.classList.add('map-page__map-wrapper');
  this.elements.map.classList.add('map-page__map');

  this.elements.map.id = mapContainerID;

  this.elements.card.render(this.elements.cardWrapper);
  this.elements.mapWrapper.append(this.elements.map);
  this.elements.wrapper.append(
    this.elements.cardWrapper,
    this.elements.mapWrapper
  );

  parent.append(this.elements.wrapper);

  const newMap = new Map({
    markerDraggable: false,
    longitude: this.data.coordinates.longitude,
    latitude: this.data.coordinates.latitude,
    mapContainerID,
    popupContent: `<a href="${`https://www.google.com/maps/search/?api=1&query=${this.data.coordinates?.latitude},${this.data.coordinates?.longitude}`}" target="_blank">Go to Google Maps</a>`,
  });
  newMap.render();
  newMap.addMarker({
    longitude: this.data.coordinates.longitude,
    latitude: this.data.coordinates.latitude,
  });
};
