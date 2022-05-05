import React, { useState, useEffect } from "react";
// import createFileList from "../../../utils/utils";

const Menu = ({ handleMenu, menuItems }) => {
  const [menu, setMenu] = useState([]);

  //   useEffect(() => {
  //     // if data exists then properly set it up
  //     if (menuItems) {
  //       if (JSON.stringify(menu) === JSON.stringify(menuItems))
  //         menuItems.forEach((menuObj, index) => {
  //           document.querySelector(`#menu-bg-image-${index}`).files =
  //             createFileList(menuObj.background_image);
  //           document.querySelector(`#menu-audio-${index}`).files = createFileList(
  //             menuObj.descriptive_audio
  //           );
  //         });
  //       else setMenu(menuItems);
  //     }
  //   }, [menuItems, menu]);

  // add the inital link object to the queue
  const createLink = () => {
    const content = {
      title: "",
      description: "",
      background_image: "",
      descriptive_audio: "",
    };
    handleMenu([...menu, content]);
  };

  // any changes that is made to the input, we should update the state and global values
  const handleMenuSave = (index, type, e) => {
    let old = menu;

    const value =
      type === "title" || type === "description"
        ? e.target.value
        : e.target.files[0]["name"];
    old[index] = { ...old[index], ...{ [type]: value } };

    handleMenu(old);
  };

  return (
    <>
      <div className="pure-controls">
        <button type="button" className="pure-button" onClick={createLink}>
          Create Link
        </button>
      </div>

      {menu.length > 0 && <legend>Menu Link</legend>}

      {menu.map((menuObj, index) => {
        return (
          <React.Fragment key={index}>
            <div className="pure-control-group required">
              <label htmlFor={`menu-title-${index}`}>Menu Link Title</label>
              <input
                type="text"
                id={`menu-title-${index}`}
                placeholder="enter title"
                value={menuObj.title}
                onChange={(e) => handleMenuSave(index, "title", e)}
              />
            </div>

            <div className="pure-control-group required">
              <label htmlFor={`menu-descript-${index}`}>
                Menu Link Description
              </label>
              <input
                type="text"
                id={`menu-descript-${index}`}
                placeholder="enter description"
                value={menuObj.description}
                onChange={(e) => handleMenuSave(index, "description", e)}
              />
            </div>

            <div className="pure-control-group required">
              <label htmlFor={`menu-bg-image-${index}`}>Background Image</label>
              <input
                type="file"
                id={`menu-bg-image-${index}`}
                placeholder="select image"
                accept="image/*"
                onChange={(e) => handleMenuSave(index, "background_image", e)}
              />
            </div>

            <div className="pure-control-group required">
              <label htmlFor={`menu-audio-${index}`}>Descriptive Audio</label>
              <input
                type="file"
                id={`menu-audio-${index}`}
                placeholder="select audio"
                accept="audio/*"
                onChange={(e) => handleMenuSave(index, "descriptive_audio", e)}
              />
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Menu;
