import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

firebase.initializeApp({
    apiKey: 'AIzaSyCbX9eN4VLOeic75Tag_F67i6-rH2Px8d4',
    authDomain: 'project01-d1257.firebaseapp.com',
    projectId: 'project01-d1257',
});

const OtpLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [user, loading, error] = useAuthState(firebase.auth());

  const handleSendOtp = (e) => {
    e.preventDefault()
    const appVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
      })
      .catch((error) => {
        console.log('=== 3')
        console.log(error);
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    confirmationResult
      .confirm(verificationCode)
      .then((result) => {
        // User successfully verified OTP and logged in
        console.log(result);
      })
      .catch((error) => {
        // An error occurred while verifing OTP
        console.log(error);
      });
  };

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        // User successfully logged out
        console.log('User logged out');
      })
      .catch((error) => {
        // An error occurred while logging out
        console.log(error);
      });
  };

  return (
    <div>
      <h2>OTP Login</h2>
      <form onSubmit={handleSendOtp}>
      <label for="html">Example: +923123456789</label><br/>
      <input
        type="text"
        required
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button type="submit" >Send OTP</button>
      </form>

      {confirmationResult && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="number"
            required
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {user && <><p>Logged in as: {user.phoneNumber}</p> <br/>
       <button onClick={handleLogout}>Logout</button></>
      }

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default OtpLogin;
