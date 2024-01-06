import './Modal.scss';

export default function Modal() {
  this.isOpened = false;
  this.elements = {
    wrapper: document.createElement('div'),
    contentHolder: document.createElement('div'),
  };
}

/**
 * @param {HTMLElement} parent - parent element for hte modal window
 * @param {Component} ContentComponent - a Component which have a render() method. Is can be any component you have, the only condition is to have a render() method
 */
Modal.prototype.render = function (parent, ContentComponent) {
  this.parent = parent;
  this.ContentComponent = ContentComponent;

  this.elements.wrapper.classList.add('modal__wrapper');
  this.elements.contentHolder.classList.add('modal__content-holder');

  this.ContentComponent?.render(this.elements.contentHolder);
  this.elements.wrapper.append(this.elements.contentHolder);

  this.elements.wrapper.onclick = (event) => {
    if (event.target === this.elements.wrapper) {
      this.close();
    }
  };

  this.parent.append(this.elements.wrapper);
  this.isOpened = true;
};

Modal.prototype.close = function () {
  this.elements.wrapper.replaceChildren();
  this.elements.contentHolder.replaceChildren();
  this.isOpened = false;
  this.elements.wrapper.remove();
};

Modal.prototype.confirmation = function (parent, callback) {
  this.elements.confirmationButtonWrapper = document.createElement('div');
  this.elements.approveButton = document.createElement('button');
  this.elements.declineButton = document.createElement('button');
  this.elements.modalHeader = document.createElement('h2');

  this.elements.wrapper.classList.add('modal__wrapper');
  this.elements.contentHolder.classList.add('modal__content-holder');
  this.elements.confirmationButtonWrapper.classList.add(
    'modal__confirmation-button-wrapper'
  );
  this.elements.approveButton.classList.add('modal__approve-button');
  this.elements.declineButton.classList.add('modal__decline-button');
  this.elements.modalHeader.classList.add('modal__header');

  this.elements.modalHeader.innerText =
    'Ви впевнені, що хочете видалити картку?';
  this.elements.approveButton.innerText = 'Так';
  this.elements.declineButton.innerText = 'Ні';

  this.elements.declineButton.addEventListener('click', (event) => {
    if (event.target === this.elements.declineButton) {
      this.close();
    }
  });

  this.elements.approveButton.addEventListener('click', (event) => {
    if (event.target === this.elements.approveButton) {
      callback();
      this.close();
    }
  });

  this.elements.wrapper.onclick = (event) => {
    if (event.target === this.elements.wrapper) {
      this.close();
    }
  };

  this.elements.confirmationButtonWrapper.append(
    this.elements.approveButton,
    this.elements.declineButton
  );

  this.elements.contentHolder.append(
    this.elements.modalHeader,
    this.elements.confirmationButtonWrapper
  );

  this.elements.wrapper.append(this.elements.contentHolder);
  parent.append(this.elements.wrapper);
};
