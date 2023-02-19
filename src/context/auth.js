import React from 'react';
import { onAuthStateChanged  } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import {auth, db} from '../firebase/firebase'

export const UserContext = React.createContext();

export default function Auth({children}) {

    const [valid, setvalid] = React.useState(false)
    const [email, setemail] = React.useState('')
    const [name, setname] = React.useState('')



    React.useEffect(()=>{
        onAuthStateChanged(auth, (user) => {

            if (user) {
                setvalid(true)
                setname(user.displayName === null ? user.email.split('@')[0].toUpperCase() : user.displayName)
                setemail(user.email)     
                
                const fetchArtists = async () => {
                    await getDocs(collection(db, "artists"))
                        .then((querySnapshot)=>{              
                            const newData = querySnapshot.docs
                                .map((doc) => ({...doc.data(), id:doc.id }));
                                sessionStorage.setItem('artists', JSON.stringify(newData))       
                        })
                }
                
                fetchArtists()

            } else {
                setvalid(false)
                setname('')
                setemail('')
            }
        
        });
    },[])

    return (
        <UserContext.Provider value={{
            email,
            setemail,
            name,
            setname,
            valid,
            setvalid
        }}>
        {children}
        </UserContext.Provider>
    )
}
