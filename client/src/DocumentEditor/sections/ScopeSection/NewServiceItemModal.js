import {Component} from "react";
import "./NewServiceItemModal.scss";
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';



export class NewServiceItemModal extends Component {
    state = {}

    options = [
        {
            label: "Penetration Testing",
        },
        {
            label: "Vulnerability Assessment",
        },
        {
            label: "Web Application Security",
        },
        {
            label: "Mobile Application Security",
        }
    ]


    constructor(...args) {
        super(...args);

        this.selectedServiceItem = null;
    }

    handleServiceChange(newServiceItem) {
        this.selectedServiceItem = newServiceItem;
    }

    handleCloseButtonClicked() {
        if (this.props.handleClose) {
            this.props.handleClose();
        }
    }
    handleAddButtonClicked() {
        if (this.selectedServiceItem) {
            this.props.handleAddServiceItem(this.selectedServiceItem);
        }
    }

    render() {

        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.handleClose} classes={{paper: "new-service-item-dialog"}}>
                    <DialogTitle>Configure your Service</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please select the service you want to add to your project
                        </DialogContentText>
                        <Autocomplete
                            disablePortal
                            id="service-selector"
                            options={this.options}
                            renderInput={(params) => <TextField {...params} label="Service" />}
                            onChange={(evt, value) => this.handleServiceChange(value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCloseButtonClicked()}>Cancel</Button>
                        <Button onClick={(evt) => this.handleAddButtonClicked()}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


