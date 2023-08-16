import { Component } from "react";
import "./TopBar.scss";


export class TopBar extends Component {

    render() {
        return <div className={"top-bar"}>

            <div className={"logo-area"}>
                <span className={"logo-text"}>ScopeBerry</span>

                <div className={"logo-image"}>
                    <img src={"/logo.png"} alt={"logo"} className={"logo-image"}/>
                </div>
            </div>

        </div>
    }
}
