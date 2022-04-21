
import {initializeApp} from 'firebase/app'
import {getAuth, signInWithCustomToken, updateEmail, updateProfile, signOut, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
const auth = getAuth(app)
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
    return "hahah";
}

function AppUserCreation(data){
    console.log("data", data)
    createUserWithEmailAndPassword(auth, data.email, data.password, data.displayName).then((userCredential) => {
        userCredential.user.displayName = data.displayName
        toast.success('Account Created Successfully')
        setTimeout(() => {
            window.location.href='/genre'
        }, 700);
        
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
        setTimeout(() => {
            window.location.href='/home'
        }, 700);
        
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

        toast.success('Login Successful')
        setTimeout(() => {
            window.location.href='/home'
        }, 700);
    }
    ).catch((error) => {
        console.log('error', error)
        const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error(error.message)
    }
    )

}
export {SpotifyFbLogin, firebaseConfig, AppUserCreation, AppUserLogin, AppSignOut, GoogleLogin}