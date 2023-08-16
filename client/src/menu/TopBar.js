import { Component } from "react";
import "./TopBar.scss";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';


export class TopBar extends Component {

    render() {
        return <div className={"top-bar"}>

            <div className={"logo-area"}>
                <span className={"logo-text"}>ScopeBerry</span>

                <div className={"logo-image"}>
                    <TextSnippetIcon sx={{ fontSize: 40 }}/>
                </div>
            </div>

        </div>
    }
}
