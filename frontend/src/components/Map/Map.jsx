import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet';
import { MapContainer, TileLayer, GeoJSON, useMap} from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// manually define marker icon due to some import problem
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
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
        <GeoJSON key={Math.random().toString()} data={geojson} />
      </MapContainer>
    );
  }
}

export default Map;
