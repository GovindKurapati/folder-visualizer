import { withRouter, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import folderImg from "../images/sub-folder.png";
import newFolderImg from "../images/new-folder.png";
import searchIcon from "../images/search.png";
import { v4 as uuid } from "uuid";
import "./Folder.css";

const Folder = (props) => {
  const myRef = useRef(null);

  const [folder, setfolder] = useState({});
  const [subFolder, setsubFolder] = useState([]);
  const [childFolder, setchildFolder] = useState([]);
  const [parentFolder, setparentFolder] = useState([]);
  const [newFolder, setnewFolder] = useState("");
  const [addFolderVisibility, setaddFolderVisibility] = useState(false);
  const [searchTxt, setsearchTxt] = useState("");
  const [defaultSearchType, setdefaultSearchType] = useState("This Folder");
  const [searchResults, setsearchResults] = useState([]);

  useEffect(async () => {
    const currentFolder = await setValues();
    const childArr = await setChild(currentFolder);
    await setParent(currentFolder);
    await setChildForSubFolder(childArr);
  }, [props.location.pathname, props.folders]);

  useEffect(() => {
    myRef.current.focus();
  }, [addFolderVisibility]);

  const setValues = async () => {
    var urls = props.location.pathname.split("/");
    var currentFolder = await props.folders.find(
      (f) => f.name === urls[urls.length - 1]
    );
    setfolder({ ...currentFolder });

    return currentFolder;
  };

  const setChild = async (currentFolder) => {
    var arr = await props.folders.filter(
      (f) => f.parentId === currentFolder.name
    );
    setsubFolder([...arr]);
    return arr;
  };

  const setParent = async (currentFolder) => {
    var parentId = currentFolder.parentId;
    var arr = [];
    if (parentId) {
      var result = null;
      var parentFolder = {};
      while (result === null) {
        parentFolder = await props.folders.find((f) => f.name === parentId);
        arr.push(parentFolder);
        result = parentFolder.parentId === null ? 1 : null;
        parentId = parentFolder.parentId;
      }
    }
    arr = arr.reverse();
    setparentFolder([...arr]);
  };

  const setChildForSubFolder = async (childArr) => {
    var subFolderNames = await childArr.map((f) => f.name);
    var resultArr = [];
    //to fetch all child folders
    while (subFolderNames.length > 0) {
      var arr = [];
      for (var i = 0; i < props.folders.length; i++) {
        if (subFolderNames.indexOf(props.folders[i].parentId) > -1) {
          arr.push(props.folders[i]);
        }
      }
      resultArr = [...resultArr, ...arr];
      subFolderNames = arr.map((f) => f.name);
    }
    setchildFolder([...resultArr]);
  };

  const addFolderHandler = () => {
    if (newFolder.length > 0) {
      var newFolderInfo = {
        id: uuid(),
        name: newFolder,
        parentId: folder.name,
        location:
          (folder.location === "/" ? `/${folder.name}` : folder.location) +
          "/" +
          newFolder,
      };
      props.addFolder(newFolderInfo);
      //resetting
      setnewFolder("");
      setaddFolderVisibility((prevState) => !prevState);
    }
  };

  const inputNewFolder = (e) => {
    setnewFolder(e.target.value);
  };

  const onClickNewFolderIcon = () => {
    setaddFolderVisibility((prevState) => !prevState);
    //focus the add folder input

    // myRef.current.focus();
  };

  const searchHandler = async () => {
    if (searchTxt.length > 0) {
      if (defaultSearchType === "This Folder") {
        await searchThisFolder();
      } else if (defaultSearchType === "App") {
        await searchFolderOnApp();
      } else if (defaultSearchType === "Child Folders") {
        await searchChildFolder();
      }
    } else {
      //this block of code is when user clears after first search and starts search again in "This Folder".
      //first time search will filter the original array.
      //so that is resetted after each search.
      await setChild(folder);
    }
  };

  const setSearchTxtHandler = (e) => {
    setsearchTxt(e.target.value);
  };

  const searchTypeSelectHandler = (e) => {
    //generic type
    setdefaultSearchType(e.target.innerText);
  };

  const searchThisFolder = async () => {
    await setChild(folder);
    var searchResult = subFolder.filter(
      (e) => e.name.toLowerCase().indexOf(searchTxt) >= 0
    );
    setsubFolder(searchResult);
  };

  const searchFolderOnApp = () => {
    var searchResult = props.folders.filter(
      (e) => e.name.toLowerCase().indexOf(searchTxt) >= 0
    );
    setsearchResults(searchResult);
  };

  const searchChildFolder = () => {
    var searchResult = childFolder.filter(
      (e) => e.name.toLowerCase().indexOf(searchTxt) >= 0
    );
    setsearchResults(searchResult);
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

  const selectSearchElementHandler = (folderObj) => {
    props.history.push(folderObj.location);
    setdefaultSearchType("This Folder");
    setsearchResults([]);
  };

  var url = props.location.pathname;
  return (
    <div className="newFolderContainer">
      <div className="searchContainer">
        <div className="inputWrapper">
          <img src={searchIcon} width="20px" alt="search-icon" />
          <input type="text" value={searchTxt} onChange={setSearchTxtHandler} />
        </div>
        <button className="searchBtn" onClick={searchHandler}>
          Search
        </button>
      </div>
      {searchTxt.length > 0 && (
        <div className="searchTypeWrapper">
          <span>Search In:&nbsp;</span>
          <button
            onClick={searchTypeSelectHandler}
            className={
              defaultSearchType === "App"
                ? "activeSearchType"
                : "inactiveSearchType"
            }
          >
            App
          </button>
          <button
            onClick={searchTypeSelectHandler}
            className={
              defaultSearchType === "This Folder"
                ? "activeSearchType"
                : "inactiveSearchType"
            }
          >
            This Folder
          </button>
          <button
            onClick={searchTypeSelectHandler}
            className={
              defaultSearchType === "Child Folders"
                ? "activeSearchType"
                : "inactiveSearchType"
            }
          >
            Child Folders
          </button>
        </div>
      )}
      {defaultSearchType === "This Folder" && (
        <div className="newFolderHeaderWrapper">
          <div className="pathWrapper">
            {parentFolder.map((folder) => {
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
                      props.history.push(folder.location);
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
                props.history.push(folder.location);
              }}
            >
              {folder.name}
            </button>
          </div>
          <div className="addNewFolderWrapper">
            <img
              src={newFolderImg}
              width="30px"
              onClick={onClickNewFolderIcon}
              alt="new-folder"
            />
            <div
              className={
                addFolderVisibility === true ? "showAddFolder" : "hideAddFolder"
              }
            >
              <input
                className="addFolderInput"
                value={newFolder}
                onChange={inputNewFolder}
                type="text"
                ref={myRef}
              ></input>
              <button className="addFolderBtn" onClick={addFolderHandler}>
                Add Folder
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="foldersWrapper">
        {defaultSearchType === "This Folder" &&
          subFolder.map((e) => {
            return (
              <Link className="linkTxt" key={e.id} to={`${url}/${e.name}`}>
                <div className="folderInfo">
                  <img src={folderImg} width="50px" />
                  <p className="folderName">{e.name}</p>
                </div>
              </Link>
            );
          })}
        {subFolder.length === 0 && (
          <p className="fallbackTxt">No folders present</p>
        )}

        {
          defaultSearchType !== "This Folder" && searchResults.length > 0
            ? searchResults.map((folder) => {
                return (
                  <div
                    key={folder.id}
                    className="searchElements"
                    onClick={() => {
                      selectSearchElementHandler(folder);
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
};

export default withRouter(Folder);
