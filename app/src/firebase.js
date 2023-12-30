import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref as refSg, listAll, getDownloadURL } from "firebase/storage";
import { getDatabase, push, ref as refDb } from "firebase/database";
import { imgLinks } from "./App"

const firebaseConfig = {
  apiKey: "AIzaSyBKHupmYI10mLDfRTE4yWUCJXwpALWo7vQ",
  authDomain: "crispybyte.firebaseapp.com",
  databaseURL: "https://crispybyte-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "crispybyte",
  storageBucket: "crispybyte.appspot.com",
  messagingSenderId: "429545573789",
  appId: "1:429545573789:web:7880a6bce68305eacbf374",
  measurementId: "G-1LSJ511R0H"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getDatabase(app);

export const GetImages = (name, setImageUrls) => {
  const cachedUrls = imgLinks[name];
  if (cachedUrls) {
    setImageUrls(cachedUrls);
  } else {
    // Se non ci sono link memorizzati, carica le immagini e memorizzale
    const fetchImages = async () => {
      const storagerefSg = refSg(storage, name);
      const imagesrefSg = await listAll(storagerefSg);
      const urls = await Promise.all(
        imagesrefSg.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return url;
        })
      );
      imgLinks[name] = urls;
      setImageUrls(urls);
    };

    fetchImages();
  }
}

export const GetFirstImage = (name, setImageUrl) => {
  const cachedUrls = imgLinks[name];
  if (cachedUrls) {
    setImageUrl(cachedUrls[0]);
  } else {
    // Se non ci sono link memorizzati, carica le immagini e memorizzale
    const fetchImage = async () => {
      getDownloadURL(refSg(storage, name + "/0.jpg"))
        .then(url => {
          setImageUrl(url);
        }).catch(err => console.log(err))
    }

    fetchImage();
  }
}

export const takeOrder = (orderList, tavolo, onCallback, onError) => {
  push(refDb(db, "Ordini/" + tavolo), orderList).then(() => onCallback()).catch(err => onError(err))
}

export default app