import "./DocumentEditor.scss";
import "react-complex-tree/lib/style-modern.css";
import {Component} from "react";
import {DocumentOutline} from "./DocumentOutline/DocumentOutline";
import {NewSectionMenu} from "./NewSectionMenu/NewSectionMenu";
import {ScopeSection} from "./sections/ScopeSection/ScopeSection";


export class DocumentEditor extends Component {
    state = {}

    componentDidMount() {

    }

    render() {
        return <div className={"document-editor-page"}>
            <NewSectionMenu/>
            <DocumentOutline/>
            <ScopeSection/>

        </div>;
    }

}


