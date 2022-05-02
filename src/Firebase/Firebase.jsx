import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  updateEmail,
  updateProfile,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  browserLocalPersistence,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Firestore = require("./Firestore");
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app, {
  persistence: browserLocalPersistence,
});
function SpotifyFbLogin(data) {
  signInWithCustomToken(auth, data.firebaseToken)
    .then((userCredential) => {
      updateEmail(auth.currentUser, data.userInfo.body.email)
        .then(() => {
          console.log("email updated");
        })
        .catch((error) => {
          console.log("error", error);
        });
      updateProfile(auth.currentUser, {
        displayName: data.userInfo.body.display_name,
      })
        .then(() => {
          console.log("display name updated");
          console.log("userCredential", userCredential);
        })
        .catch((error) => {
          console.log("error", error);
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
  return "SpotifyLogin";
}

function AppUserCreation(data) {
  console.log("data", data);
  createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password,
    data.displayName
  )
    .then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName: data.displayName,
      })
        .then(() => {
          console.log("display name updated");
          console.log("userCredential", userCredential);
        })
        .catch((error) => {
          console.log("error", error);
        });
      toast.success("Account Created Successfully");
      Firestore.createUsersInFirestore(
        userCredential.user.uid,
        userCredential.user.displayName,
        userCredential.user.email,
        userCredential.user.photoURL
      );
      window.localStorage.setItem(
        "userDetails",
        JSON.stringify(auth.currentUser)
      );
    })
    .catch((error) => {
      console.log("error", error);
      toast.error(error.message);
    });
}
async function AppUserLogin(data) {
  let redirStatus;
  const signIn = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  console.log(signIn.user);
  if (signIn.user) {
    toast.success("Login Successfull");
    redirStatus = await Firestore.createUsersInFirestore(
      signIn.user.uid,
      signIn.user.displayName,
      signIn.user.email,
      signIn.user.photoURL
    );

    window.localStorage.setItem(
      "userDetails",
      JSON.stringify(auth.currentUser)
    );
    console.log(redirStatus);
    return redirStatus;
  } else {
    toast.error("Cannot Login");
    return { err: true };
  }
}
function AppSignOut() {
  signOut(auth)
    .then(() => {
      toast.success("Logged Out Successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    })
    .catch((error) => {
      console.log("error", error);
      toast.error(error.message);
    });
}

async function GoogleLogin() {
  const provider = new GoogleAuthProvider();

  try {
    const googlePopup = await signInWithPopup(auth, provider);

    console.log(googlePopup);
    // const credential = GoogleAuthProvider.credentialFromResult(googlePopup);
    // const token = credential.accessToken;
    Firestore.createUsersInFirestore(
      googlePopup.user.uid,
      googlePopup.user.displayName,
      googlePopup.user.email,
      googlePopup.user.photoURL
    );

    window.localStorage.setItem(
      "userDetails",
      JSON.stringify(auth.currentUser)
    );

    return { status: 200, message: "Login Successful" };
  } catch (error) {
    console.log(error);
    return { status: 400, message: error.message };
  }
}

export {
  SpotifyFbLogin,
  firebaseConfig,
  AppUserCreation,
  AppUserLogin,
  AppSignOut,
  GoogleLogin,
};
