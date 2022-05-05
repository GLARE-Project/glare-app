import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { Server } from "../utils/config";
import "./Viewer/viewer.css";
import { Link } from "react-router-dom";
import { Rehowl, Play } from "rehowl";
import screenfull from "screenfull";

function setUpDeviceMotion() {
  // To make sure the device supports DeviceMotionEvent and can request it
  // Must check for Sarafi
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // iOS 13+
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response !== "granted") {
          // permission not granted
          alert(
            "Motion access is required to view this site, Please delete your website cache in Settings -> Safari and reload."
          );
        }
      })
      .catch(console.warn);
  }
}

function setFullScreen() {
  if (screenfull.isEnabled) {
    screenfull.request();
  }

  scrollToTop();
  scrollToBottom();
}

function setOrientation() {
  if (typeof window.screen.orientation !== "undefined") {
    var locOrientation =
      window.screen.lockOrientation ||
      window.ScreenOrientation ||
      window.screen.msLockOrientation ||
      window.screen.orientation.lock ||
      null;
    if (locOrientation === window.ScreenOrientation) {
      console.log("Firefox detected - lack of orientation support");
    } else if (locOrientation.call(window.screen.orientation, "landscape")) {
    } else {
      console.warn("There was a problem in locking the orientation");
    }
  } else {
    console.warn("Screen Orientation not supported");
    // if mobile we can use CSS to rotate or a splash screen to let the user to know
    document.querySelector("html").classList.add("ios-cant-orient");
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
  window.scrollTo(0, 1);
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

const Viewer = () => {
  const { tourid } = useParams();
  const [project, setProject] = useState({});
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    setOrientation();

    const getProject = async () => {
      let response = await api.getDocument(Server.collectionID, tourid);
      setProject(response);
      console.log(response.hotspots);
      const exisitingHotspots = response.hotspots?.map((h) => JSON.parse(h));
      console.log(exisitingHotspots);
      await setProject({ ...response, hotspots: exisitingHotspots });
      await setHotspots(exisitingHotspots);
    };
    getProject();
  }, []);

  function handleClick() {
    setFullScreen();
    setUpDeviceMotion();
  }

  return (
    <div
      className="w-screen h-screen grid justify-center items-center "
      style={{ background: `url(${project.homepage_image})` }}
    >
      {project.intro_audio && (
        <Rehowl src={project.intro_audio} format={["mp4"]}>
          {({ howl }) => <Play howl={howl} />}
        </Rehowl>
      )}
      <h1 className="font-bold drop-shadow-3xl text-center text-white text-6xl">
        {project.project_name}
      </h1>
      <Link
        className="font-bold drop-shadow-3xl text-center text-white text-6xl"
        to=""
        onClick={() => handleClick()}
      >
        Begin Tour
      </Link>
    </div>
  );
};

export default Viewer;
