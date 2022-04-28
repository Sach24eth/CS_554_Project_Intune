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
  return "hahah";
}

async function AppUserCreation(data) {
  console.log("data", data);
  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
      data.displayName
    );
    Firestore.createUsersInFirestore(
      createUser.user.uid,
      data.displayName,
      createUser.user.email,
      createUser.user.photoURL
    );

    window.localStorage.setItem(
      "userDetails",
      JSON.stringify(auth.currentUser)
    );

    return {
      status: 200,
      userCreated: true,
      message: "User created. Redirecting...",
    };
  } catch (error) {
    console.log(error);
    return { status: 400, userCreated: false, message: error };
  }

  // console.log(createUser.user);

  // .then((userCredential) => {
  //   userCredential.user.displayName = data.displayName;
  //   toast.success("Account Created Successfully");
  //   Firestore.createUsersInFirestore(
  //     userCredential.user.uid,
  //     userCredential.user.displayName,
  //     userCredential.user.email,
  //     userCredential.user.photoURL
  //   );
  //   window.localStorage.setItem(
  //     "userDetails",
  //     JSON.stringify(auth.currentUser)
  //   );
  // })
  // .catch((error) => {
  //   console.log("error", error);
  //   toast.error(error.message);
  // });
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
  // .then(async (userCredential) => {
  //   console.log("userCredential", userCredential);
  //   toast.success("Login Successful");
  //   redirStatus = await Firestore.createUsersInFirestore(
  //     userCredential.user.uid,
  //     userCredential.user.displayName,
  //     userCredential.user.email,
  //     userCredential.user.photoURL
  //   );
  //   window.localStorage.setItem(
  //     "userDetails",
  //     JSON.stringify(auth.currentUser)
  //   );
  //   console.log(redirStatus);
  //   return redirStatus;
  // })
  // .catch((error) => {
  //   console.log("error", error);
  //   toast.error(error.message);
  // });
  console.log(redirStatus);
  return { redirStatus };
}

function AppSignOut() {
  signOut(auth)
    .then(() => {
      toast.success("Logged Out Successfully");
      window.localStorage.setItem("auth", 0);
      setTimeout(() => {
        window.location.href = "/";
      }, 700);
    })
    .catch((error) => {
      console.log("error", error);
      toast.error(error.message);
    });
}

function GoogleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log("res", result);
      toast.success("Login Successful");
      Firestore.createUsersInFirestore(
        result.user.uid,
        result.user.displayName,
        result.user.email,
        result.user.photoURL
      );

      window.localStorage.setItem(
        "userDetails",
        JSON.stringify(auth.currentUser)
      );
    })
    .catch((error) => {
      console.log("error", error);
      const credential = GoogleAuthProvider.credentialFromError(error);
      toast.error(error.message);
    });
}
function CurrentUser() {
  console.log("auth", auth);
  return auth.currentUser;
}
export {
  SpotifyFbLogin,
  firebaseConfig,
  AppUserCreation,
  AppUserLogin,
  AppSignOut,
  GoogleLogin,
  CurrentUser,
};
