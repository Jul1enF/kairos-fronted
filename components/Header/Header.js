import React from 'react';
import styles from '../../styles/Header.module.css';
import Burger from './Burger';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

function Header() {
    const router = useRouter();
    const user = useSelector((state) => state.user.value);
    console.log(user)

    const handleSignupClick = () => {
        router.push('/login');
    };

    const isLoginPage = 
        router.pathname === '/login' ||
        router.pathname === '/mail-confirm' ||
        router.pathname === '/new-mail-confirm';

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href='/'>
                        <Image 
                            src='/logo-removebg-preview.png' 
                            id='logo' 
                            alt='Logo'     
                            width={80} 
                            height={80}
                        />
                    </Link>
                </div>
                <h1 className={styles.kairos} id='title' onClick={()=>router.push('/')}>KAIROS</h1>
                <div className={styles.buttonsContainer}>
                    {/* <a className={styles.link} href='/' id='AboutLink'>À Propos</a> */}
                    <div className={styles.headerRight}>
                        {!user.token && !isLoginPage ? (
                            <button onClick={handleSignupClick} className={styles.signUpBtn}>
                                Se connecter
                            </button>
                        ) : (
                            user.token !== null && !isLoginPage && (
                                <div className={styles.info}>
                                    <p>Bienvenue {user.firstname} {user.name}</p>
                                    <Burger />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
