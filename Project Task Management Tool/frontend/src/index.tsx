import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { FirebaseAppProvider } from 'reactfire';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { theme } from './theme/chakra.theme';
import { BrowserRouter } from 'react-router-dom';

const firebaseConfig = {
    apiKey: 'AIzaSyA7OHjWtwVqouJGBQlnTJqh6HsPxRkVNvE',
    authDomain: 'dumpster-fire-24bf7.firebaseapp.com',
    projectId: 'dumpster-fire-24bf7',
    storageBucket: 'dumpster-fire-24bf7.appspot.com',
    messagingSenderId: '335508664521',
    appId: '1:335508664521:web:bf1baa8cf6ace7eb10dd18',
    measurementId: 'G-CVKMJ41L1C',
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <ChakraProvider theme={theme}>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </FirebaseAppProvider>
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
