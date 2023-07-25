import { Component } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddBoxIcon from '@mui/icons-material/AddBox';
import './MainMenu.css';


export class MainMenu extends Component {

    render() {
        return <List className={"main-menu"}>
            <ListItem key={"1"} disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <AddBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Create New Plan"} />
                </ListItemButton>
            </ListItem>
        </List>


    }
}
