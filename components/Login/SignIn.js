import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch} from 'react-redux';
import { login } from '../../reducers/user';

import styles from '../../styles/SignIn.module.css';

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false)
    const [passwordFormatError, setPasswordFormatError] = useState(false)

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    //Reducer 
    const dispatch = useDispatch();

    // Page Redirection 
    const router = useRouter();

    //Check to verify the URL of the previous page
    const referrer = router.referrer

    const handleSubmit = () => {
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8}$/; => // Tout decomenter une fois les test ok

        // Reset errors 
        setEmailError(false);
            // setPasswordFormatError(false);
    
        // Validate password and email format
        if (!EMAIL_REGEX.test(email)) {
            setEmailError(true)
            return;
        }
        /*if (!PASSWORD_REGEX.test(password)) {
            setPasswordFormatError(true);
        }*/

            fetch(`${url}/users/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password }),
            }).then(response => response.json())
            .then(data => {
                data.result && dispatch(login({token: data.token, email: data.user.email }))
                if (referrer.includes('/result')) {
                    router.push('/result')
                } else {
                    router.push('/dashboard')
                }
            })
      }
      const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/users/auth/google';
      };
    return (
        <div className={styles.container}>
          <h3 className={styles.title}>Connexion</h3>
            <div className={styles.divGoogle}>
                <button className={styles.buttonGoogle} onClick={handleGoogleLogin}>Se connecter avec Google</button> 
            </div>
            <div className={styles.connexion}>
                <input 
                    type="email" 
                    className={styles.input} 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    placeholder="Adresse mail" />
                    {emailError && <p className={styles.error}>Email non conforme</p>}
                <input 
                    type="password" 
                    className={styles.input} 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password} 
                    placeholder="Mot de passe" />
            </div>
          <button className={styles.button} onClick={() => handleSubmit()}>Je me connecte</button>
        </div>
      )
}

export default SignIn;