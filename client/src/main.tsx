import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Books from './pages/Books.tsx';
import Authors from './pages/Authors.tsx';
import Genres from './pages/Genres.tsx';
import { Provider } from 'jotai';
import { DevTools } from 'jotai-devtools';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "authors",
        element: <Authors />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <DevTools />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
