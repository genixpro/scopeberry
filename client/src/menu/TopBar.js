import { Component } from "react";
import "./TopBar.css";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';


export class TopBar extends Component {

    render() {
        return <div className={"top-bar"}>

            <div className={"logo-area"}>
                <span className={"logo-text"}>Plan Guru</span>

                <div className={"logo-image"}>
                    <TextSnippetIcon sx={{ fontSize: 40 }}/>
                </div>
            </div>

        </div>
    }
}
