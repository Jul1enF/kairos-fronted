import styles from '../../styles/Search.module.css';
import { useState, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSearch } from '../../reducers/search';
import { addIdOfASearch } from '../../reducers/user';
import { convertStringApeToCode } from '../../modules/convertingFunctions';
import { AutoComplete, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import codesAndStringsApe from '../../datas/codesApeActivities'
import ActivitiesTable from './ActivitiesTable';
import { useRouter } from 'next/router'

function Search() {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state) => state.user.value)
    const search = useSelector((state) => state.search.value)

    const [vw, setVw] = useState(1);
    const [vh, setVh] = useState(1);

    // useLayoutEffect pour setter (avant l'affichage de la page) des états ayant besoin que les composants aient été montés
    useLayoutEffect(() => {
        setVw(window.innerWidth / 100);
        setVh(window.innerHeight / 100)
    }, []);

    // États reliés aux inputs

    const [activityTypped, setActivityTypped] = useState('')
    const [locationTypped, setLocationTypped] = useState('')

    // État/condition pour afficher proposition d'aide et modale

    const [isHelpVisible, setIsHelpVisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    // Variables engistrant les listes nécessaires à l'affichage des propositions d'autocomplete

    const activitiesList = codesAndStringsApe.map(e => {
        return e = { value: e.description }
    })

    const [locationsList, setLocationsList] = useState([])


    // Fonction appelée quand on clique sur recherche

    const searchClick = () => {

        const codeApe = convertStringApeToCode(activityTypped)
        let token
        user.token ? token = true : token = false
        const email = user.email

        console.log("Code ape :", codeApe)
        console.log("Activity typped :", activityTypped)

        if (!codeApe) { return }
        const locationSplit = locationTypped.split(', ')
        let locationWithoutSpace = locationSplit[0].replace(/ /g, '-')
        let postcode
        if (locationSplit.length > 0) {
            postcode = locationSplit[1]
        }

        // Vérification si présence Paris, Marseille ou Lyon et dans ce cas envoie du codepostal pour recherche arrondissement

        const regexMarseille = /marseille/i
        const regexParis = /paris/i
        const regexLyon = /lyon/i

        if (regexMarseille.test(locationWithoutSpace)) {
            locationWithoutSpace = "Marseille"
        }
        if (regexParis.test(locationWithoutSpace)) {
            locationWithoutSpace = "Paris"
        }
        if (regexLyon.test(locationWithoutSpace)) {
            locationWithoutSpace = "Lyon"
        }

        fetch(`${url}/searches/newSearch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                city: locationWithoutSpace,
                nafCode: codeApe,
                token,
                email,
                postcode,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("DATA :", data)
                dispatch(addSearch(data.result))
                // À rechecker en faisant un console log de user dans result
                if (data.searchForeignKey) { dispatch(addIdOfASearch(data.searchForeignKey)) }
                //console.log(user)
                router.push('/result/companies')
            })
    }


    // Fonction appelée en tapant du texte dans 'Secteur Géographique' pour fetch api adresse et remplir la liste de l'autoComplete

    const locationTextChange = async (locationSearched) => {
        if (locationSearched.length < 3) {
            setLocationsList([])
            return
        }
        else {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${locationSearched}&type=municipality`)
            const data = await response.json()
            setLocationsList(data.features.map((e, i) => {
                return {
                    value: `${e.properties.name}, ${e.properties.postcode}`,

                }
            }))
        }
    }

    // Fonction pour proposer d'afficher le tableau des activités si les caractères tapés ne correspondent à aucune d'entre elles

    const checkListMatch = (characters) => {
        if (characters.length < 3) { return setIsHelpVisible(false) }
        const regex = new RegExp(characters, 'i')
        const isThereAnyMatch = activitiesList.some(e => regex.test(e.value))
        //console.log(isThereAnyMatch)
        !isThereAnyMatch ? setIsHelpVisible(true) : setIsHelpVisible(false)
    }

    let helpStyle
    isHelpVisible ? helpStyle = { display: "flex" } : helpStyle = { display: "none" }

    // Fonction envoyé en props pour changer Search via ActivitiesTable en Inverse Data Flow

    function getTableActivity(activity) {
        setActivityTypped(activity)
        setIsModalVisible(false)
        setIsHelpVisible(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.searchContainer}>
                <p className={styles.text}>“C’est quoi le statut d’entrepreneur individuel ? Est ce que j’ai des concurrents ?”<br></br>
                    <span className={styles.titleText}>Difficile de se lancer ?<br></br><span className={styles.title}>KAIROS </span>est fait pour vous !</span></p>
            </div>
            <div className={styles.formContainer}>
                <Modal
                    onCancel={() => {
                        setIsModalVisible(false)
                        setActivityTypped('')
                        setIsHelpVisible(false)
                    }
                    }
                    open={isModalVisible}
                    footer={null} styles={{ content: { backgroundColor: 'white' } }}
                    closeIcon={<CloseOutlined style={{ color: "black" }} />}
                >
                    <ActivitiesTable getTableActivity={getTableActivity} />
                </Modal>
                <div className={styles.form}>
                    <div className={styles.activities}>
                        <label htmlFor="activity">Activité</label>
                        <AutoComplete
                            options={activitiesList}
                            style={vw > 9 ? { width: "25vw", height: "6vh" } : {width: "40vw", height: "6vh"}}
                            filterOption="true"
                            onSelect={item => setActivityTypped(item)}
                            value={activityTypped}
                        >
                            <input type='text' id='activity' placeholder="Restauration traditionelle, Coiffure..." onChange={(e) => {
                                checkListMatch(e.target.value)
                                setActivityTypped(e.target.value)
                            }}
                                value={activityTypped}></input>
                        </AutoComplete>
                        <p className={styles.helpSentence} style={helpStyle}>
                            Aucune activité trouvée. <span className={styles.buttonHelp} onClick={() => setIsModalVisible(true)}>Besoin d'aide ?</span>
                        </p>
                    </div>
                    <div className={styles.locations}>
                        <label htmlFor="location">Commune</label>
                        <AutoComplete
                            options={locationsList}
                            style={vw > 9 ? { width: "25vw", height: "6vh" } : {width: "40vw", height: "6vh"}}
                            filterOption="true"
                            onSelect={item => setLocationTypped(item)}

                        >
                            <input type='text' id='location' placeholder='Ville...'
                                onChange={(e) => {
                                    setLocationTypped(e.target.value)
                                    locationTextChange(e.target.value)
                                }}
                                value={locationTypped}></input>
                        </AutoComplete>
                    </div>

                </div>
                <button className={styles.btnSearch} id='btnSearch' onClick={() => searchClick()}>Rechercher</button>
                <img src='/Image_Pasted_at_2024-8-5_14-22-removebg-preview.png' alt='Arrow-Down' />
            </div>
        </div>
    );
}

export default Search;