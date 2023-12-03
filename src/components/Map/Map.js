import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import Emit from '../Emit/Emit';
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaW4tZGV2a290YSIsImEiOiJjbHBmNDVvd3YxaTJ3MmpwZGxndzNudGE3In0.OSon9cSO6JX4io1wDqcZIQ';
const Map = ({ trackedLocation }) => {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
  });

  useEffect(() => {
    // Ensure that both latitude and longitude are defined before updating the viewport
    if (trackedLocation && trackedLocation.latitude && trackedLocation.longitude) {
      setViewport({
        latitude: trackedLocation.latitude,
        longitude: trackedLocation.longitude,
        zoom: 12,
      });
    }
  }, [trackedLocation]);
  // console.log('trackedLocation', trackedLocation);

  return (
    <div>
      <div style={{ height: '100vh', width: '100vw' }}>
        <ReactMapGL
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={(newViewport) => setViewport(newViewport)}
        >
          {trackedLocation && (
           <Marker latitude={trackedLocation.latitude} longitude={trackedLocation.longitude} offsetLeft={-20} offsetTop={-10}>
           <div style={{ color: 'blue', fontWeight: 'bold' }}>Robin</div>
         </Marker>
          )}
        </ReactMapGL>
      </div>
      <Emit />
    </div>
  );
};

export default Map;
