import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet';
import {
  MapContainer, TileLayer, GeoJSON, Marker, Circle, Popup, Polygon, useMap, LayersControl,
} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import positionIcon from '../../public/img/position-marker.png';

// manually define marker icon due to some import problem
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const searchAreaOptions = { color: 'purple', fillColor: 'purple' };

const currentPositionIcon = L.icon({
  iconUrl: positionIcon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function showPopup(feature, layer) {
  let popupText = '';
  Object.entries(feature.properties.tags).forEach((e) => {
    popupText += `${e[0]}: ${e[1]}</br>`;
  });
  layer.bindPopup(popupText);
}

function transformSearchPolygon(polygon) {
  polygon.forEach((p) => {
    const tmp = p[0];
    p[0] = p[1];
    p[1] = tmp;
  });
}

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  updateSearchDistance = (distance) => {
    this.setState({ searchDistance: distance });
  }

  createDistanceShowOverlay = () => {
    const { mainObject, searchPolygon, coords: { latitude, longitude } } = this.props;

    const empty = <Circle center={[latitude, longitude]} radius={0} pathOptions={{ color: 'white', fillColor: 'white' }} />;

    if (!mainObject.timeReachOn) {
      return (
        <Circle
          center={[latitude, longitude]}
          radius={mainObject.maxDistance}
          pathOptions={searchAreaOptions}
        />
      );
    }
    if (searchPolygon) {
      return (
        <Polygon positions={searchPolygon} pathOptions={searchAreaOptions} />
      );
    }

    return empty;
  }

  render() {
    const { coords: { latitude, longitude } } = this.props;
    const { geojson } = this.props;
    const { searchPolygon } = this.props;

    if (searchPolygon != null) {
      transformSearchPolygon(searchPolygon);
    }

    return (
      <div className="mapBlock">
        <MapContainer className="map" center={[latitude, longitude]} zoom={13} scrollWheelZoom="true">
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Show search distance">
              {this.createDistanceShowOverlay()}
            </LayersControl.Overlay>
          </LayersControl>
          <ChangeView center={[latitude, longitude]} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={currentPositionIcon}>
            <Popup> Your current position </Popup>
          </Marker>
          <GeoJSON key={Math.random().toString()} data={geojson} onEachFeature={showPopup} />
        </MapContainer>
      </div>
    );
  }
}

export default Map;
