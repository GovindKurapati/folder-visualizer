import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import React, { useState } from "react";
import Folder from "./components/Folder";
import { v4 as uuid } from "uuid";
import mainFolder from "./images/main-folder.png";
import titleIcon from "./images/title-folder.png";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const [folderStructure, setfolderStructure] = useState([
    {
      id: 1,
      name: "Folder1",
      parentId: null,
      location: "/Folder1",
    },
    {
      id: 2,
      name: "Folder2",
      parentId: "Folder5",
      location: "/Folder1/Folder5/Folder2",
    },
    {
      id: 3,
      name: "Folder3",
      parentId: "Folder1",
      location: "/Folder1/Folder3",
    },
    {
      id: 4,
      name: "Folder4",
      parentId: "Folder3",
      location: "/Folder1/Folder3/Folder4",
    },
    {
      id: 5,
      name: "Folder5",
      parentId: "Folder1",
      location: "/Folder1/Folder5",
    },
  ]);

  // adding a new folder to the state
  const addNewFolderHandler = (folder) => {
    setfolderStructure((prevState) => [...prevState, folder]);
  };

  return (
    <div className="App">
      <p className="titleName">
        Folder <img src={titleIcon} width="30px" alt="title-icon" /> Visualizer
      </p>

      <Router>
        {/* for rendering root folders */}
        <div className="mainFolderParentWrapper">
          {folderStructure.map((folder) => {
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
          <Route path={`/:id`}>
            <ErrorBoundary>
              <Folder
                folders={folderStructure}
                addFolder={addNewFolderHandler}
              />
            </ErrorBoundary>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
