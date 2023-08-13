import "./DocumentSection.scss";
import {useDrop} from "react-dnd";
import {DraggableItemTypes} from "../../components/constants";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";



export function DocumentSection(props) {
    return <ListItem key={"1"} disablePadding className={"document-section"}>
        <ListItemIcon className={"document-section-icon"}>
            <props.section.icon sx={{ fontSize: 60 }}></props.section.icon>
        </ListItemIcon>
        <ListItemText primary={props.section.name} />
    </ListItem>;
}

