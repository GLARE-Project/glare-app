import { getBaseHotspots, tooCloseHotspotList } from "../utils/gpsManager.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, Suspense } from "react";
import { AnimateCamera } from "./AnimateCamera";
import CubeMapVR from "../../../utils/CubeMapVR.js";
import SphereMapAR from "../../../utils/SphereMapAR.js";
import { Html, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Ellipsis } from "react-spinners-css";
import AudioPlayer from "../utils/AutoPlayer";
import {
  EyeIcon,
  LocationMarkerIcon,
  MenuAlt1Icon,
} from "@heroicons/react/solid";
import MenuOverlay from "./MenuItem.jsx";

const Loader = () => {
  const { active } = useProgress();
  if (active) {
    return (
      <Html center>
        <Ellipsis className="spinner" color="#fff" />
      </Html>
    );
  } else return null;
};

const Tour = ({ hotspot, onCampus, projectId }) => {
  const query = new URLSearchParams(useLocation().search);
  const INITIAL_STATE = { name: "", start_audio: "" };

  const [StorageData, setStoredData] = useState(INITIAL_STATE);
  const { name, start_audio } = StorageData;

  const [isRotating, setIsRoating] = useState(false);
  const videoRef = useRef();

  const navigate = useNavigate();

  function scrollToTop() {
    window.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }

  function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  useEffect(() => {
    setStoredData(hotspot);
    // used to get rid of the bar in safari
    scrollToTop();
    scrollToBottom();
  }, [hotspot, query, StorageData, INITIAL_STATE]);

  const [menuModalIsOpen, setMenuIsOpen] = useState(false);

  console.log(StorageData);

  return (
    <div id="container" style={{ overflow: "hidden" }}>
      <MenuOverlay
        hotspot={hotspot}
        menuModalIsOpen={menuModalIsOpen}
        setMenuIsOpen={setMenuIsOpen}
      >
        {onCampus && (
          <video
            ref={videoRef}
            autoPlay={true}
            muted
            playsInline
            id="videoElement"
          />
        )}
        <Canvas id="canvas" camera={{ position: [0, 0, 1], fov: 45 }}>
          <directionalLight position={[0.5, 0, 0.866]} />
          <Suspense fallback={<Loader />}>
            {onCampus ? (
              <SphereMapAR data={StorageData} video={videoRef} />
            ) : (
              <CubeMapVR data={StorageData} />
            )}
            <AnimateCamera
              isRotating={isRotating}
              setIsRoating={setIsRoating}
            />
          </Suspense>
        </Canvas>

        <div className=" absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <AudioPlayer name={name} source={hotspot.start_audio} />
        </div>
        <div
          onClick={() => setMenuIsOpen(true)}
          className=" bg-white shadow-lg rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-200 p-4 cursor-pointer absolute top-10 left-10"
        >
          <MenuAlt1Icon className="w-10" />
        </div>

        <div className=" bg-white shadow-lg rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-200 p-4 cursor-pointer absolute bottom-10 left-10">
          <EyeIcon className="w-10" onClick={() => setIsRoating(true)} />
        </div>
        <div className=" bg-white shadow-lg rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-200 p-4 cursor-pointer absolute bottom-10 right-10">
          <LocationMarkerIcon
            className="w-10"
            onClick={() => navigate(`/viewer/${projectId}/map`)}
          />
        </div>
      </MenuOverlay>
    </div>
  );
};

export default Tour;
