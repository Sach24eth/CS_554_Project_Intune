import {initializeApp} from 'firebase/app'
import {getFirestore, updateDoc, doc} from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { toast } from 'react-toastify';
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


async function createUsersInFirestore(id, displayName, email, photoURL) {
    let userDetails ={}
    console.log('database', db)
    const querySnapshot = await getDocs(collection(db, "users"));
    //find if data already exists
    let userExists = false;
    querySnapshot.forEach(doc => {
        if (doc.data().id === id) {
            userExists = true;
            userDetails= doc.data();
        }
    }
    )
    if (!userExists) {
        try{
            const docRef = await addDoc(collection(db, "users"), {
                id,
                displayName,
                email,
                photoURL: photoURL==null? 'N/A': photoURL,
                genres: [],
              });

            console.log("docRef", docRef)
            
            setTimeout(() => {
                window.location.href='/genres'
            }, 700);
        }catch(error){
            console.log("error", error)
        }
    }else{
        console.log(userDetails,"userDetails")
        if(userDetails.genres.length===0){
            setTimeout(() => {
                window.location.href='/genres'
            }, 700);
        }else{
            setTimeout(() => {
                window.location.href='/home'
            }, 700);
        }
    }
}

async function updateGenre(genreList){ 
    const auth = getAuth(app);
    const user = auth.currentUser;
    console.log("user", user)
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach(docm => {
        if (docm.data().id === user.uid) {
            console.log("doc", docm)  
            const userRef = doc(db, "users", docm.id);
             updateDoc(userRef, {
                genres: genreList
            }).then(() => {
               
                console.log('genre updated')
                setTimeout(() => {
                    window.location.href='/home'
                }, 700);
            }
            ).catch((error) => {
                console.log('error', error)
            }
            )
        }
    }
    )
}

export {createUsersInFirestore, updateGenre}