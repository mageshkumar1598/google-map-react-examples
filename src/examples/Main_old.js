import React, { Component } from "react";
// import isEmpty from "lodash.isempty";
import GoogleMapReact from "google-map-react";
// components:
import Marker from "../components/Marker";

// examples:
// import GoogleMap from "../components/GoogleMap";

// consts
// import DEFAULT_CENTER from "../const/default_center";
// import CurrentLocator from "../components/CurrentLocator";
// import SearchBox from "../components/SearchBox";
import AutoComplete from "../components/AutoComplete";

// Return map bounds based on list of places
const getMapBounds = (map, maps, places) => {
  const bounds = new maps.LatLngBounds();

  places.forEach((place) => {
    bounds.extend(
      new maps.LatLng(place.geometry.location.lat, place.geometry.location.lng)
    );
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, "idle", () => {
    maps.event.addDomListener(window, "resize", () => {
      map.fitBounds(bounds);
    });
  });
};
const GoogleMapConfig = {
  key: process.env.API_KEY,
  libraries: "places, geometry",
};
class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      geoCoder: null,
      places: [],
      center: [],
      zoom: 9,
      address: "",
      draggable: true,
      currentLocation: {
        lat: null,
        lng: null,
      },
    };
  }
  componentWillMount() {
    this.detectCurrentLocation();
  }
  componentDidMount() {
    fetch("/google-map-react-examples/places.json", {
      "Content-Type": "application/json",
    })
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((result) => {
          result.show = false; // eslint-disable-line no-param-reassign
        });
        this.setState({ places: data.results });
      });
  }
  apiHasLoaded = (map, maps, places) => {
    // Get bounds by our places
    const bounds = getMapBounds(map, maps, places);
    // Fit map to bounds
    map.fitBounds(bounds);
    // Bind the resize listener
    bindResizeListener(map, maps, bounds);
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });
  };
  detectCurrentLocation = () => {
    const getPosition = function (position) {
      this.setState((prevState) => ({
        ...prevState,
        center: [position.coords.latitude, position.coords.longitude],
        currentLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      }));
    }.bind(this);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition);
    }
  };
  render() {
    const { places, currentLocation, zoom, mapInstance, mapApi, mapApiLoaded } =
      this.state;
    return (
      <>
        {/* <div style={{ display: "flex", alignItems: "center" }}>
          <CurrentLocator
            onClick={this.detectCurrentLocation}
            text={"Use current location"}
          />
          {mapApiLoaded && (
            <SearchBox
              map={mapInstance}
              mapApi={mapApi}
              addplace={this.addPlace}
            />
          )}
        </div> */}
        <AutoComplete
          map={mapInstance}
          mapApi={mapApi}
          addplace={this.addPlace}
        />
        <div style={{ width: "400px", height: "500px" }}>
          {/* <GoogleMap
            bootstrapURLKeys={GoogleMapConfig}
            defaultZoom={10}
            zoom={zoom}
            defaultCenter={DEFAULT_CENTER}
            center={[currentLocation.lat, currentLocation.lng]}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={["TrafficLayer", "TransitLayer"]}
            onGoogleApiLoaded={({ map, maps }) =>
              this.apiHasLoaded(map, maps, places)
            }
          >
            {!isEmpty(places) &&
              places.map((place) => (
                <Marker
                  key={place.id}
                  text={place.name}
                  lat={place.geometry.location.lat}
                  lng={place.geometry.location.lng}
                />
              ))}
            {currentLocation && (
              <Marker lat={currentLocation.lat} lng={currentLocation.lng} />
            )}
          </GoogleMap> */}
          <GoogleMapReact
            center={this.state.center}
            zoom={this.state.zoom}
            draggable={this.state.draggable}
            onChange={this._onChange}
            onChildMouseDown={this.onMarkerInteraction}
            onChildMouseUp={this.onMarkerInteractionMouseUp}
            onChildMouseMove={this.onMarkerInteraction}
            onChildClick={() => console.log("child click")}
            onClick={this._onClick}
            bootstrapURLKeys={{
              key: "YOUR_API_KEY",
              libraries: ["places", "geometry"],
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
          >
            <Marker
              text={this.state.address}
              lat={this.state.lat}
              lng={this.state.lng}
            />
          </GoogleMapReact>
        </div>
      </>
    );
  }
}

export default Main;
