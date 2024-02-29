import { MapContainer, TileLayer, Popup, Marker, GeoJSON, useMap, FeatureGroup, LayersControl, LayerGroup, Circle, useMapEvents } from 'react-leaflet'
import './index.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import L from "leaflet";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { solveRoute } from "@esri/arcgis-rest-routing";

const SchoolsMap = () => {


  const { school_coordinates } = useParams();
  console.log(school_coordinates);
  const [map, setMap] = useState(null);
  const [data, setData] = useState([]);
  const [position, setPosition] = useState(null)

  useEffect(() => {
    const getSchools = async () => {
      const response = await fetch('http://localhost:5001/schoolsdata', {
        method: 'GET',

      })

      setData(await response.json());
    }
    getSchools();

  }, [])







  //--------------------------------------------
  let latLngs = school_coordinates.split(',');
  let latLngslat = latLngs[0];
  let latLngslong = latLngs[1];

  console.log(latLngslat, latLngslong)
  let SchoolCoordinates = [latLngslong, latLngslat];
  console.log(SchoolCoordinates)

  const centerLeafletMapOnMarker = (e) => {

    map.panTo(SchoolCoordinates, map.getZoom())



    
  }
 


  

  //---------------------------------------------

  const Username = data.map((x) => x.name);

  const coords = data.map((x) => x.location.coordinates);
  
  function LocationMarker() {
    const map = useMapEvents({
      layeradd() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
      },
    })

    return position === null ? null : (

      <Marker position={position}>
        <Popup>{Object.values(position)}</Popup>
      </Marker>

    )

  }


  function panCurrentLocation() {
    map.flyTo(position, map.getZoom())
  }

 

  function updateRoute() {
    console.log(Object.values(position))
    let currentPosition = Object.values(position);
    // Create the arcgis-rest-js authentication object to use later.
    const authentication = ApiKeyManager.fromKey("AAPK9feec65d0f5141f7819d12a31d6bd3e3b5uct5C6MQ7Rpvf8A7RsjpLmESMpAWUQft7m_HWr-hxz8zWRtwit84oZRox7NY_L");

    // make the API request

    solveRoute({
      stops: [
        currentPosition,
        SchoolCoordinates


      ],
      endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",

      authentication
    })
      .then((response) => {
        const geomResponse = response.routes.features[0].geometry.paths[0];
     
        var polyline = L.polyline([geomResponse], { color: '#04a3ff' }).addTo(map);


      })
      .catch((error) => {
        console.error(error);
        alert("There was a problem using the route service. See the console for details.");
      });

  }

  const limeOptions = { color: 'lime' }



  return (

    <div >
      <div>
        <input
          value="Current Location"
          type='submit'
          onClick={panCurrentLocation}
        ></input>
        <input
          value="Show School"
          type='submit'
          onClick={centerLeafletMapOnMarker}
        ></input>
        <input
          value="route"
          type='submit'
          onClick={updateRoute}
        ></input>
      </div>
      <div className='leaflet-container'>
        <MapContainer ref={setMap}
          center={[30.505, 29.59]}
          zoom={9}
          scrollWheelZoom={false}
>
          <FeatureGroup>

           
          </FeatureGroup>
         

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        


          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Current location">
              <FeatureGroup>
                <LocationMarker />

              </FeatureGroup>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="School">
              <FeatureGroup>



                {data.map((x, index) => {
                  
                            
                  const position = [x.location.coordinates[1], x.location.coordinates[0]]
                  return <Marker className='school-marker'
                    key={index}
                    position={position}
                           >
                    <Popup>
                      <div className='popup'>
                        <h3><span className='popup-text'>Name:&nbsp;</span>{x.name}&nbsp;</h3>
                        <h3><span className='popup-text'>ID:&nbsp;</span>{x.nationalID}</h3>
                      </div>
                    </Popup>

                  </Marker>
                })}
              </FeatureGroup>
            </LayersControl.Overlay>

          </LayersControl>


        </MapContainer>

      </div>
    </div>

  )



}

export default SchoolsMap;