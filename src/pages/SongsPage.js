import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState, useContext  } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { collection, doc, addDoc, getDocs, deleteDoc, setDoc, where, query, writeBatch, getDocsFromCache  } from "firebase/firestore";
import { db } from '../firebase/firebase';

import { generatePushID } from '../utils/generateFirebaseID';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import DynamicDialog from '../components/dialogs/dialog';

import { UserContext } from '../context/auth';

// sections
import { DynamicListHead, DynamicListToolbar } from '../sections/@dashboard/dynamicTable';

import { transpose } from '../components/highlighter'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'key', label: 'Key', alignRight: false },
  { id: 'capo', label: 'Capo', alignRight: false },
  { id: 'artist', label: 'Artist/Band', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'lyrics', label: 'Lyrics', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SongsPage() {

  const { isSync } = useContext(UserContext);  

  const { filter, type } = useParams();

  const [allSongs, setallSongs] = useState([]);

  const [filteredSongs, setfilteredSongs] = useState([]);

  const [open, setOpen] = useState(null);

  
  const [page, setPage] = useState(0);
  
  const [order, setOrder] = useState('asc');
  
  const [selected, setSelected] = useState([]);
  
  const [orderBy, setOrderBy] = useState('name');
  
  const [filterName, setFilterName] = useState('');
  
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState({title:'',msg:''});
  const [selectedID, setSelectedID] = useState('');
  const [action, setAction] = useState('delete');
  const [sessionArtists, setsessionArtists] = useState([]);
  const [newSongName, setNewSongName] = useState('');
  const [newSongKey, setNewSongKey] = useState('');
  const [newSongCapo, setNewSongCapo] = useState(0);
  const [newSongArtist, setNewSongArtist] = useState(0);
  const [newSongType, setNewSongType] = useState("Contemporary");
  const [newSongLyrics, setNewSongLyrics] = useState('');
  // const [onYes, setOnYes] = useState(false);

  const [syncingOnline, setsyncingOnline] = useState(false)
  const [toSyncLater, settoSyncLater] = useState([])

  

  useEffect(() => {
    if(type !== null)
      fetch()
  }, [type,filter])


  useEffect(() => {
    async function getA(){
      console.log("GETTING ARTISTS...");

      const docRef = collection(db, "artists");
      try {

          await getDocsFromCache(docRef).then((querySnapshot)=>{              
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));

                console.log('cached Artists: ', newData);
                setsessionArtists(newData);                
            })

      } catch (e) {
        console.log("Error getting cached document:", e);
      }
    }
      getA()
  }, [])
  

  const fetch = async () => {
    let q = collection(db, "songs")
    if(type !== undefined || filter !== undefined){

      let newType = type

      switch (newType) {
        case "artist":
          newType = "artist.name"
          setNewSongArtist(sessionArtists.findIndex(a=>a.name === filter))
          break;
        case "type":
          setNewSongType(filter)
          break;
      
        default:
          break;
      }

      q = query(collection(db, "songs"), where(newType, "==", filter))
    }
    await getDocs(q, { includeMetadataChanges: true })
        .then((querySnapshot)=>{              
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));
                setallSongs(newData);                
        })
  }
  
 
  useEffect(() => {
    if(allSongs.length > 0){
      setfilteredSongs(applySortFilter(allSongs, getComparator(order, orderBy), filterName))
    }
  }, [allSongs,order,orderBy,filterName])

  useEffect(() => {
    async function handleSyncing(){
      await setsyncingOnline(true)
      await fetch()
      await setsyncingOnline(false)
      await settoSyncLater([])
    }
    if(isSync){
      handleSyncing()
    }
  }, [isSync])
  
  useEffect(() => {
    if(toSyncLater.length > 0){
      const batch = writeBatch(db);

      console.log(toSyncLater);
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < toSyncLater.length; index++) {
        const el = toSyncLater[index];
        switch (el._handle_action) {
          case "new":
            batch.set(doc(db,'songs', el.id), {
              name:el.name,
              key:el.key,
              capo:el.capo,
              type:el.type,
              artist:el.artist,
              lyrics: el.lyrics
            })
            break;
          case "update":
            batch.update(doc(db,'songs', el.id), {
              name:el.name,
              key:el.key,
              capo:el.capo,
              type:el.type,
              artist:el.artist,
              lyrics: el.lyrics
            })
            break;
          case "delete":
            batch.delete(doc(db,'songs', el.id))
            break;
          default:
            break;
        }
      }

      if(isSync){
        batch.commit()
        // fetch()
      }

    }
  }, [toSyncLater, isSync])


  const add = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "songs"), data);
        console.log("Document written with ID: ", docRef.id);
        fetch()
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }
  
  const remove = async (id) => {
         
    await deleteDoc(doc(db, "songs", id))
        .then(()=>{              
            fetch()
        })
   
  }
  
  const update = async (id,data) => {
    const itemRef = doc(db, "songs", id)
    await setDoc(itemRef,data).then(()=>{
      fetch()
    })
  }

 
  const onYes = () =>{
    switch (action) {

      case "batchNew":
        settoSyncLater([...toSyncLater,{
          name:newSongName,
          key:newSongKey,
          capo:newSongCapo,
          type:newSongType,
          artist:sessionArtists[newSongArtist],
          lyrics: newSongLyrics,
          id: generatePushID(),
          _handle_action: 'new'
        }])
        setOpenDialog(false)
        setTimeout(() => {
          setOpenDialog(true)
        }, 300);
        break;

      case "batchUpdate":
        settoSyncLater([...toSyncLater,{
          name:newSongName,
          key:newSongKey,
          capo:newSongCapo,
          type:newSongType,
          artist:sessionArtists[newSongArtist],
          lyrics: newSongLyrics,
          id: selectedID,
          _handle_action: 'update'
        }])
        setOpen(false)
        setOpenDialog(false)
        break;

      case "batchDelete":
        settoSyncLater([...toSyncLater,{id: selectedID, _handle_action: 'delete'}])
        setOpen(false)
        setOpenDialog(false)
        break;

      case "delete":
        remove(selectedID)
        setOpen(false)
        setOpenDialog(false)
        break;

      case "update":
        update(selectedID,{
          name:newSongName,
          key:newSongKey,
          capo:newSongCapo,
          type:newSongType,
          artist:sessionArtists[newSongArtist],
          lyrics: newSongLyrics
        })
        setOpen(false)
        setOpenDialog(false)
        break;
    
      case "new":
        add({
          name:newSongName,
          key:newSongKey,
          capo:newSongCapo,
          type:newSongType,
          artist:sessionArtists[newSongArtist],
          lyrics: newSongLyrics
        })
        setOpen(false)
        setOpenDialog(false)
        break;
    
      default:
        break;
    }
  }


  const Lyrics = ({lyrics}) => (
      <Stack spacing={4} p={2} sx={{minWidth: 350}}>
        <pre id="lyrics" data-key="A" style={{ width: 'auto', height: 300 }}>
          {lyrics.replaceAll("&#13;","\r\n")}
        </pre>
      </Stack>
  )

  const handlePreviewLyrics = async (lyrics) =>{
    await handleDialog('Lyrics', <Lyrics lyrics={lyrics}/> ,"lyrics", true)
    transpose()
  }


  const IfNew = () => (
      <Stack spacing={4} pt={2} sx={{minWidth: 500}}>
        <TextField 
        label="Song Name" 
        variant="outlined" 
        fullWidth 
        onBlur={e=>setNewSongName(e.target.value)}
        />
        <TextField 
        label="Song Key" 
        variant="outlined" 
        fullWidth 
        onBlur={e=>setNewSongKey(e.target.value)}
        />
        <TextField 
        label="Capo" 
        variant="outlined" 
        fullWidth 
        type="number"
        defaultValue={newSongCapo}
        onBlur={e=>setNewSongCapo(e.target.value)}
        />
        <TextField
          select
          label="Artist / Band"
          SelectProps={{
            native: true,
          }}
          defaultValue={newSongArtist}
          onChange={e=>setNewSongArtist(e.target.value)}
        >
          {
            sessionArtists?.map((a,key)=>(
              <option key={key} value={key}>{a.name}</option>
            ))
          }
        </TextField>
        <TextField
          select
          label="Type"
          SelectProps={{
            native: true,
          }}
          defaultValue={newSongType}
          onChange={e=>setNewSongType(e.target.value)}
        >
          <option value="Contemporary">Contemporary</option>
          <option value="Hymns-Classics">Hymns / Classics</option>
        </TextField>
        <textarea style={{minWidth: '100%'}} rows={24} placeholder="Lyrics" onBlur={e=>setNewSongLyrics(e.target.value.replace(/\r?\n/g,"&#13;"))}/>
      </Stack>
  )

  const IfEdit = () => (
    <Stack spacing={4} pt={2} sx={{minWidth: 500}}>
    <TextField 
    label="Song Name" 
    variant="outlined" 
    fullWidth 
    defaultValue={newSongName}
    onBlur={e=>setNewSongName(e.target.value)}
    />
    <TextField 
    label="Song Key" 
    variant="outlined" 
    fullWidth 
    defaultValue={newSongKey}
    onBlur={e=>setNewSongKey(e.target.value)}
    />
    <TextField 
      label="Capo" 
      variant="outlined" 
      fullWidth 
      type="number"
      defaultValue={newSongCapo}
      onBlur={e=>setNewSongCapo(e.target.value)}
      />
    <TextField
      select
      label="Artist / Band"
      defaultValue={newSongArtist}
      SelectProps={{
        native: true,
      }}
      onChange={e=>setNewSongArtist(e.target.value)}
    >
      {
        sessionArtists?.map((a,key)=>(
          <option key={key} value={key}>{a.name}</option>
        ))
      }
    </TextField>
    <TextField
      select
      label="Type"
      defaultValue={newSongType}
      SelectProps={{
        native: true,
      }}
      onChange={e=>setNewSongType(e.target.value)}
    >
      <option value="Contemporary">Contemporary</option>
      <option value="Hymns-Classics">Hymns / Classics</option>
    </TextField>
    <textarea style={{minWidth: '100%'}} rows={24} defaultValue={newSongLyrics.replaceAll("&#13;","\r\n")} placeholder="Lyrics" onBlur={e=>setNewSongLyrics(e.target.value.replace(/\r?\n/g,"&#13;"))}/>
  </Stack>
  )
  

  const handleDialog = (title,msg,type, hidden=false) => {
    if(isSync){
      setAction(type)
    }else{
      setAction(`batch${title}`)
    }
    setDialogData({title,msg,hidden})
    setOpenDialog(true)
  }

  const handleOpenMenu = (event,id, name, key, capo, artist, type, lyrics) => {
    setSelectedID(id)
    setNewSongName(name);
    setNewSongKey(key);
    setNewSongCapo(capo);
    setNewSongArtist(artist);
    setNewSongType(type);
    setNewSongLyrics(lyrics);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allSongs?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allSongs?.length) : 0;

  const isNotFound = !filteredSongs.length && !!filterName;

  return (
    <>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={syncingOnline}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Helmet>
        <title> Songs / Hymns | WorshipHIM </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {filter!== undefined ? filter : "Songs / Hymns"}
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}  onClick={()=>handleDialog('New', <IfNew/>,"new")}>
            New Songs / Hymns
          </Button>
        </Stack>

        <Card>
          <DynamicListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} pageName={filter!== undefined ? filter : "songs / hymns"} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DynamicListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allSongs.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredSongs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, key, capo, artist, type, lyrics } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {key}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {capo}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <Label sx={{cursor: 'pointer'}} color={(artist.type === 'Artist' && 'error') || 'success'}>
                            <Link to={`/dashboard/songs/${artist.name}/artist`}>{`${artist.name} - ${artist.type}`}</Link>
                          </Label>
                        </TableCell>

                        <TableCell align="left">
                          <Label sx={{cursor: 'pointer'}} color={(type === "Contemporary" && 'primary') || 'warning'}>
                            <Link to={`/dashboard/songs/${type}/type`}>{type}</Link>
                          </Label>
                        </TableCell>

                        <TableCell align="left">
                          <Label sx={{cursor: 'pointer'}} color={'info'} onClick={()=>handlePreviewLyrics(lyrics)}>Show</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e)=>handleOpenMenu(e,id, name, key, capo, sessionArtists.findIndex(a=>a.name === artist.name), type, lyrics)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allSongs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={()=>handleDialog('Update', <IfEdit/>,"update")}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={()=>handleDialog('Delete', "Are you sure you want to delete this song? this can't be undone!","delete")}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <DynamicDialog openDialog={openDialog} setOpenDialog={setOpenDialog} data={dialogData} onYes={onYes}/>
    </>
  );
}
