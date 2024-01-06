import { getAllPlaygrounds } from '@/firebase';
import IronCard from '@/components/IronCard/IronCard.js';

import '@/scss/main.scss';
import './Hero.scss';

export default function Home() {
  this.currentSlideIndex = 0;
  this.prevSlide = null;
  this.elements = {
    wrapper: document.createElement('div'),
    descriptionWrapper: document.createElement('div'),
    descriptionSlogan: document.createElement('h1'),
    description: document.createElement('h3'),
    carouselWrapper: document.createElement('div'),
  };
}

Home.prototype.render = async function (parent) {
  this.currentSlideIndex = 0;

  this.elements.wrapper.classList.add('hero-section');
  this.elements.descriptionWrapper.classList.add(
    'hero-section__description__wrapper'
  );
  this.elements.descriptionSlogan.classList.add(
    'hero-section__description__slogan'
  );
  this.elements.description.classList.add('hero-section__description');
  this.elements.carouselWrapper.classList.add(
    'hero-section__carousel__wrapper'
  );

  this.elements.descriptionSlogan.innerHTML =
    'Будь сильним!<br>Ставай кращим!<br>Завжди та повсюду';
  this.elements.description.innerText =
    "Фізична активність дає змогу сучасній людині повертатись до свого я, звернути увагу на своє тіло і відчути його, розвантажити мозок і привести до ладу думки. Для нашої команди спорт асоціюється з такими словами, як здоров'я, дисципліна, медитація і чудовий настрій. Ми любимо тренуватись на вулиці, оскільки, окрім спорту, ми любимо наше місто - Київ. Саме турніки дають можливість не прив'язуватись до одного місця, фіксованого часу та закритого приміщення. Ви можете уявити себе легендарним Майком Тайсоном, який тренувався на вулиці коли ще не встало сонце і з'являвся вранішній туман. Або можете уявити себе вигаданим Рокі Бальбоа, який тренувався як скажений при будь-якій погоді. Ким би ви себе не відчували, я поділюсь з вами кращими спортивними майданчиками Києва";

  this.elements.descriptionWrapper.append(
    this.elements.descriptionSlogan,
    this.elements.description
  );

  this.elements.wrapper.append(
    this.elements.descriptionWrapper,
    this.elements.carouselWrapper
  );
  parent.append(this.elements.wrapper);

  this.elements.carouselWrapper.replaceChildren();
  const ironPlaygroundsCollection = await getAllPlaygrounds();

  this.handleCarousel(ironPlaygroundsCollection);
};

Home.prototype.handleCarousel = function (collection) {
  const firstIronCard = new IronCard(collection[this.currentSlideIndex]);

  firstIronCard.render(this.elements.carouselWrapper);

  this.prevSlide = firstIronCard;
  this.currentSlideIndex++;

  if (!this.interval) {
    this.interval = setInterval(() => {
      console.log(this.currentSlideIndex);
      if (
        collection.length === 1 ||
        this.currentSlideIndex >= collection.length - 1
      ) {
        this.currentSlideIndex = 0;
      }

      this.prevSlide.remove();

      const newIronCard = new IronCard(collection[this.currentSlideIndex]);

      newIronCard.render(this.elements.carouselWrapper);
      this.currentSlideIndex++;
      this.prevSlide = newIronCard;
    }, 3000);
  }
};

Home.prototype.unmount = function () {
  console.log('Home.prototype.unmount has been called');
  clearInterval(this.interval);
  this.interval = null;
};
