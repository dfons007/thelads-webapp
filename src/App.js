import React, {useEffect, useState} from 'react';
import './App.css';
import {Navbar} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MDBDataTable } from 'mdbreact';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet'
import Geocode from 'react-geocode';
import axios from "axios";



export default function App() {



Geocode.setApiKey("");  // Geocode API key, insert your own API key
Geocode.setLanguage("en"); // Language preference set to 'en' (english)
Geocode.setRegion("us");  // Region preference set to 'us' (united states)



var addressString;  // Store addressString to use for Geocode API 
var temp;
var pairs = [];
const [data, setData] = useState([]); // Hook to store JSON object from API link 
const [pair, setPair] = useState([]);


// Formating for table columns 
const formatdata = {
  columns: [
    {
      label: 'ID',    // Label that shows up on the web page for the column
      field: 'id',    // JSON object prop id preference 
      sort: 'asc',    // default sort when opening page, set to ascending when opening the webapp
      width: 150
    },
    {
      label: 'Name',
      field: 'name',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Street',
      field: 'street',
      sort: 'asc',
      width: 150
    },
    {
      label: 'City',
      field: 'city',
      sort: 'asc',
      width: 150
    },
    {
      label: 'State',
      field: 'state',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Postal Code',
      field: 'postalCode',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Date',
      field: 'date',
      sort: 'asc',
      width: 150
    }


  ],
  rows: data  // JSON object data we will use to populate the table
};



// Import JSON data from API link and store using hooks
useEffect(() => {
  axios
    .get("http://172.119.206.111/getAllTables.php")
    .then(result => setData(result.data));
}, []);

// Parase data so it is usable for Geocode API 
useEffect(() => {
data.map(address => (
      addressString = (address.street).concat(' ', address.city, ' ', address.state),
      Geocode.fromAddress(addressString)
      .then(response => {
        temp = response.results[0].geometry.location
        pairs.push([[temp.lat, temp.lng], address.name])
      },
      error => {
         console.error(error)
      })
));
});

function event(){
setPair(pairs);
}

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">A Million Thanks</Navbar.Brand>
      </Navbar>
      <br/>
      <MDBDataTable
      striped
      bordered
      hover
      theadColor="cyan lighten-5" 
      data={formatdata}
    />        

 <script>
 </script>

   <div>
    <button onClick={event}>Update Map</button>
    <Map center={[39.50, -98.35]} zoom={4.5}>
      <TileLayer
        attribution='&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
         />
        {pair.map((position, idx) =>
           <Marker key={`marker-${idx}`} position={position[0]}>
            <Popup>
              <span> {position[1]} </span>
            </Popup>
          </Marker>
         )}
    </Map>
  </div>
</div>
  );
}
