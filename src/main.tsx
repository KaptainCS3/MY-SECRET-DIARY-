import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import store from './app/store'
// import {ToastContainer} from "react-toastify"
import "react-toastify/ReactToastify.css"
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>
  </React.StrictMode>,
)
