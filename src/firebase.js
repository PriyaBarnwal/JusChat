import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

//copy your own firebase config when you create your application here

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase