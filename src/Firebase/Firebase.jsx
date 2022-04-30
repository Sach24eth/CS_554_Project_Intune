
import {initializeApp} from 'firebase/app'
import {getAuth, signInWithCustomToken, updateEmail, updateProfile, signOut, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup
,onAuthStateChanged,
browserLocalPersistence} from 'firebase/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Firestore = require("./Firestore");
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app, {
    persistence: browserLocalPersistence
})
function SpotifyFbLogin(data) {
    
    signInWithCustomToken(auth, data.firebaseToken).then((userCredential) => {
        updateEmail(auth.currentUser, data.userInfo.body.email).then(() => {
            console.log('email updated')

        }).catch((error) => {
            console.log('error', error)
        })
        updateProfile(auth.currentUser, {
            displayName: data.userInfo.body.display_name,

        }).then(() => {
            console.log('display name updated')
            console.log('userCredential', userCredential);
        }
        
        ).catch((error) => {
            console.log('error', error)
        })

    }).catch((error) => {
        console.log("error", error)
    })
    return "SpotifyLogin";
}

function AppUserCreation(data){
    console.log("data", data)
    createUserWithEmailAndPassword(auth, data.email, data.password, data.displayName).then((userCredential) => {
        updateProfile(auth.currentUser, {
            displayName: data.displayName,

        }).then(() => {
            console.log('display name updated')
            console.log('userCredential', userCredential);
        }
        ).catch((error) => {
            console.log('error', error)
        })
        toast.success('Account Created Successfully')
        Firestore.createUsersInFirestore(userCredential.user.uid, userCredential.user.displayName, 
            userCredential.user.email, userCredential.user.photoURL)
            window.localStorage.setItem("userDetails", JSON.stringify(auth.currentUser));
    }).catch((error) => {
        console.log('error', error)
        toast.error(error.message)
    }
    )
}
function AppUserLogin(data){
    signInWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
        
        console.log('userCredential', userCredential);
        toast.success('Login Successful')
        Firestore.createUsersInFirestore(userCredential.user.uid, userCredential.user.displayName,
            userCredential.user.email, userCredential.user.photoURL)
            window.localStorage.setItem("userDetails", JSON.stringify(auth.currentUser));
    }
    ).catch((error) => {
        console.log('error', error)
        toast.error(error.message)
    }
    )
}
function AppSignOut(){
    signOut(auth).then(() => {
        toast.success('Logged Out Successfully')
        setTimeout(() => {
            window.location.href='/'
        }, 700);
    }
    ).catch((error) => {
        console.log('error', error)
        toast.error(error.message)
    }
    )
}

function GoogleLogin(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log('res', result)
        toast.success('Login Successful')
        Firestore.createUsersInFirestore(result.user.uid, result.user.displayName,
            result.user.email, result.user.photoURL)

            window.localStorage.setItem("userDetails", JSON.stringify(auth.currentUser));
    }
    ).catch((error) => {
        console.log('error', error)
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(error.message)
    }
    )
}

export {SpotifyFbLogin, firebaseConfig, AppUserCreation, AppUserLogin, AppSignOut, GoogleLogin, CurrentUser}
