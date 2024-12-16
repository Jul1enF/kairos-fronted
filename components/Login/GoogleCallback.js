import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userInfo, userSkill } from '../../reducers/user';
import { useRouter } from 'next/router'

import { jwtDecode } from "jwt-decode";


function GoogleCallback() {
  const dispatch = useDispatch();

  const router = useRouter()

  const {jwtToken} = router.query

  const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

  const user = useSelector((state)=>state.user.value)
  console.log("USER :", user)

useEffect(()=>{
  if (jwtToken){

    const userInfos = jwtDecode(jwtToken, "532194944428-bdp7tfdlrv8crcolkhh3dl0h7hpqtoq0");

    console.log("userInfos :",userInfos)

    dispatch(userInfo(userInfos))

    if (userInfos.skills.length >=1) {
      dispatch(userSkill({ legal: userInfos.skills[0].legalScore, commerce: userInfos.skills[0].commerceScore }))
  } else {
      dispatch(userSkill({legal: 0, commerce: 0 }))
  }

    router.push('/dashboard')
  }


},[jwtToken])

  // useEffect(() => {
  //   const fetchUserData = () => {
  //     fetch(`${url}/users/api/me`, { 
  //       method: 'GET',
  //       credentials: 'include',
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         console.log(data)
  //         if (data.error) {
  //           // Gérer les erreurs d'authentification ici
  //           console.error('Authentication failed:', data.error);
  //         } else {

  //           //Met à jour le token utilisateur
  //           fetch(`${url}/users/update`, {
  //             method: 'PUT',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({token: data.token, email: data.email})
  //           })
  //             .then(response => response.json())
  //             .then(data => {
  //               console.log(data)
  //             })
  //           // Dispatch des informations de l'utilisateur et du token dans Redux
  //           dispatch(userInfo({
  //             token: data.token,
  //             name: data.name,
  //             email: data.email,
  //           }));
  //           // Rediriger vers le tableau de bord
  //           window.location.href = `${process.env.NEXT_PUBLIC_FRONT_ADDRESS}/dashboard`
  //         }
  //       })

  //   };

  //   fetchUserData();
  // }, [dispatch]);

  return (
    <div>
      <p>Authentification en cours...</p>
    </div>
  );
}

export default GoogleCallback;
