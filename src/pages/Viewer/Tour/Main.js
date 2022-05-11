import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "../components/backButton";
import AudioPlayer from "../utils/AutoPlayer";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Frame, useAnimation } from "framer";
import { XCircleIcon } from "@heroicons/react/solid";

library.add(faTimes);

const Main = ({ page }) => {
  const [content, setContent] = useState([]);

  const [audioTime, setAudioTime] = useState(0);
  const [isFaded, setFaded] = useState(false);

  const controls = useAnimation();

  const FADE_MULTIPLIER = 1.3; // 130% to make content readable before it is completely gone

  // TODO: figure how to do onRestart for audio and to set opacity back to inital

  const handleFade = (time) => {
    controls
      .start({
        opacity: 0,
        transition: { duration: time / 1000 }, // make everything in terms of a milliseconds
      })
      .then(() => setFaded(true));
  };

  const startFade = () => {
    handleFade(audioTime * FADE_MULTIPLIER);
  };

  const stopFade = () => {
    controls.stop();
  };

  //   useEffect(() => {
  //     // remove the image from loading in from the homepages
  //     document.body.classList.add("scrollable-body");
  //     return () => {
  //       document.body.attributes.removeNamedItem("style");
  //       document.body.classList.remove("scrollable-body");
  //     };
  //   }, []); // ignore rerun from fade state update

  useEffect(() => {
    // to set the content
    setContent(page);
  }, [page]);

  return (
    <>
      <main
        style={{
          backgroundImage: `url(${page.background_image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="h-screen"
      >
        <Frame
          position={"relative"}
          animate={controls}
          className="w-screen"
          initial={{
            opacity: 1,
            width: "100vw",
          }}
          exit={{ opacity: 0 }}
        >
          <h1 className="font-bold text-lg px-4 pb-2 pt-4">{page.title}</h1>
          <p className="w-11/12 p-4">{page.description}</p>
        </Frame>
        <div className=" absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <AudioPlayer
            source={page.descriptive_audio}
            onLoad={(time) => setAudioTime(time)}
            onPause={stopFade}
            onPlaying={startFade}
          />
        </div>
        <BackButton />
      </main>
    </>
  );
};

export default Main;
