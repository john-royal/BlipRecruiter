import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import JobsList, { loadJobs } from './routes/JobsList';
import JobPage, { loadJob } from './routes/Job';
import ApplicationsList from './routes/ApplicationsList';
import { loadApplications } from './routes/ApplicationsList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <JobsList />,
    loader: loadJobs,
  },
  {
    path: '/:job',
    element: <JobPage />,
    loader: loadJob,
  },
  {
    path: '/applications',
    element: <ApplicationsList />,
    loader: loadApplications,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
