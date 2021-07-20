import { withRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import React, { Component } from "react";
import folderImg from "../images/sub-folder.png";
import newFolderImg from "../images/new-folder.png";
import searchIcon from "../images/search.png";
import { v4 as uuid } from "uuid";
import "./Folder.css";

class Folder extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.state = {
      folder: {},
      subFolder: [],
      childFolder: [],
      parentFolder: [],
      newFolder: "",
      addFolderVisibility: false,
      searchTxt: "",
      defaultSearchType: "This Folder",
      searchResults: [],
    };
  }

  componentDidMount() {
    this.setValues();
  }

  async componentDidUpdate(prevProps, prevState) {
    var urls = this.props.location.pathname.split("/");
    if (
      prevState.folder.name !== urls[urls.length - 1] ||
      prevProps.folders.length !== this.props.folders.length
    ) {
      await this.setValues();
      await this.setChild();
      await this.setParent();
      await this.setChildForSubFolder();
    }
  }

  async setValues() {
    var urls = this.props.location.pathname.split("/");
    this.setState({
      folder: this.props.folders.find((f) => f.name === urls[urls.length - 1]),
    });
  }

  async setChild() {
    var arr = this.props.folders.filter(
      (f) => f.parentId === this.state.folder.name
    );

    this.setState({
      subFolder: arr,
    });
  }

  async setParent() {
    var parentId = this.state.folder.parentId;
    var arr = [];
    if (parentId) {
      var result = null;
      var parentFolder = {};
      while (result === null) {
        parentFolder = this.props.folders.find((f) => f.name === parentId);
        arr.push(parentFolder);
        result = parentFolder.parentId === null ? 1 : null;
        parentId = parentFolder.parentId;
      }
    }
    this.setState({
      parentFolder: arr.reverse(),
    });
  }

  async setChildForSubFolder() {
    var subFolderNames = this.state.subFolder.map((f) => f.name);
    var resultArr = [];
    //to fetch all child folders
    while (subFolderNames.length > 0) {
      var arr = [];
      for (var i = 0; i < this.props.folders.length; i++) {
        if (subFolderNames.indexOf(this.props.folders[i].parentId) > -1) {
          arr.push(this.props.folders[i]);
        }
      }
      resultArr = [...resultArr, ...arr];
      subFolderNames = arr.map((f) => f.name);
    }
    this.setState({
      childFolder: resultArr,
    });
  }

  addFolderHandler = () => {
    if (this.state.newFolder.length > 0) {
      var newFolder = {
        id: uuid(),
        name: this.state.newFolder,
        parentId: this.state.folder.name,
        location:
          (this.state.folder.location === "/"
            ? `/${this.state.folder.name}`
            : this.state.folder.location) +
          "/" +
          this.state.newFolder,
      };
      this.props.addFolder(newFolder);
      //resetting
      this.setState({
        newFolder: "",
        addFolderVisibility: !this.state.addFolderVisibility,
      });
    }
  };

  inputNewFolder = (e) => {
    this.setState({
      newFolder: e.target.value,
    });
  };

  onClickNewFolderIcon = () => {
    this.setState({
      addFolderVisibility: !this.state.addFolderVisibility,
    });
    //focus the add folder input
    this.myRef.current.focus();
  };

  searchHandler = async () => {
    if (this.state.searchTxt.length > 0) {
      if (this.state.defaultSearchType === "This Folder") {
        await this.searchThisFolder();
      } else if (this.state.defaultSearchType === "App") {
        await this.searchFolderOnApp();
      } else if (this.state.defaultSearchType === "Child Folders") {
        await this.searchChildFolder();
      }
    } else {
      //this block of code is when user clears after first search and starts search again in "This Folder".
      //first time search will filter the original array.
      //so that is resetted after each search.
      await this.setChild();
    }
  };

  setSearchTxtHandler = (e) => {
    this.setState({
      searchTxt: e.target.value,
    });
  };

  searchTypeSelectHandler = (e) => {
    //generic type
    this.setState({
      defaultSearchType: e.target.innerText,
    });
  };

  searchThisFolder = async () => {
    await this.setChild();
    var searchResult = this.state.subFolder.filter(
      (e) => e.name.toLowerCase().indexOf(this.state.searchTxt) >= 0
    );
    this.setState({
      subFolder: searchResult,
    });
  };

  searchFolderOnApp = () => {
    var searchResult = this.props.folders.filter(
      (e) => e.name.toLowerCase().indexOf(this.state.searchTxt) >= 0
    );
    this.setState({
      searchResults: searchResult,
    });
  };

  searchChildFolder = () => {
    var searchResult = this.state.childFolder.filter(
      (e) => e.name.toLowerCase().indexOf(this.state.searchTxt) >= 0
    );
    this.setState({
      searchResults: searchResult,
    });
  };

  //experimenting
  //not used currently
  // urlPathClipper = (folderName) => {
  //   var currentUrl = this.props.location.pathname.substring(1);
  //   if (currentUrl.includes(folderName)) {

  //     var splitUrlArr = currentUrl.split("/");

  //     splitUrlArr = splitUrlArr.splice(0, splitUrlArr.indexOf(folderName));
  //     var modifiedUrl =
  //       splitUrlArr.length > 1
  //         ? "/" + splitUrlArr.join("/") + `/${folderName}`
  //         : `/${folderName}`;
  //     // this.props.history.push(`${modifiedUrl}`);
  //     return modifiedUrl;
  //   }
  // };

  selectSearchElementHandler = (folderObj) => {
    this.props.history.push(folderObj.location);
    this.setState({
      defaultSearchType: "This Folder",
      searchResults: [],
    });
  };

  render() {
    var url = this.props.location.pathname;
    return (
      <div className="newFolderContainer">
        <div className="searchContainer">
          <div className="inputWrapper">
            <img src={searchIcon} width="20px" alt="search-icon" />
            <input
              type="text"
              value={this.state.searchTxt}
              onChange={this.setSearchTxtHandler}
            />
          </div>
          <button className="searchBtn" onClick={this.searchHandler}>
            Search
          </button>
        </div>
        {this.state.searchTxt.length > 0 && (
          <div className="searchTypeWrapper">
            <span>Search In:&nbsp;</span>
            <button
              onClick={this.searchTypeSelectHandler}
              className={
                this.state.defaultSearchType === "App"
                  ? "activeSearchType"
                  : "inactiveSearchType"
              }
            >
              App
            </button>
            <button
              onClick={this.searchTypeSelectHandler}
              className={
                this.state.defaultSearchType === "This Folder"
                  ? "activeSearchType"
                  : "inactiveSearchType"
              }
            >
              This Folder
            </button>
            <button
              onClick={this.searchTypeSelectHandler}
              className={
                this.state.defaultSearchType === "Child Folders"
                  ? "activeSearchType"
                  : "inactiveSearchType"
              }
            >
              Child Folders
            </button>
          </div>
        )}
        {this.state.defaultSearchType === "This Folder" && (
          <div className="newFolderHeaderWrapper">
            <div className="pathWrapper">
              {this.state.parentFolder.map((folder) => {
                return (
                  <div key={folder.id} style={{ display: "inline-block" }}>
                    {/* <Link
                    to={`${this.urlPathClipper(folder.name)}/${folder.name}`}
                  >
                    {folder.name}
                  </Link> */}
                    <button
                      className="pathBtn"
                      onClick={() => {
                        this.props.history.push(folder.location);
                      }}
                    >
                      {folder.name}
                    </button>
                    <span>&nbsp; &gt; &nbsp;</span>
                  </div>
                );
              })}
              {/* <Link
              to={`${this.urlPathClipper(this.state.folder.name)}/${
                this.state.folder.name
              }`}
            >
              {this.state.folder.name}
            </Link> */}
              <button
                className="pathBtn activeFolder"
                onClick={() => {
                  this.props.history.push(this.state.folder.location);
                }}
              >
                {this.state.folder.name}
              </button>
            </div>
            <div className="addNewFolderWrapper">
              <img
                src={newFolderImg}
                width="30px"
                onClick={this.onClickNewFolderIcon}
                alt="new-folder"
              />
              <div
                className={
                  this.state.addFolderVisibility === true
                    ? "showAddFolder"
                    : "hideAddFolder"
                }
              >
                <input
                  className="addFolderInput"
                  value={this.state.newFolder}
                  onChange={this.inputNewFolder}
                  type="text"
                  ref={this.myRef}
                ></input>
                <button
                  className="addFolderBtn"
                  onClick={this.addFolderHandler}
                >
                  Add Folder
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="foldersWrapper">
          {this.state.defaultSearchType === "This Folder" &&
            this.state.subFolder.map((e) => {
              return (
                <Link className="linkTxt" key={e.id} to={`${url}/${e.name}`}>
                  <div className="folderInfo">
                    <img src={folderImg} width="50px" />
                    <p className="folderName">{e.name}</p>
                  </div>
                </Link>
              );
            })}
          {this.state.subFolder.length === 0 && (
            <p className="fallbackTxt">No folders present</p>
          )}

          {
            this.state.defaultSearchType !== "This Folder" &&
            this.state.searchResults.length > 0
              ? this.state.searchResults.map((folder) => {
                  return (
                    <div
                      key={folder.id}
                      className="searchElements"
                      onClick={() => {
                        this.selectSearchElementHandler(folder);
                      }}
                    >
                      <div className="folderInfo">
                        <img src={folderImg} width="50px" />
                        <p className="folderName">{folder.name}</p>
                      </div>
                    </div>
                  );
                })
              : null
            // <p>No folders found</p>
            //TODO:
            //fallback for empty search results
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Folder);
