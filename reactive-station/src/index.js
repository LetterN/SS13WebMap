import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import MainPage from './MainPage';
import { register } from './serviceWorkerRegistration';

import './styles/index.css';
import './styles/Content.css';
import './styles/Paralax.css';
import './styles/Leaflet.css';
import './styles/Button.css';
import './styles/Collapsible.css';
import './styles/Settings.css';


// register the SW
register();

ReactDOM.render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
  document.getElementById('root')
);
