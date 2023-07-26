import { Component } from "react";
import TextField from '@mui/material/TextField';
import "./ProjectOnboarding.css";
import { getCompletion } from "../components/api";


export class ProjectOnboarding extends Component {
    onProjectDescriptionChanged(evt) {
        const newValue = evt.target.value;
        getCompletion(newValue).then((result) => {
            alert(result.result);
        });
    }


    render() {
        return <div className={"project-onboarding"}>
            <div className={"onboarding-question-group"}>
                <span className={"onboarding-question"}>Describe your project:</span>

                <TextField
                    id="outlined-basic"
                    label="Project Description"
                    variant="outlined"
                    className={"onboarding-question-answer"}
                    onBlur={this.onProjectDescriptionChanged}
                />
            </div>
        </div>;
    }

}