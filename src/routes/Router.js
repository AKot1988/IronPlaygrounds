import { onAuthStateChanged, getAuth } from 'firebase/auth';

import { Home, PlacesPage, SingleCardPage, MapPage } from '@/pages';
import { Header, Footer } from '@/components';

import { ROUTES_NAMES } from './helper';

//TODO: перенести рендер хедера сюди в навігейт
//TODO: add memoisation of the last visited route to keep user on the same route after reloading
//TODO: add the ability to fire a page method onRouteChange before the route actually changes. it should be some sort of a cleanup thing for page components.

const auth = getAuth();

const Router = {
  header: new Header(),
  footer: new Footer(),
  user: null,
  pages: {
    [ROUTES_NAMES.home]: new Home(),
    [ROUTES_NAMES.places]: new PlacesPage(),
    [ROUTES_NAMES.map]: new MapPage(),
    [ROUTES_NAMES.singleCard]: null,
  },
  currentPage: null,
  contentContainer: document.getElementById('pageContent'),
  headerContainer: document.getElementById('pageHead'),
  footerContainer: document.getElementById('pageFoot'),

  navigate(route, data) {
    this.data = data;
    // check if the route is one of the registered in ROUTES_NAMES
    const isRouteValid = Object.values(ROUTES_NAMES).some(
      (routeName) => routeName === route
    );
    // if route is invalid - fuck them all! throw this fucking error and see what happens!
    if (!isRouteValid) throw new TypeError(`Route doesn't exist - ${route}`);

    if (route === ROUTES_NAMES.singleCard) {
      this.pages[route] = new SingleCardPage(this.data);
    } else {
      this.pages[route] = this.pages[route] || null;
    }

    this.currentPage?.unmount?.()

    this.currentPage = this.pages[route];

    this.contentContainer.replaceChildren();

    this.currentPage.render(this.contentContainer);
  },

  changeAuth(user) {
    this.user = user;
    if (this.user) {
      this.header.renderLoggedIn(this.headerContainer);
    } else {
      this.header.renderLoggedOut(this.headerContainer);
    }
    this.footer.render(this.footerContainer);
  },
};

export default Router;
