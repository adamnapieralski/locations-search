import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import positionIcon from '../../public/img/position-marker.png'

// manually define marker icon due to some import problem
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [22, 41],
  popupAnchor: [-10, -41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const currentPositionIcon = L.icon({
  iconUrl: positionIcon,
  shadowUrl: iconShadow,
  iconAnchor: [22, 41],
  popupAnchor: [-10, -41]
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function showPopup(feature, layer) {
  if(feature.properties.name){
    layer.bindPopup(feature.properties.name)
  } else if(feature.properties.amenity){
    layer.bindPopup(feature.properties.amenity)
  }
}

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  };

  render() {
    const { coords: { latitude, longitude } } = this.props;
    const { geojson } = this.props;

    return (
      <MapContainer className="map" center={[latitude, longitude]} zoom={13} scrollWheelZoom="true">
        <ChangeView center={[latitude, longitude]} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={currentPositionIcon}>
          <Popup> Your current position </Popup>
        </Marker>
        <GeoJSON key={Math.random().toString()} data={geojson} onEachFeature={showPopup}/>
      </MapContainer>
    );
  }
}

export default Map;
