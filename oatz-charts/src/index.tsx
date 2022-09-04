import React from 'react';
import { createRoot } from 'react-dom/client'; // since React-Upgrade from 17.x.x to 18.x.x, see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript, see https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
root.render(<App />);