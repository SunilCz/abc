import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Emit() {
  const [locationData, setLocationData] = useState(null);
  useEffect(() => {
    const socket = io.connect('https://rideback.onrender.com');
    console.log('socket', socket);
  
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('Realtime', 'Robinnnn'); // Emit "Realtime" event after connecting
    });
  
    socket.on('Data', (data) => {
      console.log('Received Data:', data);
    });
  
    socket.on('Temperature', (data) => {
      console.log('Received Temperature:', data);
    });
  
    // Listen for location updates from the server
    socket.on('LocationUpdate', (locationUpdateData) => {
      console.log('Location Update:', locationUpdateData);
  
      // Update the location data in the component state
      setLocationData((prevLocationData) => {
        return {
          ...prevLocationData,
          ...locationUpdateData,
        };
      });
    });
  
    return () => {
      socket.disconnect(); // Disconnect when the component unmounts
    };
  }, []);
  

  return (
    <div>
      <h2>Emit</h2>
      {locationData && (
        <div>
          <h3>Location Update</h3>
          <p>User ID: {locationData.userId}</p>
          <p>Latitude: {locationData.latitude}</p>
          <p>Longitude: {locationData.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default Emit;
