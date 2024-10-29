import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyA251hbqDqOHCvs8nGg7spO70n2VOz0-dE",
    authDomain: "projekt-inzynierski-55317.firebaseapp.com",
    projectId: "projekt-inzynierski-55317",
    storageBucket: "projekt-inzynierski-55317.appspot.com",
    messagingSenderId: "648895758714",
    appId: "1:648895758714:web:eaa64747629fb7776096c3",
    measurementId: "G-W8JQT8D35B"
  };


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
