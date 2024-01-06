export default function Button({
  text,
  className = 'primary-btn',
  clickHandler,
}) {
  this.text = text;
  this.className = className;
  this.clickHandler = clickHandler;
  this.elements = {
    button: document.createElement('button'),
  };
}

Button.prototype.render = function (parentElement) {
  this.elements.button.innerHTML = this.text;
  this.elements.button.classList.add(this.className);

  this.elements.button.onclick = (e) => this.clickHandler(e);

  parentElement.appendChild(this.elements.button);
};

Button.prototype.changeText = function (newText) {
  this.text = newText;
  this.elements.button.innerHTML = newText;
};

Button.prototype.changeOnClick = function (newHandler) {
  this.clickHandler = newHandler;
  this.elements.button.onclick = (e) => this.clickHandler(e);
};
