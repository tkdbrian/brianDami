import * as firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
    apiKey: "AIzaSyDUM5hcSTVTWwY-JnhjN9n2jh93exzoeX8",
    authDomain: "not2-final.firebaseapp.com",
    databaseURL: "https://not2-final.firebaseio.com",
    projectId: "not2-final",
    storageBucket: "not2-final.appspot.com",
    messagingSenderId: "382737529225",
    appId: "1:382737529225:web:a6e2b75e4ea3574922c958"

};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };