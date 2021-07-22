<div className="searchContainer">
  <div className="inputWrapper">
    <img src={searchIcon} width="20px" alt="search-icon" />
    <input
      type="text"
      // value={this.state.searchTxt}
      // onChange={this.setSearchTxtHandler}
    />
  </div>
  <button
    className="searchBtn"
    // onClick={this.searchHandler}
  >
    Search
  </button>
</div>;
{
  this.state.searchTxt.length > 0 && (
    <div className="searchTypeWrapper">
      <span>Search In:&nbsp;</span>
      <button
      // onClick={this.searchTypeSelectHandler}
      // className={
      //   this.state.defaultSearchType === "App"
      //     ? "activeSearchType"
      //     : "inactiveSearchType"
      // }
      >
        App
      </button>
      <button
      // onClick={this.searchTypeSelectHandler}
      // className={
      //   this.state.defaultSearchType === "This Folder"
      //     ? "activeSearchType"
      //     : "inactiveSearchType"
      // }
      >
        This Folder
      </button>
      <button
      // onClick={this.searchTypeSelectHandler}
      // className={
      //   this.state.defaultSearchType === "Child Folders"
      //     ? "activeSearchType"
      //     : "inactiveSearchType"
      // }
      >
        Child Folders
      </button>
    </div>
  );
}
{
  this.state.defaultSearchType === "This Folder" && (
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
          <button className="addFolderBtn" onClick={this.addFolderHandler}>
            Add Folder
          </button>
        </div>
      </div>
    </div>
  );
}
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
</div>;
