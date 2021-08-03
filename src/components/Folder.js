import { withRouter, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import folderImg from "../images/sub-folder.png";
import newFolderImg from "../images/new-folder.png";
import searchIcon from "../images/search.png";
import { v4 as uuid } from "uuid";
import "./Folder.css";
import { useDispatch, useSelector, useStore } from "react-redux";
import findFolderByName from "../actions/findFolderByName";
import { store } from "../App";
import addFolder from "../actions/addFolder";

const Folder = (props) => {
  //local states
  const myRef = useRef(null);
  const [newFolder, setnewFolder] = useState("");
  const [addFolderVisibility, setaddFolderVisibility] = useState(false);
  const [searchTxt, setsearchTxt] = useState("");
  const [defaultSearchType, setdefaultSearchType] = useState("This Folder");
  const [searchResults, setsearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  let folderFound = useSelector((state) => {
    return state.folderReducer.currentFolder;
  });

  let subFolderArr = useSelector((state) => {
    return state.folderReducer.subFolders;
  });

  let parentFolderArr = useSelector((state) => {
    return state.folderReducer.parentFolders;
  });
  let subFolderChildArr = useSelector((state) => {
    return state.folderReducer.subFolderChild;
  });

  const folders = useSelector((state) => {
    return state.folderReducer.folders;
  });

  const dispatch = useDispatch();

  useEffect(async () => {
    var urls = props.location.pathname.split("/");
    dispatch(findFolderByName(urls[urls.length - 1]));
  }, [props.location.pathname]);

  useEffect(() => {
    myRef.current.focus();
  }, [addFolderVisibility]);

  const addFolderHandler = () => {
    if (newFolder.length > 0) {
      var newFolderInfo = {
        id: uuid(),
        name: newFolder,
        parentId: folderFound.name,
        location:
          (folderFound.location === "/"
            ? `/${folderFound.name}`
            : folderFound.location) +
          "/" +
          newFolder,
      };
      dispatch(addFolder(newFolderInfo));
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
  };

  const searchHandler = async () => {
    setSearching(true);
    if (searchTxt.length > 0) {
      if (defaultSearchType === "This Folder") {
        await searchThisFolder();
      } else if (defaultSearchType === "App") {
        await searchFolderOnApp();
      } else if (defaultSearchType === "Child Folders") {
        await searchChildFolder();
      }
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
    var searchResult = subFolderArr.filter(
      (e) => e.name.toLowerCase().indexOf(searchTxt) >= 0
    );
    setsearchResults(searchResult);
  };

  const searchFolderOnApp = () => {
    var searchResult = folders.filter(
      (e) => e.name.toLowerCase().indexOf(searchTxt) >= 0
    );
    setsearchResults(searchResult);
  };

  const searchChildFolder = () => {
    var searchResult = subFolderChildArr.filter(
      (e) => e.name.toLowerCase().indexOf(searchTxt) >= 0
    );
    setsearchResults(searchResult);
  };

  const selectSearchElementHandler = (folderObj) => {
    props.history.push(folderObj.location);
    setdefaultSearchType("This Folder");
    setSearching(false);
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
      {!searching && (
        <div className="newFolderHeaderWrapper">
          <div className="pathWrapper">
            {parentFolderArr.map((folder) => {
              return (
                <div key={folder.id} style={{ display: "inline-block" }}>
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
            <button
              className="pathBtn activeFolder"
              onClick={() => {
                props.history.push(folderFound.location);
              }}
            >
              {folderFound.name}
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
        {!searching &&
          subFolderArr.map((e) => {
            return (
              <Link className="linkTxt" key={e.id} to={`${url}/${e.name}`}>
                <div className="folderInfo">
                  <img src={folderImg} width="50px" />
                  <p className="folderName">{e.name}</p>
                </div>
              </Link>
            );
          })}
        {(subFolderArr.length === 0 ||
          (searchResults.length === 0 && searching)) && (
          <p className="fallbackTxt">No folders present</p>
        )}

        {searching && searchResults.length > 0
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
          : null}
      </div>
    </div>
  );
};

export default withRouter(Folder);
