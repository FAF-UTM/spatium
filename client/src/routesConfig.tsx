// routesConfig.tsx
import React from 'react';
import Home from './pages/home/Home';
import About from './pages/about/About.tsx';
import Projects from './pages/projects/Projects.tsx';
import News from './pages/news/News.tsx';
import Contact from './pages/contact/Contact.tsx';
import History from './pages/history/History.tsx';
import Galery from './pages/galery/Galery.tsx';
import Login from './pages/login/Login.tsx';
import Admin from './pages/admin/Admin.tsx';

export interface RouteConfig {
  path: string;
  i18nKey: string;
  element: React.ReactNode;
}

export const routesConfig: RouteConfig[] = [
  { path: '/', i18nKey: 'home.title', element: React.createElement(Home) },
  {
    path: '/:lang/',
    i18nKey: 'home.title',
    element: React.createElement(Home),
  },
  {
    path: '/:lang/about',
    i18nKey: '',
    element: React.createElement(About),
  },
  {
    path: '/:lang/projects',
    i18nKey: '',
    element: React.createElement(Projects),
  },
  {
    path: '/:lang/news',
    i18nKey: '',
    element: React.createElement(News),
  },
  {
    path: '/:lang/contacts',
    i18nKey: '',
    element: React.createElement(Contact),
  },
  {
    path: '/:lang/galery',
    i18nKey: '',
    element: React.createElement(Galery),
  },
  {
    path: '/:lang/history',
    i18nKey: '',
    element: React.createElement(History),
  },
  {
    path: '/:lang/login',
    i18nKey: '',
    element: React.createElement(Login),
  },
  {
    path: '/:lang/admin/*',
    i18nKey: '',
    element: React.createElement(Admin),
  },
];
