import './App.css';
import { GeneralInformation } from "../GeneralInformation/GeneralInformation";
import { MainMenu } from "../menu/MainMenu";
import { TopBar } from "../menu/TopBar";


function App() {
  return (
    <div className="App">
        <TopBar />
        <div className={"below-top-bar"}>
            <div className={"left-side-bar"}>
                <MainMenu />
            </div>

            <div className={"main-content-area"}>
                <GeneralInformation />
            </div>
        </div>
    </div>
  );
}

export default App;
