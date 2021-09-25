import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import Modal from 'react-modal';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';

const queryClient = new QueryClient();

const userLocalStorage = localStorage.getItem('userInfo');
const userInfoObject = JSON.parse(userLocalStorage);

axios.defaults.baseURL = 'https://localhost:44303';

Modal.setAppElement('#root');

if (userLocalStorage) {
  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${userInfoObject.token}`;
}
// axios.defaults.headers.common['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRGF0bHQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTYyMjE3OTk5NCwiaXNzIjoiaHR0cDovL3Jvb2tpZXMtMDAxLXNpdGUxLml0ZW1wdXJsLmNvbSIsImF1ZCI6Imh0dHA6Ly9yb29raWVzLTAwMS1zaXRlMS5pdGVtcHVybC5jb20ifQ.yjNrehkkZBFXca9L0OCQdM7qkiwU5jaKOS7QhrNxdS0`;

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
