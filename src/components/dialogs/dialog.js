import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DynamicDialog({data, openDialog, setOpenDialog, onYes}) {

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={()=>setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {data.title}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
            {data.msg}
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>onYes()} autoFocus>
            yes
          </Button>
          <Button onClick={()=>setOpenDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}