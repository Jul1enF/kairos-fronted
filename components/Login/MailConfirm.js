import { useDispatch, useSelector} from 'react-redux';
import { useRouter } from 'next/router';
import { userInfo } from '../../reducers/user';

import styles from '../../styles/MailConfirm.module.css';

function MailConfirm(){
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    // Page Redirection 
    const router = useRouter();

    //Reducer 
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value)
    const search = useSelector((state) => state.search.value);
    console.log(user)

    const handleSubmit = () => {
      console.log("continue click")
        fetch(`${url}/users/info-user`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email : user.email}),
          }).then(response => response.json())
        .then(data => {
          console.log(data)
          if(data.result) { 
            dispatch(userInfo({
              token: data.user.token, 
              email: data.user.email,
              name: data.user.name,
              firstname : data.user.firstname,
              search: data.user.search,
              skills : data.user.skills,
            }))
          
            if (Object.keys(search).length === 0) {
              router.push('/dashboard');
            } else {
              router.push('/result/companies');
             }  
           }
          })
    }
    return(
        <div className={styles.container}>
            <div className={styles.message}>
              <p>Mail vérifié </p>
              <p>Bienvenue!</p>
              <button className={styles.button} onClick={() => handleSubmit()}>Continuer</button>
            </div>
        </div>
        
)
}
export default MailConfirm;