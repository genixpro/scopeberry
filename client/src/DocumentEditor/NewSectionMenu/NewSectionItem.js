import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "./NewSectionItem.scss";
import { useDrag } from 'react-dnd';
import { DraggableItemTypes } from "../../components/constants";


export function NewSectionItem(props) {
    const [{isDragging}, drag, dragPreview] = useDrag(() => ({
        type: DraggableItemTypes.SECTION,
        item: props.section,
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging()
            }
        }
    }));

    return <ListItem key={"1"} disablePadding className={"new-section-item"} ref={dragPreview}>
        <ListItemButton className={"new-section-button"} ref={drag}>
            <ListItemIcon className={"new-section-button-icon"}>
                <props.section.icon sx={{ fontSize: 60 }}></props.section.icon>
            </ListItemIcon>
            <ListItemText primary={props.section.name} />
        </ListItemButton>
    </ListItem>;
}
