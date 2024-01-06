import {
  YOUTUBE_LOGO,
  INSTAGRAM_LOGO,
  PIGGY_LOGO,
} from '@/assets/images/svg/svg';
import './footer.scss';

export default function Footer() {
  this.elements = {
    self: document.createElement('div'),
    wrapper: document.createElement('div'),
    linksContainer: document.createElement('div'),
    youtube: document.createElement('a'),
    instagram: document.createElement('a'),
    monobank: document.createElement('a'),
    copyrightMessage: document.createElement('p'),
  };
}

Footer.prototype.render = function (parent) {
  this.elements.self.classList.add('footer');
  this.elements.wrapper.classList.add('footer__wrapper');
  this.elements.linksContainer.classList.add('footer__links__container');
  this.elements.youtube.classList.add('footer__youtube__link');
  this.elements.instagram.classList.add('footer__instagram__link');
  this.elements.monobank.classList.add('footer__monobank__link');
  this.elements.copyrightMessage.classList.add('footer__copyrightMessage');

  this.elements.youtube.href = 'https://www.youtube.com/@kulibabenko';
  this.elements.instagram.href = 'https://www.instagram.com/kulibabenko/';
  this.elements.monobank.href = 'https://send.monobank.ua/jar/2JmA7TAAKC';

  this.elements.youtube.innerHTML = YOUTUBE_LOGO;
  this.elements.instagram.innerHTML = INSTAGRAM_LOGO;
  this.elements.monobank.innerHTML = PIGGY_LOGO;
  this.elements.copyrightMessage.innerText = '© AKotStudio 2023';
  this.elements.linksContainer.append(
    this.elements.youtube,
    this.elements.instagram,
    this.elements.monobank
  );
  this.elements.wrapper.append(
    this.elements.linksContainer,
    this.elements.copyrightMessage
  );
  this.elements.self.append(this.elements.wrapper);
  parent.append(this.elements.self);
};
