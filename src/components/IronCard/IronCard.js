import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';

import {
  playgroundCollectionRef,
  favoritesCollectionRef,
} from '../../firebase/firebase';

import { doesCardInFavorites } from '../../firebase/API';

import { Button, Form, Modal } from '@/components';
import { SingleCardPage } from '@/pages';
import { Router, ROUTES_NAMES } from '@/routes';
import {
  favSVGchecked,
  favSVGunChecked,
  locationSVG,
} from '@/assets/images/svg/svg';

import './IronCard.scss';

export default function IronCard(data) {
  this.data = data;
  this.elements = {
    self: document.createElement('div'),
    pointsContainer: document.createElement('div'),
    title: document.createElement('h3'),
    description: document.createElement('p'),
    photo: document.createElement('img'),
    longitude: document.createElement('p'),
    latitude: document.createElement('p'),
    rate: document.createElement('p'),
    author: document.createElement('p'),
    favSVG: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    ankerLinkLocation: document.createElement('a'),
  };
}

IronCard.prototype.render = async function (parent, isEditable = false) {
  this.parent = parent;
  this.elements.self.classList.add('iron-card');
  this.elements.title.classList.add('iron-card__title');
  this.elements.description.classList.add('iron-card__description');
  this.elements.photo.classList.add('iron-card__photo');
  this.elements.author.classList.add('iron-card__author');
  this.elements.pointsContainer.classList.add('iron-card__pointsContainer');
  this.elements.rate.classList.add('iron-card__rate');
  this.elements.favSVG.classList.add('iron-card__favSVG');
  this.elements.ankerLinkLocation.classList.add('iron-card__ankerLinkLocation');

  this.elements.title.innerText = this.data.title;
  this.elements.description.innerText = this.data.description;
  this.elements.photo.src = this.data.photo;
  this.elements.longitude.innerText = this.data.coordinates?.longitude;
  this.elements.latitude.innerText = this.data.coordinates?.latitude;
  this.elements.rate.innerText = `Рейтинг: ${this.data.rate}`;
  this.elements.author.innerText = this.data.author;

  this.elements.favSVG.innerHTML = await doesCardInFavorites(
    this.data.id,
    favSVGunChecked,
    favSVGchecked
  );
  this.elements.ankerLinkLocation.target = '_blank';
  this.elements.ankerLinkLocation.href = `https://www.google.com/maps/search/?api=1&query=${this.data.coordinates?.latitude},${this.data.coordinates?.longitude}`;
  this.elements.ankerLinkLocation.innerHTML = locationSVG;
  this.elements.favSVG.onclick = (e) => this.changeFavoritesStatus(e);
  this.elements.ankerLinkLocation.onclick = (event) => {
    event.stopPropagation();
  };
  this.elements.self.onclick = (event) => {
    event.stopPropagation();
    if (
      !event.target.classList.contains('iron-card__favSVG') &&
      !event.target.classList.contains('iron-card__locationSVG')
    ) {
      Router.navigate(ROUTES_NAMES.singleCard, this.data);
    }
  };

  this.elements.pointsContainer.append(
    this.elements.rate,
    this.elements.favSVG,
    this.elements.ankerLinkLocation
  );

  this.elements.self.append(
    this.elements.photo,
    this.elements.title,
    this.elements.description,
    this.elements.pointsContainer
  );

  if (isEditable) {
    this.editCardButtons();
  }

  parent.append(this.elements.self);
};

IronCard.prototype.remove = function (parent) {
  this.elements.self.remove();
};

IronCard.prototype.editCardButtons = function () {
  const updateCardButton = new Button({
    text: 'Редагувати',
    className: 'iron-card__updateCardButton',
    clickHandler: (event) => this.handleUpdateCardButton(event),
  });
  const deleteCardButton = new Button({
    text: 'Видалити',
    className: 'iron-card__deleteCardButton',
    clickHandler: (event) => this.handleDeleteCardButton(event),
  });

  this.elements.buttonsContainer = document.createElement('div');
  this.elements.buttonsContainer.classList.add('iron-card__buttonsContainer');
  this.elements.updateCardButton = updateCardButton;
  this.elements.deleteCardButton = deleteCardButton;

  this.elements.updateCardButton.render(this.elements.buttonsContainer);
  this.elements.deleteCardButton.render(this.elements.buttonsContainer);

  this.elements.self.append(this.elements.buttonsContainer);
};

IronCard.prototype.handleUpdateCardButton = function (ev) {
  ev.stopPropagation();
  this.modal = new Modal();
  const editForm = new Form({
    type: 'edit',
    afterSubmit: () => {
      this.modal.close();
      Router.navigate(ROUTES_NAMES.places);
    },
  });

  this.modal.render(this.parent);
  editForm.render(this.modal.elements.contentHolder, this.data);
};

IronCard.prototype.handleDeleteCardButton = function (ev) {
  ev.stopPropagation();
  const confirmationModal = new Modal();
  confirmationModal.confirmation(document.getElementById('app'), async () => {
    await this.deleteCard();
    confirmationModal.close();
    Router.navigate(ROUTES_NAMES.places);
  });
};

IronCard.prototype.deleteCard = async function () {
  //отримуємо документРеференс на ту картку, по якій тицнули "видалити"
  const playGroundDocRef = doc(playgroundCollectionRef, this.data.id);
  //отримуємо документСнепшот на ту картку, по якій тицнули "видалити"
  const playGroundSnapshot = await getDoc(playGroundDocRef);
  //отримуємо обєкт з даними на ту картку, по якій тицнули "видалити"
  const playGround = playGroundSnapshot.data();

  //знову нахуясь отримуємо документРеференс на ту картку, по якій тицнули "видалити"
  const deleteDocRef = doc(playgroundCollectionRef, this.data.id);
  const deleteConfirmation = confirm('Ви впевнені, що хочете видалити?');
  //якщо користувач підтвердив видалення, то видаляємо документРеференс
  if (deleteConfirmation) {
    //викликаємо функцію видалення документа з бази даних, в яку передаємо посилання
    //на документРеференс
    await deleteDoc(deleteDocRef);
  }
};

IronCard.prototype.changeFavoritesStatus = async function (e) {
  e.stopPropagation();
  const selectedCardDocumentReference = doc(
    playgroundCollectionRef,
    this.data.id
  );
  const userFavoritesRef = doc(favoritesCollectionRef, Router.user.uid);
  const userFavDocSnapshot = await getDoc(userFavoritesRef);
  const userFavDocRefArray = userFavDocSnapshot.data().list;

  const favIDArray = [];
  userFavDocRefArray.forEach((docRef) => {
    favIDArray.push(docRef.id);
  });
  if (favIDArray.includes(selectedCardDocumentReference.id)) {
    userFavDocRefArray.splice(
      favIDArray.indexOf(selectedCardDocumentReference.id),
      1
    );
    await updateDoc(userFavoritesRef, { list: userFavDocRefArray });
  } else {
    userFavDocRefArray.push(selectedCardDocumentReference);
    await updateDoc(userFavoritesRef, { list: userFavDocRefArray });
  }
  Router.navigate(ROUTES_NAMES.places);
};

IronCard.prototype.checkFavoritesStatus = async function () {
  const cardDocRef = doc(playgroundCollectionRef, this.data.id);
  const userFavoritesRef = doc(favoritesCollectionRef, auth.lastNotifiedUid);
  const userFavDocSnapshot = await getDoc(userFavoritesRef);
  const userFavDocRefDataArray = userFavDocSnapshot.data().list;
  console.log(cardDocRef);
  console.log(userFavDocRefDataArray);

  if (userFavDocRefDataArray.some((docRefId) => docRefId === cardDocId)) {
    return favSVGchecked;
  } else {
    return favSVGunChecked;
  }
};
