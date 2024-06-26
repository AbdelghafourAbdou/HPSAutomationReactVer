import { } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import Stats, { loader as statsLoader } from '../Pages/Stats/Stats';
import Error404 from '../Pages/ErrorPages/Error404';
import NetworkError from '../Pages/ErrorPages/NetworkError';
import Projects, { loader as projectsLoader } from '../Pages/Projects/Projects';
import WebServices, { action as webServicesAction } from '../Pages/WebServices/WebServices';
import TestCases, { action as testCasesAction } from '../Pages/TestCases/TestCases';
import TestSuites, { action as testSuitesAction } from '../Pages/TestSuites/TestSuites';
import CardMGT, { loader as cardMGTLoader } from '../Pages/CardMGT/CardMGT';
import Administration, { loader as administrationLoader } from '../Pages/Administration/Administration';
import { action as emailAction } from '../Pages/Administration/Configs/EmailConfig';
import './App.css'

document.documentElement.style.setProperty('--animate-duration', '.60s');

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />} >
        <Route path='home' element={<Stats />} loader={statsLoader} />
        <Route path='projects' element={<Projects />} loader={projectsLoader} />
        <Route path='webServices' element={<WebServices />} action={webServicesAction} errorElement={<NetworkError />} />
        <Route path='testCases' element={<TestCases />} action={testCasesAction} />
        <Route path='testSuites' element={<TestSuites />} action={testSuitesAction} />
        <Route path='PSTTMGT' element={<CardMGT />} loader={cardMGTLoader} errorElement={<NetworkError />} />
        <Route path='administration' element={<Administration />} errorElement={<NetworkError />}
          action={emailAction}
          loader={administrationLoader} />

        <Route path='*' element={<Error404 />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App;
