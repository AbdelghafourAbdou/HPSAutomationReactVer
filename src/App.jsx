import {  } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import './App.css'
import Layout from '../Layouts/Layout';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>
        
      </Route>
    )
  );

  return (
    <RouterProvider router={router}/>
  )
}

export default App
