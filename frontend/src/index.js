import React from 'react';
import ReactDOM from 'react-dom/client';

// 1) Ionic core & basic styles
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// 2) Optional Ionic utilities
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// 3) Your custom theme overrides
import './theme/variables.css';
import './theme/global.css';

import App from './App';
import { setupIonicReact } from '@ionic/react';

// Initialize Ionic
setupIonicReact();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
