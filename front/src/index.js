import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from 'react-router-dom';
import LoginContextProvider from '../src/component/login/security/contexts/LoginContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <LoginContextProvider>
            <App />
        </LoginContextProvider>
    </BrowserRouter> 
);
