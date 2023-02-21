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
        "id": "-NOoaH5n-Yg_sWeXm89V",
        "type": "Band",
        "name": "Bethel Worship"
    },
    {
        "type": "Band",
        "name": "Malayang Pilipino Music",
        "id": "-NOoaH5n1g9XolTrw_Bq"
    },
    {
        "type": "Artist",
        "id": "-NOoaH5n2fo9qr0e3nve",
        "name": "Mack Brock"
    },
    {
        "type": "Band",
        "name": "Passion Generation Worship Band",
        "id": "-NOoaH5n3LfGN2FEONr7"
    },
    {
        "name": "Jesus Culture",
        "type": "Band",
        "id": "-NOoaH5n3iKduCBs3aHx"
    },
    {
        "type": "Band",
        "id": "-NOoaH5n4YLU0hJaB_-_",
        "name": "Sons And Daughters"
    },
    {
        "id": "-NOoaH5n4sbXPJhgR1zO",
        "name": "Don Moen",
        "type": "Artist"
    },
    {
        "name": "Rend Collective",
        "id": "-NOoaH5n5VuBB-0xq2xg",
        "type": "Band"
    },
    {
        "type": "Band",
        "id": "-NOoaH5n5yDb1ZzSERMp",
        "name": "Sidewalk Prophets"
    },
    {
        "type": "Band",
        "name": "Desperation Band",
        "id": "-NOoaH5n6jdUBCmHUGDQ"
    },
    {
        "name": "The Juans",
        "type": "Band",
        "id": "-NOoaH5n8fDJaAMv-fA6"
    },
    {
        "name": "For King And Country",
        "id": "-NOoaH5n8jlKMShzwwnk",
        "type": "Band"
    },
    {
        "name": "Leeland",
        "type": "Band",
        "id": "-NOoaH5n9LvkQ9eQz6nP"
    },
    {
        "name": "Tasha Cobbs",
        "type": "Artist",
        "id": "-NOoaH5nBCgmf6rgNnns"
    },
    {
        "type": "Band",
        "id": "-NOoaH5nBZbuIc_AA_Bc",
        "name": "City Harvest Church"
    },
    {
        "type": "Band",
        "id": "-NOoaH5nCokspjDI5FjE",
        "name": "The Belonging Co"
    },
    {
        "id": "-NOoaH5nD9P6K4hIl3IK",
        "name": "CeCe Winans",
        "type": "Artist"
    },
    {
        "id": "-NOoaH5nEya7ujvBe3tD",
        "type": "Band",
        "name": "Red Rocks Worship"
    },
    {
        "type": "Band",
        "name": "Gloryfall",
        "id": "-NOoaH5nG6xahtabpPh4"
    },
    {
        "type": "Band",
        "name": "Newsboys",
        "id": "-NOoaH5nHT2dy6_Gvyhh"
    },
    {
        "name": "People And Songs",
        "id": "-NOoaH5nJ9X_ymP7N9OH",
        "type": "Band"
    },
    {
        "id": "-NOoaH5nJTMqojN1NGG2",
        "type": "Artist",
        "name": "David Crowder"
    },
    {
        "id": "-NOoaH5nJq6wfCpYDV8f",
        "name": "Hymns And Classics",
        "type": "Band"
    },
    {
        "id": "-NOoaH5nMP2UdKhzK1kb",
        "name": "Paul Wilbur",
        "type": "Artist"
    },
    {
        "id": "-NOoaH5nMid1ryv08n1T",
        "name": "Laura Story",
        "type": "Artist"
    },
    {
        "name": "Papuri Singers",
        "id": "-NOoaH5nN5DzQ12oaW2c",
        "type": "Band"
    },
    {
        "name": "Elevation Worship",
        "type": "Band",
        "id": "-NOoaH5nPNkCD9LetNZ_"
    },
    {
        "name": "Gary Valenciano",
        "type": "Artist",
        "id": "-NOoaH5nQTqFmkKbnyLx"
    },
    {
        "type": "Artist",
        "id": "-NOoaH5nR0H6JoLiVW09",
        "name": "Paul Baloche"
    },
    {
        "id": "-NOoaH5nRjwGrjlbPaOF",
        "name": "Chris Tomlin",
        "type": "Artist"
    },
    {
        "type": "Band",
        "name": "Citipointe Live",
        "id": "-NOoaH5nTA4JmMDIsXsV"
    },
    {
        "name": "Leon Patillo",
        "id": "-NOoaH5nTzjnivfRIwFp",
        "type": "Artist"
    },
    {
        "type": "Band",
        "id": "-NOoaH5naDloArZq6DHv",
        "name": "Planetshakers"
    },
    {
        "name": "Parachute Band",
        "type": "Band",
        "id": "-NOoaH5naUACj1kkWuM9"
    },
    {
        "type": "Artist",
        "id": "-NOoaH5nc13PFQHl3sFm",
        "name": "Darlene Zschech"
    },
    {
        "id": "-NOoaH5ncR0fwFMVzvPb",
        "name": "Kari Jobe",
        "type": "Artist"
    },
    {
        "name": "Gateway Worship",
        "id": "-NOoaH5nd-i0Z152W1L-",
        "type": "Band"
    },
    {
        "name": "Third Day",
        "type": "Band",
        "id": "-NOoaH5ndhJSN3pBl0IL"
    },
    {
        "name": "Faith Music Manila",
        "id": "-NOoaH5ne2sznFO1-2eo",
        "type": "Band"
    },
    {
        "type": "Band",
        "name": "7eventh Time Down",
        "id": "-NOoaH5neJGuQLItIHDC"
    },
    {
        "type": "Band",
        "name": "Doulos Worship",
        "id": "-NOoaH5neoeCctt5OGWi"
    },
    {
        "name": "Tauren Wells",
        "type": "Artist",
        "id": "-NOoaH5nf6c2R1H1oV_j"
    },
    {
        "id": "-NOoaH5ng7SzOot8pEQy",
        "name": "New Life Worship",
        "type": "Band"
    },
    {
        "id": "-NOoaH5ngPuftJO7AqTW",
        "type": "Band",
        "name": "Casting Crowns"
    },
    {
        "name": "Lauren Daigle",
        "id": "-NOoaH5nhE1Dko3hk4rd",
        "type": "Artist"
    },
    {
        "type": "Artist",
        "id": "-NOoaH5nhKOhuc1llbGD",
        "name": "Matt Redman"
    },
    {
        "type": "Band",
        "name": "MercyMe",
        "id": "-NOoaH5nlj_rxSvDdxch"
    },
    {
        "name": "Brian Littrell",
        "id": "-NOoaH5nmPgYEM9KKhUc",
        "type": "Artist"
    },
    {
        "name": "Lincoln Brewster",
        "id": "-NOoaH5nnqozAHXxpPDL",
        "type": "Artist"
    },
    {
        "id": "-NOoaH5noKQQ0bM0Jw3C",
        "name": "Lenny Le Blanc",
        "type": "Artist"
    },
    {
        "name": "Lorena Matacsil",
        "id": "-NOoaH5noNpRvNuFh6Oq",
        "type": "Artist"
    },
    {
        "name": "Musikatha",
        "type": "Band",
        "id": "-NOoaH5nqmqGH_yPrDQP"
    },
    {
        "id": "-NOoaH5nrnCfgnfyyNlI",
        "type": "Artist",
        "name": "Rommel Guevarra"
    },
    {
        "name": "Jonalyn Viray",
        "id": "-NOoaH5nrrFPn9qX9kvm",
        "type": "Artist"
    },
    {
        "name": "Israel Houghton",
        "type": "Artist",
        "id": "-NOoaH5nsarb3CGGOgAV"
    },
    {
        "id": "-NOoaH5nt2XYTdhadf0m",
        "type": "Band",
        "name": "Hillsong United"
    },
    {
        "type": "Artist",
        "name": "Phil Wickham",
        "id": "-NOoaH5nvEr5APlFpcgC"
    },
    {
        "id": "-NOoaH5nvOkJjY0OuKgp",
        "name": "Luis Baldomaro",
        "type": "Artist"
    },
    {
        "type": "Artist",
        "name": "Cesar Daaca",
        "id": "-NOoaH5nvo0SVG7gXrSR"
    },
    {
        "id": "-NOoaH5nwtG1tx-mg8_5",
        "type": "Artist",
        "name": "Sinach"
    },
    {
        "name": "Audrey Assad",
        "type": "Band",
        "id": "-NOoaH5nxtz-G8jRKtSS"
    },
    {
        "name": "Owl City",
        "type": "Band",
        "id": "-NOoaH5nyu--u2phsi4m"
    },
    {
        "id": "-NOoaH5o6GDbGbulEsnS",
        "type": "Band",
        "name": "We The Kingdom"
    },
    {
        "id": "-NOoaH5o6V0dY5msqpIL",
        "type": "Band",
        "name": "Titus Band"
    },
    {
        "type": "Band",
        "name": "UPPERROOM",
        "id": "-NOoaH5oBogOpqzvMbcO"
    },
    {
        "id": "-NOoaH5oRlRpnOjjXt9S",
        "name": "Victory Worship",
        "type": "Band"
    },
    {
        "id": "-NOoaH5oZ_ClzLNeCFAz",
        "name": "Toby Mac",
        "type": "Artist"
    },
    {
        "type": "Band",
        "id": "-NOoaH5obApbQiJYUxkG",
        "name": "Vertical Worship"
    },
    {
        "type": "Band",
        "name": "Unspoken",
        "id": "-NOoaH5ohYfpdip442u6"
    },
    {
        "name": "Zach Williams",
        "id": "-NOoaH5omM3EtPq80x6M",
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
        newObj.type = newAAA.find(oA=>oA.name === oldA.a_name) ? newAAA.find(oA=>oA.name === oldA.a_name).type : "Band";

        newArtists.push(newObj)
    }

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < oldSongs.length; index++) {
        const oldS = oldSongs[index];
        const newObj = {};
        newObj.id = generatePushID();
        newObj.artist = newArtists.find(oA=>oA.name === oldS.a_name);
        // newObj.artist = newAAA.find(oA=>oA.name === oldS.a_name) ? newAAA.find(oA=>oA.name === oldS.a_name) : newArtists.find(oA=>oA.name === oldS.a_name);
        newObj.capo = 0;
        newObj.key = oldS.s_key;
        newObj.lyrics = (oldLyrics.find(ol=>ol.s_id === oldS.s_id).s_chordslyrics).replaceAll("\n","&#13;");
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


//   const groupUp = (data,tbl) =>{

//     const batch = writeBatch(db);
//     const limit = 100;
//     const max = data.length;
//     let curr = 0;
//     let batchnum = 1;

//     // eslint-disable-next-line no-plusplus
//     for (let index = 0; index < max; index++) {
//         const el = data[index];
//         batch.set(doc(db,tbl, el.id),el);
//         // eslint-disable-next-line no-plusplus
//         curr++;

//         if(max < limit){
//             if(curr === max){
//                 curr = 0;
//                 console.warn(`Added Batch${batchnum}`);
//                 // eslint-disable-next-line no-loop-func
//                 batch.commit().then(()=>{
//                         // eslint-disable-next-line no-plusplus
//                         batchnum ++;
//                     }
//                 )
//             }
//         }else{

//             // eslint-disable-next-line no-lonely-if
//             if(limit === curr){
//                 curr = 0;
//                 // eslint-disable-next-line no-plusplus
//                 console.warn(`Added Batch${batchnum}`);
//                 // eslint-disable-next-line no-loop-func
//                 batch.commit().then(()=>{
//                     // eslint-disable-next-line no-plusplus
//                     batchnum ++;
//                 }
//             )
//             }

//         }

//     }

//     alert('Done!')

//   }
  
  return (
    <>
        <Button onClick={()=>batchIt(artists, 'artists')}>Add Artists</Button>
        <Button onClick={()=>batchIt(songs, 'songs')}>Add Songs</Button>
    </>
  );
}
