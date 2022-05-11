import { useState, useCallback, useEffect } from "react";
import { useHowl, Play, Rehowl } from "rehowl";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  LocationMarkerIcon,
  MenuAlt1Icon,
} from "@heroicons/react/solid";
import BackgroundTile from "../../images/intro/Background_Tile.png";
import Step1 from "../../images/intro/Step1.png";
import Step2 from "../../images/intro/Step2.png";
import Step3 from "../../images/intro/Step3.png";
import Step4 from "../../images/intro/Step4.png";
import Step5 from "../../images/intro/Step5.png";
import Step2Remote from "../../images/intro/Step2-remote.png";
import Step3Remote from "../../images/intro/Step3-remote.png";
import Audio1 from "../../audio/intro/1_inSitu.m4a";
import Audio2 from "../../audio/intro/2_inSitu.m4a";
import Audio3 from "../../audio/intro/3_inSitu.m4a";
import Audio4 from "../../audio/intro/4_inSitu.m4a";
import Audio5 from "../../audio/intro/5_inSitu.m4a";
import AudioRemote1 from "../../audio/intro/1_remote.m4a";
import AudioRemote2 from "../../audio/intro/2_remote.m4a";
import AudioRemote3 from "../../audio/intro/3_remote.m4a";

const Intro = ({ project, checkCamera, checkPos, onCampus, setOnCampus }) => {
  const [stepNum, SetStepNum] = useState(0);
  const IntroCount = parseInt(localStorage.getItem("introCount"));
  const [StepData, setStepData] = useState([]);
  const navigate = useNavigate();
  const audioPrefix = onCampus ? "_inSitu" : "_remote";
  // const { howl } = useHowl({
  //   src:
  //     "/audio/intro/" +
  //     (stepNum + 1) +
  //     audioPrefix +
  //     ".m4a",
  //   html5: true,
  // });
  // const { howl } = useHowl();

  const handleFinish = useCallback(() => {
    localStorage.setItem("introCount", StepData.length);
    navigate(`/viewer/${project.$id}/map`);
  }, [StepData.length]);

  const handleBack = () => {
    if (stepNum > 0) {
      var count = stepNum - 1;
      SetStepNum(count);
      localStorage.setItem("introCount", count);
    } else {
      navigate(`/viewer/${project.$id}`);
    }
  };

  const handleNext = () => {
    var count = stepNum + 1;
    if (StepData.length - 1 > stepNum) {
      SetStepNum(count);
      localStorage.setItem("introCount", count);
    } else {
      // finished
      handleFinish();
    }
  };

  useEffect(() => {
    checkPos();
    checkCamera();
    setStepData(onCampus ? StepsMobile : Steps360);
    // incase a user leaves and wants to come back
    if (IntroCount > 0 && StepData.length > 0) {
      // make sure they aren't finished
      if (IntroCount >= StepData.length) handleFinish();
      else SetStepNum(IntroCount);
    }
  }, [StepData, onCampus, IntroCount, checkCamera, checkPos, handleFinish]);

  if (StepData.length > 0 && StepData.length > stepNum)
    return (
      <div
        className="w-screen h-screen text-white grid grid-cols-3 justify-center items-center"
        style={{ backgroundImage: `url(${BackgroundTile})` }}
      >
        <Rehowl src={StepData[stepNum].audio} format={["m4a"]}>
          {({ howl }) => <Play howl={howl} />}
        </Rehowl>
        <h1 className="text-6xl font-bold uppercase text-center col-span-3">
          Step {stepNum + 1}
        </h1>
        {StepData.length - 1 > stepNum && (
          <p
            className="absolute top-10 right-20 py-2 px-4 bg-white rounded-lg text-black font-bold cursor-pointer"
            onClick={handleFinish}
          >
            skip
          </p>
        )}
        <div className="col-span-3 grid justify-center items-center">
          {StepData[stepNum].image}
          {StepData[stepNum].description}
        </div>
        <button
          onClick={handleBack}
          className="w-36 py-4 px-2 bg-white rounded-lg text-black font-bold justify-self-center"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="w-36 py-4 px-2 bg-white rounded-lg text-black font-bold justify-self-center col-start-3"
        >
          {StepData.length - 1 > stepNum ? "Next" : "Begin Tour"}
        </button>
      </div>
    );
  else return <div>Loading...</div>;
};

const StepsMobile = [
  {
    description: (
      <p className="pt-10 text-center">Turn the volume up on your device.</p>
    ),
    image: <img className="justify-self-center" src={Step1} alt="icon" />,
    audio: Audio1,
  },
  {
    description: (
      <p className="pt-10 text-center flex items-center gap-2">
        Use the map to navigate to each hotspot. If the map does not come up
        automatically, you can get there by clicking the{" "}
        <LocationMarkerIcon className="w-6" />
        icon.
      </p>
    ),
    icon: <LocationMarkerIcon />,
    image: <img className="justify-self-center" src={Step2} alt="icon" />,
    audio: Audio2,
  },
  {
    description: (
      <p className="pt-10 text-center">
        After arriving at the hotspot locate the foot-guide on the ground and
        point your camera in the direction indicated.
      </p>
    ),
    image: <img className="justify-self-center" src={Step3} alt="icon" />,
    audio: Audio3,
  },
  {
    description: (
      <p className="pt-10 text-center flex items-center gap-2">
        After pointing your camera in the instructed direction, click on the{" "}
        <EyeIcon className="w-6" /> icon to generate augmented images on the
        screen, and listen for the audio clip.
      </p>
    ),
    icon: <EyeIcon />,
    image: <img className="justify-self-center" src={Step4} alt="icon" />,
    audio: Audio4,
  },
  {
    description: (
      <p className="pt-10 text-center flex items-center gap-2">
        After each hotspot you can find more information unique to that location
        by clicking on the <MenuAlt1Icon className="w-6" /> icon and viewing
        each menu item.
      </p>
    ),
    icon: <MenuAlt1Icon />,
    image: <img className="justify-self-center" src={Step5} alt="icon" />,
    audio: Audio5,
  },
];

const Steps360 = [
  StepsMobile[0],
  {
    description: (
      <p className="pt-10 text-center flex items-center gap-2">
        Click on each hotspot <LocationMarkerIcon className="w-6" /> on the map
        to access augmented reality images and information about the site.
      </p>
    ),
    icon: <LocationMarkerIcon />,
    image: <img className="justify-self-center" src={Step2Remote} alt="icon" />,
    audio: AudioRemote2,
  },
  {
    description: (
      <p className="pt-10 text-center">
        Each hotspot shows an historical image, displayed on a 360 image from
        today. You can use your mouse to look around the picture. Use the
        various icons to access additional information or to return to the map.
      </p>
    ),
    image: (
      <img className="w-96 justify-self-center" src={Step3Remote} alt="icon" />
    ),
    audio: AudioRemote3,
  },
];

const HelpElement = ({ description, icon, index }) => {
  const pattern = /(\[icon\])/g;
  const matchText = description.match(pattern);

  return (
    <li key={index}>
      {description.split(pattern).reduce((accumulator, currentValue) => {
        // if no icon return the text
        if (!icon) return accumulator;

        // if current frament is the [icon]
        if (matchText.includes(currentValue))
          // convert to a JS Element
          return [
            <>
              {accumulator}
              {icon}
            </>,
          ];
        // if not [icon just add the text]
        else return [...accumulator, currentValue];
      })}
    </li>
  );
};

export const ProcessedSteps = ({ onCampus }) => {
  const StepData = onCampus ? StepsMobile : Steps360;
  return StepData.map((step, index) => {
    return <HelpElement {...step} index={index} key={index} />;
  });
};

export default Intro;
