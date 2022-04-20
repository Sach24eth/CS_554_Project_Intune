import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import { collection, addDoc, getDocs } from "firebase/firestore"; 

async function Firestore(id, displayName, email, photoURL) {
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
    const db = getFirestore(app)
    console.log('database', db)
    console.log("into da db")
    const querySnapshot = await getDocs(collection(db, "users"));
    //find if data already exists
    let userExists = false;
    querySnapshot.forEach(doc => {
        if (doc.data().id === id) {
            userExists = true;
        }
    }
    )
    if (!userExists) {
        try{
            const docRef = await addDoc(collection(db, "users"), {
                id,
                displayName,
                email,
                photoURL: photoURL==null? 'N/A': photoURL
              });
            console.log("docRef", docRef)
        }catch(error){
            console.log("error", error)
        }
    }
}

export default Firestore