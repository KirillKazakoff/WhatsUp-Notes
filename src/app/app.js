import '../css/defaultStyle.css';
import '../css/fonts.css';

import Controller from './controller/controller';
import registrateSW from './service-worker/registrateSW';

window.onload = async () => {
    registrateSW();
    const controller = new Controller();
};

console.log('check git');
