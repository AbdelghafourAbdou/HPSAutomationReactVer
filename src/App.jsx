import { } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import TestCases from '../Pages/TestCases';
import Administration from '../Pages/Administration';
import { action as emailAction } from '../Pages/Configs/EmailConfig';
import Layout from '../Layouts/Layout';
import './App.css'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='administration' element={<Administration />} action={emailAction} />
        <Route path='testCases'element={<TestCases />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App
