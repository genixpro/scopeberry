import './App.scss';
import { GeneralInformation } from "../GeneralInformation/GeneralInformation";
import { DocumentEditor } from "../DocumentEditor/DocumentEditor";
import { MainMenu } from "../menu/MainMenu";
import { TopBar } from "../menu/TopBar";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

function App() {
  return (
      <DndProvider backend={HTML5Backend}>
            <div className="App">
                <TopBar />
                <div className={"below-top-bar"}>
                    {/*<div className={"left-side-bar"}>*/}
                    {/*    <MainMenu />*/}
                    {/*</div>*/}

                    <div className={"main-content-area"}>
                        {/*<GeneralInformation />*/}
                        <DocumentEditor />
                    </div>
                </div>
            </div>
      </DndProvider>
  );
}

export default App;
