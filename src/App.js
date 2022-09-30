//import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUSer] =useState({
    isSignedIn: 'false',
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn =()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUSer(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOut = ()=>{
     firebase.auth().signOut()
     .then(res => {
       const signedOutUser = {
        isSignedIn: false,
         name: '',
         email: '',
         photo: ''
       }
       setUSer(signedOutUser);
     })
     .catch(error => {
        console.log(error => error.message);
     });
  }
  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>SignOut</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <p> Welcome, {user.name}</p>
      }
      
    </div>
  );
}

export default App;
