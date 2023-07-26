import { Component } from "react";
import TextField from '@mui/material/TextField';
import "./GeneralInformation.scss";
import { getCompletion } from "../components/api";
import { GeneralInformationQuestion } from "./GeneralInformationQuestion";


export class GeneralInformation extends Component {
    state = {
        questions: [],
        answers: {},
        projectDescription: "",
    }

    componentDidMount() {

    }

    writeProjectDescriptionPrompt() {
        let text = `${this.state.projectDescription}\n`

        this.state.questions.forEach((question, questionIndex) => {
            text += `${this.state.answers[questionIndex]}\n`;
        });

        return text;
    }

    requestNewQuestion() {
        const prompt = "Write me a single question that you would ask to better understand the following project:\n\n\"" + this.writeProjectDescriptionPrompt() + "\"\n";
        getCompletion(prompt).then((result) => {
            this.setState({
                questions: [
                    ...this.state.questions,
                    {
                        questionText: result.result
                    }
                ]
            })
        });
    }

    onProjectDescriptionChanged(newValue) {
        this.setState({
            projectDescription: newValue
        }, () => {
            if (this.state.projectDescription.trim()) {
                this.requestNewQuestion()
            }
        });
    }

    onQuestionAnswerChanged(questionIndex, newValue) {
        const newAnswers = {
            ...this.state.answers,
            [questionIndex]: newValue,
        };

        this.setState({answers: newAnswers}, () => {
            if (newValue.trim()) {
                this.requestNewQuestion()
            }
        });
    }


    render() {
        return <div className={"general-information-page"}>
            <div className={"general-information-question-group general-information-header-area"}>
                <div className={"general-information-question-editor-area"}>

                </div>
                <div className={"general-information-question-tips-area"}>
                    <div className={"general-information-question-tips-header"}>
                        <span>Tips</span>
                    </div>
                </div>
            </div>
            <GeneralInformationQuestion
                question={"Describe your project"}
                placeholder={"Project Description"}
                tips={[
                    "Keep it to 1-2 sentences",
                ]}
                onChangeValue={(newValue) => this.onProjectDescriptionChanged(newValue)}
            />
            {
                this.state.questions.map((questionInfo, questionInfoIndex) =>
                    <GeneralInformationQuestion
                        key={questionInfoIndex}
                        question={questionInfo.questionText}
                        placeholder={"Question"}
                        onChangeValue={(newValue) => this.onQuestionAnswerChanged(questionInfoIndex, newValue)}
                        tips={[]}
                    />
                )
            }

        <div className={"general-information-question-group general-information-bottom-area"}>
            <div className={"general-information-question-editor-area"}>

            </div>
            <div className={"general-information-question-tips-area"}>

            </div>
        </div>
    </div>;
    }

}