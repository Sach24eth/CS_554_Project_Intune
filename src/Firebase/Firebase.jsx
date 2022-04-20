
import {initializeApp} from 'firebase/app'
import {getDatabase} from 'firebase/database'
import {getAuth, signInWithCustomToken, updateEmail, updateProfile} from 'firebase/auth'

export default function Firebase(data) {
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
    const database = getDatabase(app)
    const auth = getAuth(app)
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
}
