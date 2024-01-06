import Button from '@/components/Button/Button';
import {
  getAllPlaygrounds,
  getAllPlaygroundsByUser,
  getFavorites,
} from '@/firebase/API.js';
import IronCard from '@/components/IronCard/IronCard';
import Form from '@/components/Form/Form';
import Modal from '@/components/Modal/Modal';
import { Router, ROUTES_NAMES } from '@/routes';
import './Places.scss';

export default function PlacesPage() {
  '';
  this.filterOptions = [
    'Всі майданчики',
    'Мої майданчики',
    'Обрані майданчики',
  ];
  this.modal = new Modal();
  this.dataArray = null;
  this.elements = {
    wrapper: document.createElement('div'),
    optionsWrapper: document.createElement('div'),
    cardsWrapper: document.createElement('div'),
    filterOptions: document.createElement('select'),
    addNewCardButton: new Button({
      text: 'Create card',
      className: 'places__add__button',
      clickHandler: (e) => this.handleAdd(e),
    }),
  };

  this.elements.filterOptions.onchange = (e) => {
    this.elements.cardsWrapper.replaceChildren();
    this.elements.cardsWrapper.innerHTML = '';
    const selectedOptionIndex = e.target.selectedIndex;
    const filter = e.target.options[selectedOptionIndex].dataset.filter;

    switch (filter) {
      case 'Всі майданчики':
        this.renderFilteredPlaces(
          this.elements.cardsWrapper,
          getAllPlaygrounds
        );
        break;
      case 'Мої майданчики':
        this.renderFilteredPlaces(
          this.elements.cardsWrapper,
          getAllPlaygroundsByUser
        );
        break;
      case 'Обрані майданчики':
        this.renderFilteredPlaces(this.elements.cardsWrapper, getFavorites);
        break;
    }
  };
}

PlacesPage.prototype.render = async function (parent) {
  this.elements.cardsWrapper.replaceChildren();

  this.elements.wrapper.classList.add('places');
  this.elements.wrapper.dataset.bui = 'places';
  this.elements.optionsWrapper.classList.add('places__options__wrapper');
  this.elements.cardsWrapper.classList.add('places__cards__wrapper');
  this.elements.filterOptions.classList.add('places__filterOptions');

  this.elements.filterOptions.innerHTML = this.createFilterList();

  this.elements.optionsWrapper.append(this.elements.filterOptions);
  this.elements.addNewCardButton.render(this.elements.optionsWrapper);

  await this.renderFilteredPlaces(
    this.elements.cardsWrapper,
    getAllPlaygrounds
  );

  this.elements.wrapper.append(
    this.elements.optionsWrapper,
    this.elements.cardsWrapper
  );

  parent.append(this.elements.wrapper);
};

PlacesPage.prototype.handleAdd = function (e) {
  const newForm = new Form({
    type: 'create',
    afterSubmit: () => {
      this.modal.close(), Router.navigate(ROUTES_NAMES.places);
    },
  });

  this.modal.render(this.elements.wrapper, newForm);
};

PlacesPage.prototype.renderFilteredPlaces = async function (
  parent,
  filteredQuery
) {
  const allPlaces = await filteredQuery();

  allPlaces.forEach((cardData) => {
    const newCard = new IronCard(cardData);
    newCard.render(parent, filteredQuery === getAllPlaygroundsByUser);
  });
};

PlacesPage.prototype.createFilterList = function () {
  return [
    this.filterOptions.map(
      (item) => `<option value="${item}" data-filter="${item}">${item}</option>`
    ),
  ].join();
};
