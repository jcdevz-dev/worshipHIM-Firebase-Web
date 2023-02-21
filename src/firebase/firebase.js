// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED  } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = getAuth()
// db
// export const db = getFirestore(app);
export const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

enableIndexedDbPersistence(db)
.catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
        console.log('failed-precondition')
    } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
        console.log('unimplemented')
    }
});

export const logIn = (data, navigate) => signInWithEmailAndPassword(auth, data.email, data.password)
.then((userCredential) => {
    // Signed in 
    navigate('/dashboard', { replace: true });

  }).catch((error) => {
    console.error('error: ',error)
    alert(error)
});

export const logOut = (navigate) => signOut(auth)
.then(
    ()=>{
        console.log('Signout Succesfull')
        navigate('/login', { replace: true });
    }
);
