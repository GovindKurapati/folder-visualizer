import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import React from "react";
import Folder from "./components/Folder";
import { v4 as uuid } from "uuid";
import mainFolder from "./images/main-folder.png";
import titleIcon from "./images/title-folder.png";
import ErrorBoundary from "./components/ErrorBoundary";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      folderStructure: [
        {
          id: uuid(),
          name: "Folder1",
          parentId: null,
          location: "/Folder1",
        },
        {
          id: uuid(),
          name: "Folder2",
          parentId: "Folder5",
          location: "/Folder1/Folder5/Folder2",
        },
        {
          id: uuid(),
          name: "Folder3",
          parentId: "Folder1",
          location: "/Folder1/Folder3",
        },
        {
          id: uuid(),
          name: "Folder4",
          parentId: "Folder3",
          location: "/Folder1/Folder3/Folder4",
        },
        {
          id: uuid(),
          name: "Folder5",
          parentId: "Folder1",
          location: "/Folder1/Folder5",
        },
      ],
    };
  }

  // adding a new folder to the state
  addNewFolderHandler = (folder) => {
    console.log(folder);
    console.log([...this.state.folderStructure, folder]);
    this.setState({
      folderStructure: [...this.state.folderStructure, folder],
    });
    console.log(this.state);
  };

  render() {
    return (
      <div className="App">
        <p className="titleName">
          Folder <img src={titleIcon} width="30px" alt="title-icon" />{" "}
          Visualizer
        </p>

        <Router>
          {/* for rendering root folders */}
          <div className="mainFolderParentWrapper">
            {this.state.folderStructure.map((folder) => {
              if (folder.parentId == null) {
                return (
                  <Link
                    className="linkToSubFolder"
                    to={`/${folder.name}`}
                    key={folder.id}
                  >
                    <div className="mainFolderWrapper">
                      <img
                        className="mainFolderImg"
                        src={mainFolder}
                        alt="main-folder"
                      />
                      <p>{folder.name}</p>
                    </div>
                  </Link>
                );
              }
            })}
          </div>

          <Switch>
            <Route path="/:id">
              <ErrorBoundary>
                <Folder
                  folders={this.state.folderStructure}
                  addFolder={this.addNewFolderHandler}
                />
              </ErrorBoundary>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
