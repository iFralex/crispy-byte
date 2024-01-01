import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const db = getDatabase(app);
const auth = getAuth(app);

export const GetAllOrders = (getOrders) => {
  onValue(ref(db, "Ordini"), snp => getOrders(snp.val()))
}

export const GetTableOrderFromDb = (table, getOrders) => {
  onValue(ref(db, "Ordini/" + table), snp => getOrders(snp.val()))
}

export const UpdateCompletedsOnDb = (value, table, id, onComplete) => {
  set(ref(db, "Ordini/" + table + "/" + id + "/completed"), value).then(() => onComplete()).catch(err => alert(err))
}

export const DeleteOrder = (table, id) => {
  set(ref(db, "Ordini/" + table + "/" + id), null)
}

export const SignIn = (email, password, onSigned) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      onSigned(true);
    })
    .catch((error) => {
      onSigned(false)
      alert(error)
    });
}

export default app