import { Component } from "react";
import TextField from '@mui/material/TextField';
import "./ProjectOnboarding.css";

export class ProjectOnboarding extends Component {




    render() {
        return <div className={"project-onboarding"}>
            <div className={"onboarding-question-group"}>
                <span className={"onboarding-question"}>Describe your project:</span>

                <TextField id="outlined-basic" label="Project Description" variant="outlined" className={"onboarding-question-answer"} />
            </div>
        </div>;
    }

}