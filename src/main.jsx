import ReactDOM from 'react-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </QueryParamProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
