import React from 'react';
import { onAuthStateChanged  } from "firebase/auth";
import {auth} from '../firebase/firebase'

export const UserContext = React.createContext();

export default function Auth({children}) {

    const [valid, setvalid] = React.useState(false)
    const [email, setemail] = React.useState('')
    const [name, setname] = React.useState('')

    onAuthStateChanged(auth, (user) => {

        if (user) {
            setname(user.displayName === null ? user.email.split('@')[0].toUpperCase() : user.displayName)
            setemail(user.email)
            setvalid(true)
        } else {
            setname('')
            setemail('')
            setvalid(false)
        }
    
    });

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
