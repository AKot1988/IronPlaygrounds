import { Router } from '@/routes';
import { GenerateMarkers } from '@/utils';
import { getAllPlaygrounds } from '@/firebase/API';

import './MapPage.scss';

export default function MapGeneral() {
  this.dataArray = null;
  this.markers = null;
  this.elements = {
    self: document.createElement('div'),
    mapWrapper: document.createElement('div'),
    map: document.createElement('div'),
    filterContainer: document.createElement('fieldset'),
    filterHeader: document.createElement('h2'),
    containerMyPlaygrounds: document.createElement('div'),
    checkboxMyPlaygrounds: document.createElement('input'),
    signatureMyPlaygrounds: document.createElement('h4'),
    containerOtherPlaygrounds: document.createElement('div'),
    checkboxOtherPlaygrounds: document.createElement('input'),
    signatureOtherPlaygrounds: document.createElement('h4'),
  };
}

MapGeneral.prototype.render = async function (parent) {
  this.elements.self.classList.add('mapPage');
  this.elements.mapWrapper.classList.add('mapPage__mapWrapper');
  this.elements.map.classList.add('mapPage__map');
  this.elements.map.id = 'mapWrapper__container';
  this.elements.filterContainer.classList.add('mapPage__filter-container');
  this.elements.filterHeader.classList.add('mapPage__filter-header');
  this.elements.filterHeader.innerText = 'Filter by';

  this.elements.containerMyPlaygrounds.classList.add(
    'mapPage__filter-option1-container'
  );
  this.elements.signatureMyPlaygrounds.classList.add(
    'mapPage__filter-option1-signature'
  );
  this.elements.checkboxMyPlaygrounds.classList.add('mapPage__filter-option1');
  this.elements.checkboxMyPlaygrounds.type = 'checkbox';
  this.elements.checkboxMyPlaygrounds.checked = true;

  this.elements.filterContainer.onchange = (e) => this.filterPlaygrounds(e);

  this.elements.signatureMyPlaygrounds.innerText = 'Мої майданчики';

  this.elements.containerOtherPlaygrounds.classList.add(
    'mapPage__filter-option2-container'
  );
  this.elements.signatureOtherPlaygrounds.classList.add(
    'mapPage__filter-option2-signature'
  );
  this.elements.checkboxOtherPlaygrounds.classList.add(
    'mapPage__filter-option2'
  );
  this.elements.checkboxOtherPlaygrounds.type = 'checkbox';
  this.elements.checkboxOtherPlaygrounds.checked = true;

  this.elements.signatureOtherPlaygrounds.innerText = 'Рeшта майданчиків';

  this.elements.mapWrapper.append(this.elements.map);

  this.elements.containerMyPlaygrounds.append(
    this.elements.checkboxMyPlaygrounds,
    this.elements.signatureMyPlaygrounds
  );
  this.elements.containerOtherPlaygrounds.append(
    this.elements.checkboxOtherPlaygrounds,
    this.elements.signatureOtherPlaygrounds
  );

  this.elements.filterContainer.append(
    this.elements.filterHeader,
    this.elements.containerMyPlaygrounds,
    this.elements.containerOtherPlaygrounds
  );

  this.elements.self.append(
    this.elements.filterContainer,
    this.elements.mapWrapper
  );
  parent.append(this.elements.self);

  this.dataArray = await getAllPlaygrounds();

  // switch (this.owner) {
  //   case 'currentUser':
  //     el.className = 'marker-currentUser';
  //     break;
  //   case 'stranger':
  //     el.className = 'marker-stranger';
  //     break;
  // }

  this.mapMarkers = new GenerateMarkers(
    'mapWrapper__container',
    this.dataArray
  );
  this.mapMarkers.render();
};

MapGeneral.prototype.filterPlaygrounds = function (e) {
  e.preventDefault();

  this.mapMarkers.markers.forEach((m) => {
    m.remove();
  });

  if (
    this.elements.checkboxMyPlaygrounds.checked &&
    this.elements.checkboxOtherPlaygrounds.checked
  ) {
    this.mapMarkers.placesArray = this.dataArray;
  } else if (
    this.elements.checkboxMyPlaygrounds.checked &&
    !this.elements.checkboxOtherPlaygrounds.checked
  ) {
    this.mapMarkers.placesArray = this.dataArray.filter(
      (playground) => playground.author === Router.user.uid
    );
  } else if (
    !this.elements.checkboxMyPlaygrounds.checked &&
    this.elements.checkboxOtherPlaygrounds.checked
  ) {
    this.mapMarkers.placesArray = this.dataArray.filter(
      (playground) => playground.author !== Router.user.uid
    );
  } else if (
    !this.elements.checkboxMyPlaygrounds.checked &&
    !this.elements.checkboxOtherPlaygrounds.checked
  ) {
    this.mapMarkers.placesArray = [];
  }

  this.mapMarkers.geojson.features = this.mapMarkers.createFeatures() || [];
  this.mapMarkers.render();
};
