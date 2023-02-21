import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState, useContext  } from 'react';
import { useParams, Link } from "react-router-dom";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  Backdrop,
  CircularProgress
} from '@mui/material';

// firebase
import { doc, runTransaction, writeBatch } from "firebase/firestore";
import { db } from '../firebase/firebase';

import { generatePushID } from '../utils/generateFirebaseID';

import { UserContext } from '../context/auth';

// old data
import a from './oldData/Artists.json';
import cL from './oldData/Contemporary Lyrics.json';
import cS from './oldData/Contemporary Song List.json';
import hL from './oldData/Hymns Lyrics.json';
import hS from './oldData/Hymns Song List.json';

const newAAA = [
    {
        "type": "Artist",
        "name": "Laura Story",
        "id": "-NOoB4NG3BaBVYQkohsp"
    },
    {
        "name": "Hymns And Classics",
        "id": "-NOoB4NG5b_6p-XfbaEz",
        "type": "Band"
    },
    {
        "type": "Band",
        "id": "-NOoB4NG5zj-2QrlXpvv",
        "name": "Jesus Culture"
    },
    {
        "type": "Band",
        "id": "-NOoB4NG7I1x5PMtqORw",
        "name": "Faith Music Manila"
    },
    {
        "id": "-NOoB4NG9NydYaa-8y2d",
        "type": "Band",
        "name": "Bethel Worship"
    },
    {
        "id": "-NOoB4NG9b6X94AzunsI",
        "name": "David Crowder",
        "type": "Artist"
    },
    {
        "id": "-NOoB4NGKq3Ii9nryx97",
        "type": "Band",
        "name": "City Harvest Church"
    },
    {
        "name": "7eventh Time Down",
        "id": "-NOoB4NGLVYnFj23azW5",
        "type": "Band"
    },
    {
        "type": "Artist",
        "name": "Jonalyn Viray",
        "id": "-NOoB4NGLYi8YkyeW9mb"
    },
    {
        "name": "Darlene Zschech",
        "type": "Artist",
        "id": "-NOoB4NGNIgAKB6OdEKH"
    },
    {
        "name": "Gary Valenciano",
        "id": "-NOoB4NGNRv5_XOcV8xa",
        "type": "Artist"
    },
    {
        "name": "Citipointe Live",
        "id": "-NOoB4NGV8RO5OycbRIk",
        "type": "Band"
    },
    {
        "name": "For King And Country",
        "type": "Band",
        "id": "-NOoB4NGWd8OfYJ_uInE"
    },
    {
        "name": "Brian Littrell",
        "type": "Artist",
        "id": "-NOoB4NGYUqBsSFUdpoK"
    },
    {
        "id": "-NOoB4NGbKAuFdxPQdie",
        "name": "Gateway Worship",
        "type": "Band"
    },
    {
        "id": "-NOoB4NGiojrj-D4-xxu",
        "name": "Casting Crowns",
        "type": "Band"
    },
    {
        "id": "-NOoB4NGkJvfbJhODJ-f",
        "name": "Elevation Worship",
        "type": "Band"
    },
    {
        "type": "Artist",
        "name": "Israel Houghton",
        "id": "-NOoB4NGnRR3bhMVMY8y"
    },
    {
        "id": "-NOoB4NGqGCQ-Fs0l0-4",
        "type": "Artist",
        "name": "Chris Tomlin"
    },
    {
        "name": "Desperation Band",
        "type": "Band",
        "id": "-NOoB4NGqlS-KJpG7eVJ"
    },
    {
        "id": "-NOoB4NGrt3UUxz3DKDh",
        "name": "Hillsong United",
        "type": "Band"
    },
    {
        "name": "Kari Jobe",
        "id": "-NOoB4NGsnlcv7G0an6-",
        "type": "Artist"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NGtBj9ZVl50gqT",
        "name": "Don Moen"
    },
    {
        "type": "Band",
        "name": "Gloryfall",
        "id": "-NOoB4NGycsbEuW2WLEz"
    },
    {
        "id": "-NOoB4NGyhXSoZe4hr66",
        "type": "Band",
        "name": "Doulos Worship"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NH02jZ6HHd5cAD",
        "name": "Rommel Guevarra"
    },
    {
        "id": "-NOoB4NH0NvJ8z5Xc461",
        "type": "Band",
        "name": "Victory Worship"
    },
    {
        "name": "Tasha Cobbs",
        "type": "Artist",
        "id": "-NOoB4NH0xLvXMOZStuj"
    },
    {
        "name": "The Belonging Co",
        "id": "-NOoB4NH0zsiNBpRaZFt",
        "type": "Band"
    },
    {
        "name": "Lenny Le Blanc",
        "type": "Artist",
        "id": "-NOoB4NH1JGDSqng9C5P"
    },
    {
        "id": "-NOoB4NH8hw7moFk6o7S",
        "name": "Toby Mac",
        "type": "Artist"
    },
    {
        "name": "Sons And Daughters",
        "id": "-NOoB4NH9USAuVyv--cu",
        "type": "Band"
    },
    {
        "name": "Planetshakers",
        "id": "-NOoB4NHAMrbefGmhEdP",
        "type": "Band"
    },
    {
        "id": "-NOoB4NHBc69o6lrQ17N",
        "name": "Matt Redman",
        "type": "Artist"
    },
    {
        "type": "Band",
        "name": "Malayang Pilipino Music",
        "id": "-NOoB4NHCs6_JdFIVhpo"
    },
    {
        "type": "Band",
        "name": "Leeland",
        "id": "-NOoB4NHCx4eSEyGuBgx"
    },
    {
        "name": "Rend Collective",
        "type": "Band",
        "id": "-NOoB4NHDS6L_wfmiqJz"
    },
    {
        "id": "-NOoB4NHEa-I8uSZYUXB",
        "name": "Red Rocks Worship",
        "type": "Band"
    },
    {
        "name": "Papuri Singers",
        "type": "Band",
        "id": "-NOoB4NHFWxkPrnz0PgK"
    },
    {
        "name": "Titus Band",
        "id": "-NOoB4NHI4EKhZtxBxQk",
        "type": "Band"
    },
    {
        "type": "Artist",
        "name": "Paul Baloche",
        "id": "-NOoB4NHKk56evnT-t8Q"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NHNLqtwKoDGP0m",
        "name": "Sinach"
    },
    {
        "id": "-NOoB4NHNcAPAXRmKCmY",
        "type": "Artist",
        "name": "Lauren Daigle"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NHPcMahSyuEmvr",
        "name": "Mack Brock"
    },
    {
        "type": "Band",
        "id": "-NOoB4NHPhwW9YPJKpjL",
        "name": "Vertical Worship"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NHRYR52Ypgez2R",
        "name": "Paul Wilbur"
    },
    {
        "name": "Newsboys",
        "type": "Band",
        "id": "-NOoB4NHTi38pKjFyjtM"
    },
    {
        "id": "-NOoB4NHX0blwWjsK5wm",
        "name": "Lincoln Brewster",
        "type": "Artist"
    },
    {
        "name": "Unspoken",
        "type": "Band",
        "id": "-NOoB4NHaXeevyGPpFQw"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NHb9hFpuTOq4Yw",
        "name": "Phil Wickham"
    },
    {
        "name": "Musikatha",
        "type": "Band",
        "id": "-NOoB4NHd5aoztBlaKMn"
    },
    {
        "name": "UPPERROOM",
        "id": "-NOoB4NHgZq-sfC417X8",
        "type": "Band"
    },
    {
        "type": "Band",
        "id": "-NOoB4NHh9zkp5ZWFBMr",
        "name": "MercyMe"
    },
    {
        "type": "Artist",
        "id": "-NOoB4NHlAfnLv-6F8_z",
        "name": "Tauren Wells"
    },
    {
        "type": "Band",
        "id": "-NOoB4NHlS3MSyDydHVY",
        "name": "New Life Worship"
    },
    {
        "id": "-NOoB4NHlsqOK7YlPJGi",
        "name": "Third Day",
        "type": "Band"
    },
    {
        "name": "Owl City",
        "type": "Band",
        "id": "-NOoB4NHoTZA5SpJ7cCw"
    },
    {
        "type": "Band",
        "id": "-NOoB4NHok-TcEQGm49f",
        "name": "The Juans"
    },
    {
        "type": "Band",
        "name": "Parachute Band",
        "id": "-NOoB4NHq4P2tFRfbAFV"
    },
    {
        "name": "Sidewalk Prophets",
        "id": "-NOoB4NHrcFcJ8WmmMfG",
        "type": "Band"
    },
    {
        "id": "-NOoB4NHy34N-qndJG8h",
        "name": "Zach Williams",
        "type": "Artist"
    }
]

export default function JSONtoFIREBASE() {

  const { isSync } = useContext(UserContext);  
  const { type } = useParams();

  const [artists, setartists] = useState([])
  const [songs, setsongs] = useState([])

  useEffect(() => {

      const c = [...cS];
      const h = [...hS];

      // eslint-disable-next-line no-return-assign
      const oldSongs = [...c.map(c=>({ ...c, type: 'Contemporary' })),...h.map(h=>({ ...h, type: 'Hymns-Classics' }))];
      const oldLyrics = [...cL,...hL];
      const newSongs = [];

      // sort by type
      oldSongs.sort((a, b) => {
        const nameA = a.s_name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.s_name.toUpperCase(); // ignore upper and lowercase


        if ( nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });


    const oldArtists = [...a];
    const newArtists = [];

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < oldArtists.length; index++) {
        const oldA = oldArtists[index];
        const newObj = {};
        newObj.id = generatePushID();
        newObj.name = oldA.a_name;
        newObj.type = "Band";

        newArtists.push(newObj)
    }

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < oldSongs.length; index++) {
        const oldS = oldSongs[index];
        const newObj = {};
        newObj.id = generatePushID();
        // newObj.artist = newArtists.find(oA=>oA.name === oldS.a_name);
        newObj.artist = newAAA.find(oA=>oA.name === oldS.a_name);
        newObj.capo = 0;
        newObj.key = oldS.s_key;
        newObj.lyrics = oldLyrics.find(ol=>ol.s_id === oldS.s_id).s_chordslyrics;
        newObj.name = oldS.s_name;
        newObj.type = oldS.type;

        newSongs.push(newObj)
    }

    setartists(newArtists)
    setsongs(newSongs)

  }, [])

  let lastIndex = 0;
  let batchnum = 1;

  const batchIt = async (data,tbl) =>{


    const limit = 100;
    const max = data.length;
    let curr = 0;
    let callAgain = false;

    try {
        // eslint-disable-next-line consistent-return
        await runTransaction(db, async (transaction) => {

            const test = []
 
            // eslint-disable-next-line no-plusplus
            for (let index = 0; index < max; index++) {
                console.log('loop # ', batchnum);
                const el = data[index];
                transaction.set(doc(db,tbl, el.id),el);
                test.push(el)
                // eslint-disable-next-line no-plusplus
                curr++;
        
                // eslint-disable-next-line no-lonely-if
                if(max > limit && limit === curr){
                    callAgain = true;
                    lastIndex = curr;
                    console.warn(`Added Transaction #${batchnum}`);
                    console.log(test.length,data.slice(curr),data.slice(curr).length,index-1,callAgain);
                    // eslint-disable-next-line no-plusplus
                    batchnum ++;
                    break;
                }else if(max < limit && index === max){
                    console.error('max < limit && index === max');
                    callAgain = false
                }
            }
            
        });
        
        console.error("AWAIT DONE!");

        if(callAgain){
            batchIt(data.slice(lastIndex),tbl, lastIndex)
        }else{
            callAgain = false
            curr = 0;
            batchnum = 1;
            lastIndex = 0;
            console.log("Transaction successfully committed!", max > limit);
        }

        

      } catch (e) {
        alert("Transaction failed",e);
    }

  }


  const groupUp = (data,tbl) =>{

    const batch = writeBatch(db);
    const limit = 100;
    const max = data.length;
    let curr = 0;
    let batchnum = 1;

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < max; index++) {
        const el = data[index];
        batch.set(doc(db,tbl, el.id),el);
        // eslint-disable-next-line no-plusplus
        curr++;

        if(max < limit){
            if(curr === max){
                curr = 0;
                console.warn(`Added Batch${batchnum}`);
                // eslint-disable-next-line no-loop-func
                batch.commit().then(()=>{
                        // eslint-disable-next-line no-plusplus
                        batchnum ++;
                    }
                )
            }
        }else{

            // eslint-disable-next-line no-lonely-if
            if(limit === curr){
                curr = 0;
                // eslint-disable-next-line no-plusplus
                console.warn(`Added Batch${batchnum}`);
                // eslint-disable-next-line no-loop-func
                batch.commit().then(()=>{
                    // eslint-disable-next-line no-plusplus
                    batchnum ++;
                }
            )
            }

        }

    }

    alert('Done!')

  }
  
  return (
    <>
        <Button onClick={()=>groupUp(artists, 'artists')}>Add Artists</Button>
        <Button onClick={()=>batchIt(songs, 'songs')}>Add Songs</Button>
    </>
  );
}
