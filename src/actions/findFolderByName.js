const findFolderByName = (folderName) => {
  return {
    type: "FIND_FOLDER_BY_NAME",
    payload: folderName,
  };
};

export default findFolderByName;
