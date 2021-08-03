const addFolder = (folder) => {
  return {
    type: "ADD_FOLDER",
    payload: folder,
  };
};

export default addFolder;
