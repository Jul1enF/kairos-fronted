import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { userInfo, userSkill } from '../../reducers/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import styles from '../../styles/SignIn.module.css';

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [signinError, setSignInError] = useState(false)
    const [inputType, setInputType] = useState("password")

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    //Reducer 
    const dispatch = useDispatch();

    const search = useSelector((state) => state.search.value)

    // Page Redirection 
    const router = useRouter()

    const showPassword = () => {
        if (inputType === "password") {
            setInputType("text")
        }
        else {setInputType("password")}
    }

    const handleSubmit = () => {
       
        // Reset errors 
        setSignInError(false);
    
        fetch(`${url}/users/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        }).then(response => response.json())
        .then(data => {
            if(data.result){
                console.log(data.user.skills)
                dispatch(userInfo({
                    token: data.user.token, 
                    email: data.user.email, 
                    name: data.user.name, 
                    firstname: data.user.firstname }))
                if (data.user.skills.length >=1) {
                    dispatch(userSkill({ legal: data.user.skills[0].legalScore, commerce: data.user.skills[0].commerceScore }))
                } else {
                    dispatch(userSkill({legal: 0, commerce: 0 }))
                }
                if (Object.keys(search).length === 0) {                
                    router.push('/dashboard')
                } else {
                    router.push('/result/companies')
                } 
                
            }else{
                setSignInError(true)
            }
        })
    }


    const handleGoogleLogin = async () => {
        
    const response = await fetch(`${url}/users/google`, {method:'POST'})
       const data = await response.json()
       location.assign(data.url)
    }

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
                <div className={styles.pwdInputContainer}>
                <input 
                    type={inputType}
                    className={styles.pwdInput} 
                    onChange={(e) => {
                        setPassword(e.target.value)
                        setSignInError(false) 
                    }} 
                    value={password} 
                    placeholder="Mot de passe" />
                { inputType === "password" ? (
                <FontAwesomeIcon className={styles.eyeIcon}
                 icon={faEye} onClick={() => showPassword()}/>) : (
                <FontAwesomeIcon className={styles.eyeIcon} icon={faEyeSlash} onClick={() => showPassword()} />
                )
                }
                </div>
                
            </div>
            {signinError && (<p className={styles.error}>Email ou mot de passe incorrect</p>)}
          <button className={styles.button} onClick={() => handleSubmit()}>Je me connecte</button>
        </div>
      )
}

export default SignIn;