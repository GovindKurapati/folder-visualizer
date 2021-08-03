import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import React, { useState } from "react";
import Folder from "./components/Folder";
import mainFolder from "./images/main-folder.png";
import titleIcon from "./images/title-folder.png";
import ErrorBoundary from "./components/ErrorBoundary";
import { useSelector } from "react-redux";

const App = () => {
  const folders = useSelector((state) => state.folderReducer.folders);
  return (
    <div className="App">
      <p className="titleName">
        Folder <img src={titleIcon} width="30px" alt="title-icon" /> Visualizer
      </p>

      <Router>
        {/* for rendering root folders */}
        <div className="mainFolderParentWrapper">
          {folders.map((folder) => {
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
              <Folder />
            </ErrorBoundary>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
