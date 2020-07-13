import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = require('./firebase-config.json').result.sdkConfig;

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase