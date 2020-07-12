import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyCYzI5uHEwvDhtxxjThLh5rzKyLv9X68hw",
  authDomain: "chatting-application-623e8.firebaseapp.com",
  databaseURL: "https://chatting-application-623e8.firebaseio.com",
  projectId: "chatting-application-623e8",
  storageBucket: "chatting-application-623e8.appspot.com",
  messagingSenderId: "525299397993",
  appId: "1:525299397993:web:2ed9a01bacf6077a61f9f8",
  measurementId: "G-8KZTBETPWB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase