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

    chooseNextQuestionPrompt() {
        if (this.state.questions.length === 0) {
            return "Given the following project as context:\n\n\"" + this.writeProjectDescriptionPrompt() + "\"\nProvide a chain of reasoning, then write a single question that you would ask to better understand the above project?\nChain of Reasoning: [insert chain of reasoning here].\n\nQuestion:\n [insert question here]";
        } else if (this.state.questions.length === 1) {
            return "Given the following project as context:\n\n\"" + this.writeProjectDescriptionPrompt() + "\"\nProvide a chain of reasoning, then rewrite the following question in the context of this project:\nWho is on the team performing this project?\n\nQuestion:\nQuestion:\n [insert question here]";
        } else if (this.state.questions.length === 2) {
            return "Given the following project as context:\n\n\"" + this.writeProjectDescriptionPrompt() + "\"\nProvide a chain of reasoning, then rewrite the following question in the context of this project:\nWhen does the project need to be completed?\n\nQuestion:\nQuestion:\n [insert question here]";
        } else if (this.state.questions.length === 3) {
            return "Given the following project as context:\n\n\"" + this.writeProjectDescriptionPrompt() + "\"\nProvide a chain of reasoning, then rewrite the following question in the context of this project:\nHow is the project going to get done?\n\nQuestion:\nQuestion:\n [insert question here]";
        } else {
            return "Given the following project as context:\n\n\"" + this.writeProjectDescriptionPrompt() + "\"\nProvide a chain of reasoning, then rewrite the following question in the context of this project:\nWhy is the project being done?\n\nQuestion:\nQuestion:\n [insert question here]";
        }
    }

    requestNewQuestion() {
        const prompt = this.chooseNextQuestionPrompt();
        getCompletion(prompt).then((result) => {
            let text = result.result;
            const questionPlaceholder = "Question:";
            if (text.indexOf(questionPlaceholder) !== -1) {
                text = text.substring(text.lastIndexOf(questionPlaceholder) + questionPlaceholder.length)
            }

            if (text.startsWith("\"")) {
                text = text.substring(1);
            }

            if (text.endsWith("\"")) {
                text = text.substring(0, text.length - 1);
            }

            this.setState({
                questions: [
                    ...this.state.questions,
                    {
                        questionText: text
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