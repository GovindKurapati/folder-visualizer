import {
  withRouter,
  Link,
  Route,
  Switch,
  Redirect,
  useRouteMatch,
} from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import folderImg from "../images/sub-folder.png";
import newFolderImg from "../images/new-folder.png";
import searchIcon from "../images/search.png";
import { v4 as uuid } from "uuid";
import "./Folder.css";

const Folder = (props) => {
  const myRef = useRef(null);

  const [folder, setfolder] = useState({
    id: "",
    name: "",
    location: "",
    parentId: "",
  });
  const [subFolder, setsubFolder] = useState([]);
  const [childFolder, setchildFolder] = useState([]);
  const [parentFolder, setparentFolder] = useState([]);
  const [newFolder, setnewFolder] = useState("");
  const [addFolderVisibility, setaddFolderVisibility] = useState(false);
  const [searchTxt, setsearchTxt] = useState("");
  const [defaultSearchType, setdefaultSearchType] = useState("This Folder");
  const [searchResults, setsearchResults] = useState([]);

  // this.state = {
  //   folder: {},
  //   subFolder: [],
  //   childFolder: [],
  //   parentFolder: [],
  //   newFolder: "",
  //   addFolderVisibility: false,
  //   searchTxt: "",
  //   defaultSearchType: "This Folder",
  //   searchResults: [],
  // };

  // useEffect(() => {
  //   console.log(props);
  //   // await setValues();
  //   // await setChild();
  //   // await setParent();
  //   // await setChildForSubFolder();
  //   console.log(folder);
  // }, []);

  useEffect(() => {
    console.log("🔥🔥🔥🔥🔥🔥");
    async function fetchData() {
      console.log("1");
      await setValues();
      console.log("2");

      await setChild();
      console.log("3");

      await setParent();
      console.log("4");

      await setChildForSubFolder();
      console.log("5");
    }
    fetchData();
    console.log(folder, subFolder, parentFolder);
  }, [props.location.pathname, folder, subFolder, parentFolder]);

  // componentDidMount() {
  //   this.setValues();
  // }

  // async componentDidUpdate(prevProps, prevState) {
  //   var urls = this.props.location.pathname.split("/");
  //   if (
  //     prevState.folder.name !== urls[urls.length - 1] ||
  //     prevProps.folders.length !== this.props.folders.length
  //   ) {
  //     await this.setValues();
  //     await this.setChild();
  //     await this.setParent();
  //     await this.setChildForSubFolder();
  //   }
  // }

  const setValues = async () => {
    var urls = props.location.pathname.split("/");
    var currentFolder = await props.folders.find(
      (f) => f.name === urls[urls.length - 1]
    );
    setfolder({ ...currentFolder });

    console.log(currentFolder, "🥳");
  };

  const setChild = async () => {
    var arr = await props.folders.filter((f) => f.parentId === folder.name);
    setsubFolder([...arr]);
    console.log(props.folders.filter((f) => f.parentId === folder.name));
    console.log(props.folders, folder);
    console.log("inside setchild");
  };

  const setParent = async () => {
    var parentId = folder.parentId;
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
    console.log("inside setparent");
  };

  const setChildForSubFolder = async () => {
    var subFolderNames = await subFolder.map((f) => f.name);
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
    console.log("inside set sub child");
  };

  const addFolderHandler = () => {
    if (newFolder.length > 0) {
      var newFolder = {
        id: uuid(),
        name: newFolder,
        parentId: folder.name,
        location:
          (folder.location === "/" ? `/${folder.name}` : folder.location) +
          "/" +
          newFolder,
      };
      this.props.addFolder(newFolder);
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
    myRef.current.focus();
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
      await setChild();
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
    await setChild();
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

  // var url = this.props.location.pathname;
  return (
    <div className="newFolderContainer">
      {folder.name}
      <Link to="/Folder1/Folder3">Folder3</Link>
      <p>Folder - {JSON.stringify(folder)}</p>
      <p>SubFolders - {JSON.stringify(subFolder)}</p>
      <p>Child for SubFolder - {JSON.stringify(childFolder)}</p>
      <p>Parent-Folder {JSON.stringify(parentFolder)}</p>
    </div>
  );
};

export default withRouter(Folder);
