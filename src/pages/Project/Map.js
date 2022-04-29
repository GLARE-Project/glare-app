import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { HexColorPicker, HexColorInput } from "react-colorful";
import "leaflet/dist/leaflet.css";

const HotspotMarker = ({ position, color }) => {
  const icon = new L.Icon({
    // see more at https://developers.google.com/chart/image/docs/gallery/dynamic_icons#plain_pin
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_spin&chld=.6|0|${color}|16|b|X`,
    iconSize: [23, 41],
  });

  return (
    <>
      {position[0] !== 0 && position[1] !== 0 && (
        <Marker position={position} icon={icon}>
          <Popup>
            <span>selected location</span>
          </Popup>
        </Marker>
      )}
    </>
  );
};

const MapField = ({
  handleLocation,
  currentLatitude,
  currentLongitude,
  currentMarkerColor,
  handleColor,
}) => {
  const mapRef = useRef(null);

  const [position, setPosition] = useState([currentLatitude, currentLongitude]);

  const [color, setColor] = useState(currentMarkerColor);

  const [zoom, setZoom] = useState(2);

  const zoomLocation = useCallback(
    (latlong) => {
      mapRef.current.leafletElement.flyTo(latlong, zoom, { animate: true });
    },
    [zoom]
  );

  useLayoutEffect(() => {
    setPosition([currentLatitude, currentLongitude]);
    setColor(currentMarkerColor);
    zoomLocation({ lat: currentLatitude, lng: currentLongitude });
  }, [currentLatitude, currentLongitude, currentMarkerColor, zoomLocation]);

  const changeLocation = (e) => {
    const { lat, lng } = e.latlng;
    setZoom(10);
    handleLocation(lat, lng);
  };

  const changeColor = (hex) => {
    const hexRemovedHash = hex.substring(1, hex.length);
    handleColor(hexRemovedHash);
  };

  return (
    <React.Fragment>
      <LeafletMap
        style={{ height: "20em", margin: "1em 0" }}
        center={position}
        zoom={zoom}
        onClick={changeLocation}
        ref={mapRef}
        minZoom={2}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <HotspotMarker color={color} position={position} />
      </LeafletMap>
      <div className="pure-control-group">
        <label htmlFor={"colorInput"}>Pin Hex Color:</label>
        <HexColorInput id={"colorInput"} color={color} onChange={changeColor} />
        <HexColorPicker color={color} onChange={changeColor} />
      </div>
    </React.Fragment>
  );
};

export default MapField;
