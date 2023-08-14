import {Component} from "react";
import HistoryIcon from '@mui/icons-material/History';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CasinoIcon from '@mui/icons-material/Casino';
import {NewSectionItem} from "./NewSectionItem";
import List from "@mui/material/List";
import "./NewSectionMenu.scss";

export class NewSectionMenu  extends Component {

    sections = [
        {
            "name": "Background",
            "icon": HistoryIcon,
            "type": "background",
        },
        {
            "name": "Scope List",
            "icon": ChecklistIcon,
            "type": "scope-list",
        },
        {
            "name": "Risks",
            "icon": CasinoIcon,
            "type": "risks",
        },
    ]

    render() {
        return  <List className={"new-section-menu"}>
            {
                this.sections.map((section) => {
                    return <NewSectionItem section={section} key={section.name}/>
                })
            }
        </List>;
    }
}
