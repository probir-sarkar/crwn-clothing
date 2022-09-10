// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbzHeeHZ7DuSlRAItVo2Ife0lX4N-7bHw",
  authDomain: "probir-crwn-clothing-db.firebaseapp.com",
  projectId: "probir-crwn-clothing-db",
  storageBucket: "probir-crwn-clothing-db.appspot.com",
  messagingSenderId: "810887719772",
  appId: "1:810887719772:web:91132b1b1625303b326f99",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

// Type of auth
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// Database
export const db = getFirestore(firebaseApp);

// Create a new user profile document
export const createUserDocumentFromAuth = async (userAuth, additionalData) => {
  // Check user Document in database
  const userDocRef = doc(db, "users", userAuth.uid);

  // Get the user document
  const userSnapshot = await getDoc(userDocRef);

  // If user does not exist, create a new user
  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else {
        console.log("Error creating user", error.message);
      }
    }
  }
  // Return the user document reference
  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (
  email,
  password,
  displayName
) => {
  if (!email || !password || !displayName) return;
  const user = await createUserWithEmailAndPassword(auth, email, password);
  return user;
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  const user = await signInWithEmailAndPassword(auth, email, password);
  return user;
};
