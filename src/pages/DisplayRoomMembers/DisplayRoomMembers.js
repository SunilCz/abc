import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './addToRoom.css';
import Map from '../../components/Map/Map';
import io from 'socket.io-client';

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const DisplayToRoom = () => {
  const URL = process.env.REACT_APP_BACKEND_URL;
  const [rooms, setRooms] = useState([]);
  const [trackedLocation, setTrackedLocation] = useState(null);

  // Assuming you have a way to get the logged-in user's ID
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [creatorId, setCreatorId] = useState(null);

  const handleTrackParticipant = async (roomId, participantId, setTrackedLocation) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          // Set the tracked location
          setTrackedLocation({ latitude, longitude });

          // Emit the latitude, longitude, and userId values to the server using Socket.IO
          if (socket) {
            socket.emit('TrackLocation', {
              roomId,
              participantId,
              userId: loggedInUserId,  // Include the userId here
              latitude,
              longitude,
            });
          }
          console.log('roomId', roomId);
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported in this browser.');
    }
  };

  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const response = await axios.get(`${URL}/api/users/getParticipant`);
        // console.log('response', response.data);
        setLoggedInUserId(response.data.userId);
        setRooms(response.data.allRooms);

        // Log creatorId
        if (response.data.allRooms.length > 0) {
          const firstRoom = response.data.allRooms[0];
          setCreatorId(firstRoom.creatorId);
          console.log('Creator ID:', creatorId);
        }

      } catch (error) {
        console.error('Failed to fetch room list:', error);
      }
    };

    fetchRoomList();
  }, [URL]);

  return (
    <div className='main'>
      <div>
        <h2>Room List ({rooms.length})</h2>
        {rooms.map((room, index) => (
          <div key={index}>
            <h3>Room ID: {room.roomId}</h3>
            <ul>
              {room.participants.map((participant, participantIndex) => (
                <li key={participantIndex}>
                  {participant.name}{' '}
                  {(loggedInUserId === participant.id) ? (
  <button onClick={() => handleTrackParticipant(room.roomId, loggedInUserId, setTrackedLocation)}>
    Share My Location
  </button>
) : (
  (loggedInUserId !== participant.id) && (
    <button onClick={() => handleTrackParticipant(room.roomId, participant.id, setTrackedLocation)}>
      Track
    </button>
  )
)}

                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Map trackedLocation={trackedLocation} />
    </div>
  );
  
};

export default DisplayToRoom;
