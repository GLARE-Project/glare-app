import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { Server } from "../../utils/config";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/solid";
import ShortUniqueId from "short-unique-id";
import Menu from "./Menu";
import MapField from "./Map";

const EditProject = ({ user }) => {
  const [project, setProject] = useState({});
  const [hotspots, setHotspots] = useState([]);
  const [hotspot, setHotspot] = useState({
    name: "",
    hotspot_id: "",
    position: null,
    latitude: 0,
    longitude: 0,
    overlay: "",
    virtual_object: "",
    isSubHotspot: false,
    panorama_image: "",
    overlay_size: 10,
    overlay_offset_x: 0,
    overlay_offset_y: 0,
    start_audio: "",
    main_pages: [],
    media_pages: [],
  });
  const [menu, setMenu] = useState([]);
  const { id } = useParams();

  const LongLatStep = 0.0001;

  useEffect(() => {
    const getProject = async () => {
      let response = await api.getDocument(Server.collectionID, id);
      setProject(response);
      console.log(response.hotspots);
      const exisitingHotspots = response.hotspots?.map((h) => JSON.parse(h));
      console.log(exisitingHotspots);
      await setProject({ ...response, hotspots: exisitingHotspots });
      await setHotspots(exisitingHotspots);
      await setHotspot(exisitingHotspots[0]);
    };
    getProject();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      console.log("project update");
      console.log(project);
      const update = async () => {
        await api.updateDocument(
          Server.collectionID,
          id,
          project,
          [`role:all`],
          [`user:${user["$id"]}`]
        );
      };
      update();
    }, 1000);
  }, [project]);

  useEffect(() => {
    const update = hotspots?.map((h) =>
      h.hotspot_id === hotspot.hotspot_id ? hotspot : h
    );

    setHotspots(update);
    const stringHotspots = update?.map((p) => JSON.stringify(p));
    setProject({ ...project, hotspots: stringHotspots });
  }, [hotspot]);

  useEffect(() => {
    setHotspot({ ...hotspot, main_pages: menu });
    console.log(hotspot);
  }, [menu]);

  const saveProject = () => {
    const update = async () => {
      await api.updateDocument(
        Server.collectionID,
        id,
        project,
        [`role:all`],
        [`user:${user["$id"]}`]
      );
    };
    update();
  };

  const updateMedia = (bucket, image, newImage, object) => {
    const split1 = image.split("files/");
    const imageId = split1[1].split("/view");
    console.log(imageId);
    const deleteMedia = async () => {
      await api.deleteMedia(bucket, imageId[0]);
    };

    const response = async () => {
      let newResponse = await api.createMedia(
        bucket,
        newImage,
        [`role:all`],
        [`user:${user["$id"]}`]
      );

      let imageURL = await api.getMedia(bucket, newResponse.$id);
      setProject({ ...project, [object]: imageURL.href });
    };

    response();
    deleteMedia();
  };

  const newMedia = (bucket, media, object) => {
    const upload = async () => {
      let response = await api.createMedia(
        bucket,
        media,
        [`role:all`],
        [`user:${user["$id"]}`]
      );

      let imageURL = await api.getMedia(bucket, response.$id);
      setHotspot({ ...hotspot, [object]: imageURL.href });
    };
    upload();
  };

  const selectHotspot = (innerHotspot) => {
    setHotspot(innerHotspot);
    setMenu(innerHotspot.main_pages);
  };

  const handleChange = (objectName, value) => {
    // set the new answer value
    const newAnswer = { ...hotspot, ...{ [objectName]: value } };
    console.log(newAnswer);
  };

  const uid = new ShortUniqueId({ length: 6 });

  const createHotspot = () => {
    const newHotspot = {
      // location related
      name: "",
      hotspot_id: uid(),
      position: null,
      latitude: 0,
      longitude: 0,
      overlay: "",
      virtual_object: "",
      isSubHotspot: false,
      // VR related
      panorama_image: "",
      overlay_size: 10,
      overlay_offset_x: 0,
      overlay_offset_y: 0,
      // audio related
      start_audio: "",
      // the links
      main_pages: [],
      // the library
      media_pages: [],
    };
    setHotspot(newHotspot);
    setHotspots([...hotspots, newHotspot]);
    console.log(newHotspot.hotspot_id);
  };

  const newMenuItem = () => {
    const menuItem = {
      title: "New Menu Item",
      description: "",
      background_image: "",
      descriptive_audio: "",
      menu_id: uid(),
    };

    setMenu([...menu, menuItem]);
  };

  const updateMenu = (key, value, object) => {
    setMenu((current) =>
      current.map((obj) => {
        if (obj.menu_id === key) {
          return { ...obj, [object]: value };
        }
        return obj;
      })
    );
  };

  const updateMenuMedia = (bucket, media, object, key) => {
    const upload = async () => {
      let response = await api.createMedia(
        bucket,
        media,
        [`user:${user["$id"]}`],
        [`user:${user["$id"]}`]
      );

      let imageURL = await api.getMedia(bucket, response.$id);
      setMenu((current) =>
        current.map((obj) => {
          if (obj.menu_id === key) {
            return { ...obj, [object]: imageURL };
          }
          return obj;
        })
      );
    };
    upload();
  };

  const handleLocation = (lat, lng) => {
    const newAnswer = {
      ...hotspot,
      latitude: lat,
      longitude: lng,
    };
    setHotspot(newAnswer);
  };

  const handleColor = (color) => {
    const newAnswer = {
      ...hotspot,
      pin_color: color,
    };
    setHotspot(newAnswer);
  };

  return (
    <>
      <div className="w-[90vw] mx-auto mb-8">
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="my-8 px-6 py-4 text-xl rounded-lg border focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md"
            placeholder="Project Name"
            value={project.project_name}
            onChange={(e) =>
              setProject({ ...project, project_name: e.target.value })
            }
          ></input>
          <div className="flex">
            <div className="flex items-center gap-2">
              {project.homepage_image ? (
                <img
                  className="rounded-lg shadow-lg border my-6 w-40"
                  src={project.homepage_image}
                />
              ) : (
                <></>
              )}
              <div>
                <p className="pb-3 text-sm text-gray-600 pl-2">
                  Homepage Image
                </p>
                <input
                  type="file"
                  id="homepage_image"
                  accept="image/*"
                  name="homepage_image"
                  className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                  onChange={(e) =>
                    updateMedia(
                      Server.imageBucketID,
                      project.homepage_image,
                      e.target.files[0],
                      "homepage_image"
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project.intro_audio ? (
                <audio
                  className="rounded-full shadow-lg border my-6 w-44"
                  controls
                >
                  <source src={project.intro_audio} />
                </audio>
              ) : (
                <></>
              )}
              <div>
                <p className="pb-3 text-sm text-gray-600 pl-2">Intro Audio</p>
                <input
                  type="file"
                  id="intro_audio"
                  accept="audio/*"
                  name="intro_audio"
                  className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                  onChange={(e) =>
                    updateMedia(
                      Server.audioBucketID,
                      project.intro_audio,
                      e.target.files[0],
                      "intro_audio"
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex pt-4 gap-4">
          <div className="w-[30%] border-2 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold uppercase">Hotspots</p>
              <button onClick={() => createHotspot()}>
                <PlusCircleIcon className="w-8 hover:text-blue-400" />
              </button>
            </div>
            <div className="pt-6 grid grid-cols-1 gap-2">
              {hotspots?.map((innerHotspot, index) => (
                <div
                  key={index}
                  className="border flex p-4 rounded-lg justify-between"
                  onClick={() => selectHotspot(innerHotspot)}
                >
                  <h4>{innerHotspot.name}</h4>
                  <button
                    onClick={() =>
                      setHotspots((hotspots) =>
                        hotspots.filter((_, i) => i !== hotspots.length - 1)
                      )
                    }
                  >
                    <MinusCircleIcon className="w-5 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[70%] grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                className="my-8 px-6 py-4 text-xl rounded-lg border focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:shadow-xl shadow-md"
                placeholder="Project Name"
                value={hotspot.name}
                onChange={(e) =>
                  setHotspot({ ...hotspot, name: e.target.value })
                }
              ></input>
              <div className="grid grid-cols-2 gap-3 pb-6">
                <div>
                  <p className="pb-1 text-sm text-gray-600 pl-2">
                    Overlay Image
                  </p>
                  {hotspot.overlay ? (
                    <img
                      className="rounded-lg shadow-lg border my-3"
                      src={hotspot.overlay}
                    />
                  ) : (
                    <></>
                  )}
                  <input
                    type="file"
                    id="overlay"
                    accept="image/*"
                    name="overlay"
                    className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                    onChange={(e) =>
                      newMedia(
                        Server.imageBucketID,
                        e.target.files[0],
                        "overlay"
                      )
                    }
                  />
                </div>
                <div>
                  <p className="pb-1 text-sm text-gray-600 pl-2">
                    Panorama Image
                  </p>
                  {hotspot.overlay ? (
                    <img
                      className="rounded-lg shadow-lg border my-3"
                      src={hotspot.panorama_image}
                    />
                  ) : (
                    <></>
                  )}
                  <input
                    type="file"
                    id="panorama_image"
                    accept="image/*"
                    name="panorama_image"
                    className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                    onChange={(e) =>
                      newMedia(
                        Server.imageBucketID,
                        e.target.files[0],
                        "panorama_image"
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="pb-1 text-sm text-gray-600 pl-2">3D object</p>
                  {hotspot.virtual_object ? (
                    <img
                      className="rounded-lg shadow-lg border my-3"
                      src={hotspot.virtual_object}
                    />
                  ) : (
                    <></>
                  )}
                  <input
                    type="file"
                    id="virtual_object"
                    accept="image/*"
                    name="virtual_object"
                    className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                    onChange={(e) =>
                      newMedia(
                        Server.imageBucketID,
                        e.target.files[0],
                        "virtual_object"
                      )
                    }
                  />
                </div>
                <div>
                  <p className="pb-1 text-sm text-gray-600 pl-2">
                    Narration Audio
                  </p>
                  {hotspot.start_audio ? (
                    <audio
                      className="rounded-full shadow-lg border my-6 w-[100%]"
                      controls
                    >
                      <source src={hotspot.start_audio} />
                    </audio>
                  ) : (
                    <></>
                  )}
                  <input
                    type="file"
                    id="start_audio"
                    accept="audio/*"
                    name="start_audio"
                    className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                    onChange={(e) =>
                      newMedia(
                        Server.audioBucketID,
                        e.target.files[0],
                        "start_audio"
                      )
                    }
                  />
                </div>
              </div>
              <div className="border-2 rounded-lg p-3 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold uppercase">Menu</p>
                  <button onClick={() => newMenuItem()}>
                    <PlusCircleIcon className="w-6 hover:text-blue-400" />
                  </button>
                </div>
                <div className="pt-6 grid grid-cols-1 gap-2">
                  <div class="accordion" id="accordionExample">
                    {menu?.map((innerMenu) => (
                      <div
                        key={innerMenu.menu_id}
                        class="accordion-item bg-white border border-gray-200"
                      >
                        <h2
                          class="accordion-header mb-0"
                          id={"heading_" + innerMenu.menu_id}
                        >
                          <button
                            class="
                      accordion-button
                      relative
                      flex
                      items-center
                      w-full
                      py-4
                      px-5
                      text-base text-gray-800 text-left
                      bg-white
                      border-0
                      rounded-none
                      transition
                      focus:outline-none
                    "
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={"#collapse_" + innerMenu.menu_id}
                            aria-expanded="false"
                            aria-controls="collapseOne"
                          >
                            {innerMenu.title}
                          </button>
                        </h2>
                        <div
                          id={"collapse_" + innerMenu.menu_id}
                          class="accordion-collapse collapse"
                          aria-labelledby={"heading_" + innerMenu.menu_id}
                          data-bs-parent="#accordionExample"
                        >
                          <div class="accordion-body py-4 px-5">
                            <input
                              type="text"
                              className="w-full my-2 px-4 py-2 text-xl rounded-lg border focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:shadow-xl shadow-md"
                              placeholder="Menu Title"
                              value={innerMenu.title}
                              onChange={(e) =>
                                updateMenu(
                                  innerMenu.menu_id,
                                  e.target.value,
                                  "title"
                                )
                              }
                            ></input>
                            <textarea
                              type="text"
                              className="w-full my-2 px-4 py-2 text-md rounded-lg border focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:shadow-xl shadow-md"
                              placeholder="Description"
                              value={innerMenu.description}
                              onChange={(e) =>
                                updateMenu(
                                  innerMenu.menu_id,
                                  e.target.value,
                                  "description"
                                )
                              }
                            ></textarea>
                            <p className="text-sm text-gray-600 pl-2">
                              Background Image
                            </p>
                            {innerMenu.background_image ? (
                              <img
                                className="rounded-lg shadow-lg border my-4 w-full"
                                src={innerMenu.background_image}
                              />
                            ) : (
                              <></>
                            )}
                            <input
                              type="file"
                              id="background_image"
                              accept="image/*"
                              name="background_image"
                              className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                              onChange={(e) =>
                                updateMenuMedia(
                                  Server.imageBucketID,
                                  e.target.files[0],
                                  "background_image",
                                  innerMenu.menu_id
                                )
                              }
                            />
                            <p className="py-3 text-sm text-gray-600 pl-2">
                              Narration Audio
                            </p>
                            {innerMenu.descriptive_audio ? (
                              <audio
                                className="rounded-full shadow-lg border mb-4 w-[100%]"
                                controls
                              >
                                <source src={innerMenu.descriptive_audio} />
                              </audio>
                            ) : (
                              <></>
                            )}
                            <input
                              type="file"
                              id="start_audio"
                              accept="audio/*"
                              name="start_audio"
                              className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-sky-50 file:text-sky-700
      hover:file:bg-sky-100"
                              onChange={(e) =>
                                updateMenuMedia(
                                  Server.audioBucketID,
                                  e.target.files[0],
                                  "descriptive_audio",
                                  innerMenu.menu_id
                                )
                              }
                            />
                            <button
                              className="flex items-center gap-1 mx-auto mt-4 py-2 px-4 font-semibold text-md rounded-lg shadow-md bg-white text-gray-900 border border-gray-900 hover:border-transparent hover:text-white hover:bg-gray-900 focus:outline-none"
                              onClick={() =>
                                setMenu((menu) =>
                                  menu.filter(
                                    (i) => i.menu_id !== innerMenu.menu_id
                                  )
                                )
                              }
                            >
                              <MinusCircleIcon className="w-5 hover:text-red-500" />{" "}
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-4">
                <div className="pure-control-group required">
                  <label htmlFor="latitude">Latitude</label>
                  <input
                    type="number"
                    className="w-full my-2 px-4 py-2 text-xl rounded-lg border focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:shadow-xl shadow-md"
                    id="latitude"
                    placeholder="enter latitude"
                    min={-90}
                    max={90}
                    step={LongLatStep}
                    value={hotspot.latitude != null ? hotspot.latitude : ""}
                    onChange={(e) =>
                      setHotspot({ ...hotspot, latitude: e.target.value })
                    }
                  />
                </div>

                <div className="pure-control-group required">
                  <label htmlFor="longitude">Longitude</label>
                  <input
                    type="number"
                    className="w-full my-2 px-4 py-2 text-xl rounded-lg border focus:ring-2 focus:ring-gray-800 transition duration-200 ease-in-out transform hover:shadow-xl shadow-md"
                    id="longitude"
                    placeholder="enter longitude"
                    min={-180}
                    max={80}
                    step={LongLatStep}
                    value={hotspot.longitude != null ? hotspot.longitude : ""}
                    onChange={(e) =>
                      setHotspot({ ...hotspot, longitude: e.target.value })
                    }
                  />
                </div>
              </div>

              <MapField
                handleLocation={handleLocation}
                currentLatitude={hotspot.latitude}
                currentLongitude={hotspot.longitude}
                currentMarkerColor={hotspot.pin_color || "add8e6"}
                handleColor={handleColor}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProject;
