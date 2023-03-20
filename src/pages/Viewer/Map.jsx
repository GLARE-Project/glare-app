import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import BackButton from "./components/backButton";
import { useState, useCallback, useEffect } from "react";
import {
  onPositionUpdate,
  isOnCampus,
  getBaseHotspots,
  tooCloseHotspotList,
} from "./utils/gpsManager";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
// import Tour from "../Viewer/Tour/Tour";
// import { Server } from "../../utils/config";
// import api from "../../api/api";

const Map = ({
  onCampus,
  setOnCampus,
  hotspots,
  setCurrentHotspot,
  projectId,
}) => {
  const [currentPos, setCurrentPos] = useState([]);
  const [GeoError, setError] = useState(null);
  const [latitude, setLatitude] = useState(()=> hotspots.map((l) => l.latitude));
  const [longitude, setLongitude] = useState(()=> hotspots.map((l) => l.longitude));
  
  
  //console.log("projectid--------", projectId);

  // const { tourid } = useParams();
  // const [project, setProject] = useState({});
  // const [marker, setMarker] = useState();

  const navigate = useNavigate();
 
   console.log("latitude-a", latitude);
   console.log("longitude-a",longitude);
  
  //  useEffect(() => {
  //   const getProject = async () => {
  //     let response = await api.getDocument(Server.collectionID, projectId);
  //     setProject(response);
  //     console.log("response.hotspots---------",response.hotspots);
  //     const exisitingHotspots = response.hotspots?.map((h) => JSON.parse(h));
  //   //  console.log("exisitingHotspots---------",exisitingHotspots);
  //     await setProject({ ...response, hotspots: exisitingHotspots });
  //     await setMarker(exisitingHotspots);
  //   };
  //   getProject();
  // }, []);
  
  // const initalRegion = {
  //   lat: latitude,
  //   lng: longitude,
  //   zoom: 15,
  // };

  const position = [latitude[0], longitude[0]];

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
        })
        .catch((err) => {
          setOnCampus(false);
        });
    } else {
      setOnCampus(false);
    }
  }, [setOnCampus]);

  //set the error value and log it to console
  const setAndLogError = useCallback(
    (err) => {
      // don't repeat errors
      if (GeoError !== err) {
        console.warn(err);
        setError(err);
      }
    },
    [GeoError]
  );

  // create current postion point
  const success = useCallback(
    (pos) => {
      if (hotspots.length > 0) onPositionUpdate(pos, hotspots);
      setOnCampus(isOnCampus(pos, hotspots));
      checkCamera();
      // reset the error value as it worked
      setError(null);
      setCurrentPos([pos.coords.latitude, pos.coords.longitude]);
    },
    [setOnCampus, checkCamera, hotspots]
  );

  const error = useCallback(
    (err) => {
      setCurrentPos([]);
      // gps failed, so we just go to off-campus
      setOnCampus(false);
      setAndLogError("Error: The Geolocation service failed.");
    },
    [setOnCampus, setAndLogError]
  );

  const restrictedMarkers = onCampus ? getBaseHotspots(hotspots) : hotspots;

  return (
    <div>
      <MapContainer
        center={position}
        zoom={15}
        currentPos={currentPos}
        scrollWheelZoom={false}
        className="z-0"
      >
        <TileLayer
          maxNativeZoom={19}
          maxZoom={23}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {hotspots.map((hotspot, index) => {
          const { latitude, longitude, name, pin_color } = hotspot;
          return (
            <Marker
              key={index}
              zIndexOffset={-1}
              title={name}
              position={[latitude, longitude]}
              icon={PointIcon((index + 1).toString(), pin_color)}
              eventHandlers={{
                click: () => {
                  setCurrentHotspot(hotspot);
                  navigate(`/viewer/${projectId}/${hotspot.name}`);
                },
              }}
            ></Marker>
          );
        })}
      </MapContainer>
      <BackButton />
    </div>
  );
};

// TODO: This should formated the same naming as GEOJSON
const PointIcon = (id, IS_GROUPED_HOTSPOT = false, pinColor = undefined) => {
  // if a color is set use it otherwise determine the default color
  const color = pinColor ? pinColor : IS_GROUPED_HOTSPOT ? "00af91" : "add8e6";
  return new L.Icon({
    // see more at https://developers.google.com/chart/image/docs/gallery/dynamic_icons#plain_pin
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_spin&chld=.6|0|${color}|16|b|${id}`,
    iconSize: [23, 41],
  });
};

export default Map;
