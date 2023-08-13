import {Component} from "react";
import "./DocumentEditor.scss";
import {NewSectionMenu} from "./NewSectionMenu/NewSectionMenu";
import {DocumentOutline} from "./DocumentOutline/DocumentOutline";


export class DocumentEditor extends Component {
    state = {}

    componentDidMount() {

    }

    render() {
        return <div className={"document-editor-page"}>
            <NewSectionMenu/>
            <DocumentOutline />

        </div>;
    }

}


