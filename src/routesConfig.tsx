// routesConfig.tsx
import React from 'react';
import Home from './pages/home/Home';
import NotFound from './pages/notfound/NotFound';
import About from './pages/about/About.tsx';
import Projects from './pages/projects/Projects.tsx';
import News from './pages/news/News.tsx';
import Contact from './pages/contact/Contact.tsx';

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
    path: '/:lang/contact',
    i18nKey: '',
    element: React.createElement(Contact),
  },
  {
    path: '*',
    i18nKey: 'not_found.title',
    element: React.createElement(NotFound),
  },
];
