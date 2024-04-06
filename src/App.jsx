import { } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import Stats from '../Pages/Stats/Stats';
import Projects, { loader as projectsLoader } from '../Pages/Projects/Projects';
import WebServices, { action as webServicesAction } from '../Pages/WebServices/WebServices';
import TestCases, { action as testCasesAction } from '../Pages/TestCases/TestCases';
import Administration from '../Pages/Administration/Administration';
import { action as emailAction } from '../Pages/Administration/Configs/EmailConfig';
import './App.css'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='home' element={<Stats />} />
        <Route path='projects' element={<Projects />} loader={projectsLoader} />
        <Route path='webServices' element={<WebServices />} action={webServicesAction} />
        <Route path='testCases' element={<TestCases />} action={testCasesAction} />
        <Route path='administration' element={<Administration />} action={emailAction} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App
