import {useEffect, useState, useContext} from 'react';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// firebase
// eslint-disable-next-line import/no-unresolved
import { collection,  getDocsFromCache,getDocs, loadBundle } from "firebase/firestore";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import { storage, db,  } from '../../../firebase/firebase';

// context
import { UserContext } from '../../../context/auth';

import { generatePushID } from '../../../utils/generateFirebaseID';

export default function UpdateArtistsCDN() {

    const [open, setopen] = useState(false)
    const [progress, setprogress] = useState(0)

    const metaData = {
      cacheControl: 'public,max-age=31536000',
      contentType: 'application/json'
    };   

    const generate = async ()=>{
      setopen(true)
      const artistsRef = ref(storage, `bundles/artists.json`);
      let aString = ''

      await getDocs(collection(db, "artists")).then((querySnapshot)=>{              
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
            aString = JSON.stringify(newData)
      })

      // Upload the file and metadata
      const blobArtists = new Blob([aString], {type: "application/json"})

      const uploadTaskArtists = uploadBytesResumable(artistsRef, blobArtists, metaData)


      uploadTaskArtists.on('state_changed',
      (snapshot) => {
        setprogress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },(error) => {
        setopen(false)
        setprogress(100)
      },
      () => {
          setopen(false)
          alert('Done!')
      });

 

    }

    return (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open && progress !== 100}
          onClick={()=>{}}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Button  variant="contained" color="info" onClick={generate} >Store Artists JSON</Button>
      </>
    );
  }