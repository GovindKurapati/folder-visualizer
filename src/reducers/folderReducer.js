import { combineReducers } from "redux";
import { v4 as uuid } from "uuid";

const INITIAL_FOLDER_STATE = {
  folders: [
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
    {
      id: uuid(),
      name: "Folder6",
      parentId: "Folder4",
      location: "/Folder1/Folder3/Folder4/Folder6",
    },
  ],
  currentFolder: {},
  subFolders: [],
  subFolderChild: [],
  parentFolders: [],
};

const folderReducer = (state = INITIAL_FOLDER_STATE, action) => {
  if (action.type === "FIND_FOLDER_BY_NAME") {
    let currentFolder = state.folders.find((f) => f.name === action.payload);
    console.log("FRom reducer", currentFolder);

    if (!currentFolder) {
      return state;
    }

    let subFolders = state.folders.filter((f) => f.parentId === action.payload);

    let subFolderNames = subFolders.map((f) => f.name);
    let subFolderChildArr = [];
    //to fetch all child folders
    while (subFolderNames.length > 0) {
      let arr = [];
      for (let i = 0; i < state.folders.length; i++) {
        if (subFolderNames.indexOf(state.folders[i].parentId) > -1) {
          arr.push(state.folders[i]);
        }
      }
      subFolderChildArr = [...subFolderChildArr, ...arr];
      subFolderNames = arr.map((f) => f.name);
    }

    let subFolderChild = [...subFolderChildArr];

    //parentFolder
    let parentId = currentFolder.parentId;
    let parentArr = [];
    if (parentId) {
      let result = null;
      let parentFolder = {};
      while (result === null) {
        parentFolder = state.folders.find((f) => f.name === parentId);
        parentArr.push(parentFolder);
        result = parentFolder.parentId === null ? 1 : null;
        parentId = parentFolder.parentId;
      }
    }
    parentArr = parentArr.reverse();
    let parentFolders = [...parentArr];
    console.log(currentFolder, subFolders, subFolderChild, parentFolders);
    return {
      folders: state.folders,
      currentFolder,
      subFolders,
      subFolderChild,
      parentFolders,
    };
  }
  if (action.type === "ADD_FOLDER") {
    return {
      ...state,
      folders: [...state.folders, action.payload],
      subFolders: [...state.subFolders, action.payload],
    };
  }
  return state;
};

const reducers = combineReducers({
  folderReducer,
});

export default reducers;
