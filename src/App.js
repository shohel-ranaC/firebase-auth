//import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] =useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

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
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleFbLogin = ()=>{
    firebase.auth().signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }

  const handleSignOut = ()=>{
     firebase.auth().signOut()
     .then(res => {
       const signedOutUser = {
        isSignedIn: false,
         name: '',
         email: '',
         password: '',
         photo: '',
         error: '',
         success: false
       }
       setUser(signedOutUser);
     })
     .catch(error => {
        console.log(error => error.message);
     });
  }

  const handleBlur = (event)=> {
    let isFormValid = true;
    //console.log(event.target.name, event.target.value);
    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6; 
      const passwordHasNumber = /\d{1}/.test(event.target.value); 
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (event)=> {
    //console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
   firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
   // console.log(res);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('sign in user info', res.user);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
      }

    event.preventDefault();
  }

  const updateUserName = (name) =>{
    const user = firebase.auth().currentUser;

        user.updateProfile({
          displayName: name
        }).then(() => {
          // Update successful
          console.log('User Name Updated successfully');
          // ...
        }).catch((error) => {
          // An error occurred
          console.log(error);
          // ...
        });  
  }
  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>SignOut</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      <br />
      {
        <button onClick={handleFbLogin}>Sign in Using Facebook</button>
      }
      {
        user.isSignedIn && <p> Welcome, {user.name}</p>
      }
      <h1>Your Authentication</h1>
      <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor='newUser'>New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        { newUser && <input type="text" name='name' onBlur={handleBlur} placeholder='Input Your Name' required />}
        <br />
        <input type="email" name='email' onBlur={handleBlur} placeholder='Input Your Email' required />
        <br />
        <input type="password" name='password' onBlur={handleBlur} placeholder='Input Your Password' required />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully !</p>}
      
    </div>
  );
}

export default App;
