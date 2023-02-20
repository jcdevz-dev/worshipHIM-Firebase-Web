import React from 'react';
import { onAuthStateChanged  } from "firebase/auth";
import { collection, getDocs, disableNetwork, enableNetwork} from "firebase/firestore";
import {auth, db} from '../firebase/firebase'

export const UserContext = React.createContext();

export default function Auth({children}) {

    const [valid, setvalid] = React.useState(false)
    const [email, setemail] = React.useState('')
    const [name, setname] = React.useState('')
    const [isSync, setisSync] = React.useState(false)

    React.useEffect(() => {
        
        async function disableNet(){
            await disableNetwork(db);
        }
        async function enableNet(){
            await enableNetwork(db);
        }
        if(!isSync){
            disableNet()
            console.log("Network disabled!");
        }else{
            enableNet()
            console.log("Network enabled!");
        }
    }, [isSync])
    


    React.useEffect(()=>{
        onAuthStateChanged(auth, (user) => {

            if (user) {
                setvalid(true)
                setname(user.displayName === null ? user.email.split('@')[0].toUpperCase() : user.displayName)
                setemail(user.email)     
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
            setvalid,
            isSync,
            setisSync
        }}>
        {children}
        </UserContext.Provider>
    )
}
