import { useEffect, useState, useCallback } from "react";
import { Outlet, useParams } from "react-router-dom";
import api from "../api/api";
import { Server } from "../utils/config";
import "./Viewer/viewer.css";
import { Routes, Route } from "react-router-dom";
import Intro from "./Viewer/Intro";
import Home from "./Viewer/Home";
import Map from "./Viewer/Map";
import Tour from "./Viewer/Tour/Tour";
import Main from "./Viewer/Tour/Main";

const Viewer = () => {
  const { tourid } = useParams();
  const [project, setProject] = useState({});
  const [hotspots, setHotspots] = useState([]);
  const [onCampus, setOnCampus] = useState();
  const [hotspot, setHotspot] = useState();
  const [page, setPage] = useState();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getProject = async () => {
      setLoading(true); // Start loading
      try {
        let response = await api.getDocument(Server.collectionID, tourid);
        const exisitingHotspots = response.hotspots?.map((h) => JSON.parse(h));
        setProject({ ...response, hotspots: exisitingHotspots });
        setHotspots(exisitingHotspots);
      } catch (error) {
        console.error("Failed to fetch project data", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    getProject();
  }, [tourid]);

  const setCurrentHotspot = (clickedHotspot) => {
    setHotspot(clickedHotspot);
   // console.log("setCurrentHotspot---------",clickedHotspot);
  };

  const checkCamera = useCallback(() => {
    // check to see if the devices are undefine
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video:
            process.env.NODE_ENV === "production"
              ? {
                  facingMode: {
                    exact: "environment", // the front camera, if prefered
                  },
                }
              : {},
          // if constains don't pass for camera and is production - it isn't on campus
        })
        .catch((err) => {
          setOnCampus(false);
        });
    } else {
      setOnCampus(false);
    }
  }, [setOnCampus]);

  const checkPos = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        () => setOnCampus(true),
        () => setOnCampus(false),
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0,
        }
      );
    } else {
      setOnCampus(false);
    }
  }, [setOnCampus]);

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  return (
    <>
      <Routes>
        <Route index element={<Home project={project} />} />
        <Route
          path="intro"
          element={
            <Intro
              project={project}
              checkCamera={checkCamera}
              checkPos={checkPos}
              onCampus={onCampus}
              setOnCampus={setOnCampus}
            />
          }
        />
        <Route
          path="map"
          element={
            <Map
              projectId={project.$id}
              checkCamera={checkCamera}
              checkPos={checkPos}
              onCampus={onCampus}
              setOnCampus={setOnCampus}
              hotspots={hotspots}
              setCurrentHotspot={setCurrentHotspot}
            />
          }
        />
        <Route
          path=":tourname"
          element={
            <Tour
              projectId={project.$id}
              project={project}
              checkCamera={checkCamera}
              checkPos={checkPos}
              onCampus={onCampus}
              setOnCampus={setOnCampus}
              hotspot={hotspot}
              setCurrentHotspot={setCurrentHotspot}
              page={page}
              setPage={setPage}
            />
          }
        />
        <Route
          path="/media/:media"
          element={<Main projectId={project.$id} page={page} />}
        />
      </Routes>
    </>
  );
};

export default Viewer;
