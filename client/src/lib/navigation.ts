// navigation.ts
import type { NavigateFunction, NavigateOptions, To } from "react-router-dom";

let navigator: NavigateFunction | undefined;

export function setNavigator(navigateFn: NavigateFunction) {
  navigator = navigateFn;
}

export function navigate(to: To, options?: NavigateOptions) {
  if (!navigator) {
    console.warn("⚠ Navigator has not been set yet");
    return;
  }
  navigator(to, options);
}

// import { createBrowserRouter } from 'react-router-dom';
// import App from './App';
// import Home from './components/Home';
// import About from './components/About';
// // import other components

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "",
//         element: <Home />
//       },
//       {
//         path: "about",
//         element: <About />
//       }
//       // add more routes
//     ]
//   }
// ]);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { RouterProvider } from 'react-router-dom';
// import { router } from './router';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
