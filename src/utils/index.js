export const handleErrorAuth = (errorCode, setErrorMessage) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      setErrorMessage('Invalid email!');
      return;
    case 'auth/weak-password':
      setErrorMessage('Weak password, at least 6 characters!');
      return;
    case 'auth/wrong-password':
      setErrorMessage('Wrong password!');
      return;
    case 'auth/email-already-in-use':
      setErrorMessage('Email already in use!');
      return;
    case 'auth/user-not-found':
      setErrorMessage('User not found!');
      return;
    default:
      setErrorMessage('Unknown error!');
  }
};
