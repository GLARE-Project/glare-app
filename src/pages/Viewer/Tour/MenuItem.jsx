import Modal from "react-modal";
import { useState } from "react";
import { XCircleIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const customStyles = {
  content: {
    padding: "0px",
    background: "transparent",
  },
};

const MenuOverlay = ({
  hotspot,
  children,
  menuModalIsOpen,
  setMenuIsOpen,
  projectId,
  setPage,
}) => {
  const menu = hotspot.main_pages;
  const library = hotspot.media_pages;

  const navigate = useNavigate();

  function closeModal() {
    setMenuIsOpen(false);
  }

  const page = (hotspot) => {
    setPage(hotspot);
    navigate(`/viewer/${projectId}/media/${hotspot.title}`);
  };

  return (
    <>
      <Modal
        isOpen={menuModalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className="z-[99999] h-screen m-auto"
      >
        <div
          onClick={() => setMenuIsOpen(false)}
          className="z-30 bg-white shadow-lg rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-200 p-4 cursor-pointer absolute top-5 right-5"
        >
          <XCircleIcon className="w-10" />
        </div>
        <div className="z-30 my-auto w-full h-full bg-gray-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-40 border border-gray-100 p-10">
          <h2 className="text-[6vw]  md:text-[4vw] uppercase text-center font-bold">
            Menu
          </h2>
          <div className="grid grid-cols-2 gap-6 h-3/4 pt-6">
            <div className="border rounded-lg p-10 flex flex-col gap-4">
              {menu?.map((item) => (
                <div
                  className="border p-4 rounded-lg cursor-pointer"
                  onClick={() => page(item)}
                >
                  <p className="text-lg font-bold">{item.title}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <div className="border rounded-lg p-10 h-4/5">
                <h2 className="font-bold text-xl uppercase">Library</h2>
              </div>
              <div className="border rounded-lg h-1/5"></div>
            </div>
          </div>
        </div>
      </Modal>
      {children}
    </>
  );
};

export default MenuOverlay;
