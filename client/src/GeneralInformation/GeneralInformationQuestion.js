import { Component } from "react";
import TextField from '@mui/material/TextField';
import "./GeneralInformation.scss";


export class GeneralInformationQuestion extends Component {
    onInputBlur(evt) {
        if (this.props.onChangeValue) {
            this.props.onChangeValue(evt.target.value.toString());
        }
    }

    onInputKeyEnter(evt) {
        if (evt.key === "Enter" || evt.keyCode === 13) {
            evt.target.blur();
            // this.props.onChangeValue(evt.target.value.toString());
        }
    }

    render() {
        return <div className={"general-information-question-group"}>
                <div className={"general-information-question-editor-area"}>
                    <span className={"general-information-question"}>{this.props.question}</span>

                    <TextField
                        id="outlined-basic"
                        label={this.props.placeholder}
                        variant="outlined"
                        className={"general-information-question-answer"}
                        onBlur={(evt) => this.onInputBlur(evt)}
                        onKeyDown={(evt) => this.onInputKeyEnter(evt)}
                    />
                </div>
                <div className={"general-information-question-tips-area"}>
                    <div className={"general-information-question-tips-header"}>

                    </div>
                    <ul className={"general-information-question-tip-list"}>
                        {
                            (this.props.tips || []).map((tipText) =>
                                    <span className={"general-information-question-tip"}>
                                        {tipText}
                                    </span>
                            )
                        }
                    </ul>
                </div>
                <div className={"general-information-question-overlay"} />
            </div>
    }
}