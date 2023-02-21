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
import { collection, doc, addDoc, getDocs, deleteDoc, setDoc, query, where, writeBatch } from "firebase/firestore";
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


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
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


export default function ArtistsPage() {

  const { isSync } = useContext(UserContext);  

  const { type } = useParams();

  const [allArtists, setallArtists] = useState([]);

  const [filteredArtists, setfilteredArtists] = useState([]);

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
  const [newType, setNewType] = useState('Artist');
  const [newArtistName, setNewArtistName] = useState('');
  // const [onYes, setOnYes] = useState(false);
    
  const [syncingOnline, setsyncingOnline] = useState(false)
  const [toSyncLater, settoSyncLater] = useState([])

  const fetch = async () => {
    let q = collection(db, "artists")
    if(type !== undefined){
      switch (type) {
        case "Artist":
          setNewType(type)
          break;
        case "Band":
          setNewType(type)
          break;
        default:
          break;
      }
      q = query(collection(db, "artists"), where("type", "==", type))
    }
    await getDocs(q, { includeMetadataChanges: true }).then((querySnapshot)=>{              
          const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setallArtists(newData);             
    })
  }



  useEffect(() => {
    fetch()
  }, [type])

  
  useEffect(() => {
    if(allArtists.length > 0){
      setfilteredArtists(applySortFilter(allArtists, getComparator(order, orderBy), filterName))
    }
  }, [allArtists,order,orderBy,filterName])

  

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
            batch.set(doc(db,'artists', el.id), {name: el.name, type: el.type})
            break;
          case "update":
            batch.update(doc(db,'artists', el.id), {name: el.name, type: el.type})
            break;
          case "delete":
            batch.delete(doc(db,'artists', el.id))
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
        const docRef = await addDoc(collection(db, "artists"), data);
        console.log("Document written with ID: ", docRef.id);
        fetch()
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }
  
  const remove = async (id) => {
         
    await deleteDoc(doc(db, "artists", id))
        .then(()=>{              
            fetch()
        })
   
  }
  
  const update = async (id,data) => {
    const itemRef = doc(db, "artists", id)
    await setDoc(itemRef,data).then(()=>{
      fetch()
    })
  }


  const onYes = () =>{
    switch (action) {
      case "batchNew":
        settoSyncLater([...toSyncLater,{name:newArtistName, type: newType, id: generatePushID(), _handle_action: 'new'}])
        setOpenDialog(false)
        setTimeout(() => {
          setOpenDialog(true)
        }, 300);
        break;

      case "batchUpdate":
        settoSyncLater([...toSyncLater,{name:newArtistName, type: newType, id: selectedID, _handle_action: 'update'}])
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
        update(selectedID,{id: selectedID,name:newArtistName, type: newType})
        setOpen(false)
        setOpenDialog(false)
        break;
    
      case "new":
        add({id: generatePushID(), name:newArtistName, type: newType})
        setOpen(false)
        setOpenDialog(false)
        break;
    
      default:
        break;
    }
  }


  const IfNew = () => (
      <Stack spacing={4} pt={2} sx={{minWidth: 350}}>
        <TextField 
        label="Artist Name" 
        variant="outlined" 
        fullWidth 
        defaultValue=""
        onBlur={e=>setNewArtistName(e.target.value)}
        />
        <TextField
          select
          label="Type"
          defaultValue={newType}
          SelectProps={{
            native: true,
          }}
          onChange={e=>setNewType(e.target.value)}
        >
            <option value="Artist">Artist</option>
            <option value="Band">Band</option>
        </TextField>
      </Stack>
  )

  const IfEdit = () => (
      <Stack spacing={4} pt={2} sx={{minWidth: 350}}>
        <TextField 
        label="Artist Name" 
        variant="outlined" 
        fullWidth 
        defaultValue={newArtistName}
        onBlur={e=>setNewArtistName(e.target.value)}
        />
        <TextField
          select
          label="Type"
          defaultValue={newType}
          SelectProps={{
            native: true,
          }}
          onChange={e=>setNewType(e.target.value)}
        >
            <option value="Artist">Artist</option>
            <option value="Band">Band</option>
        </TextField>
      </Stack>
  )
  

  const handleDialog = (title,msg,type) => {
    if(isSync){
      setAction(type)
    }else{
      setAction(`batch${title}`)
    }
    setDialogData({title,msg})
    setOpenDialog(true)
  }

  const handleOpenMenu = (event,id,name,type) => {
    setSelectedID(id)
    setNewArtistName(name)
    setNewType(type)
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
      const newSelecteds = allArtists?.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allArtists?.length) : 0;

  const isNotFound = !filteredArtists.length && !!filterName;

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={syncingOnline}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Helmet>
        <title> Artists / Band | WorshipHIM </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {type !== undefined ? type : "Artists / Band"}
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}  onClick={()=>handleDialog('New', <IfNew/>,"new")}>
            New {type !== undefined ? type : "Artists / Band"}
          </Button>
        </Stack>

        <Card>
          <DynamicListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} pageName="artists / band" />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <DynamicListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allArtists.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredArtists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, type } = row;
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
                              <Link to={`/dashboard/artists/${name}/artist`}>{name}</Link>
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          <Label color={(type === 'Artist' && 'error') || 'success'}>
                            <Link to={`/dashboard/artists/${type}`}>{type}</Link>
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e)=>handleOpenMenu(e,id,name,type)}>
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
            count={allArtists.length}
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

        <MenuItem sx={{ color: 'error.main' }} onClick={()=>handleDialog('Delete', `Are you sure you want to delete this ${type !== undefined ? type : "Artists / Band"}? this can't be undone!`,"delete")}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <DynamicDialog openDialog={openDialog} setOpenDialog={setOpenDialog} data={dialogData} onYes={onYes}/>
    </>
  );
}
