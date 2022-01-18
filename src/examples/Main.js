import React, { Component } from "react";
import isEmpty from "lodash.isempty";

// components:
import Marker from "../components/Marker";

// examples:
import GoogleMap from "../components/GoogleMap";

// consts
import DEFAULT_CENTER from "../const/default_center";
import CurrentLocator from "../components/CurrentLocator";

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

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, places) => {
  // Get bounds by our places
  const bounds = getMapBounds(map, maps, places);
  // Fit map to bounds
  map.fitBounds(bounds);
  // Bind the resize listener
  bindResizeListener(map, maps, bounds);
};

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
      currentLocation: {
        lat: 0,
        lng: 0,
      },
      zoom: 11,
    };
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
    const getPosition = function (position) {
      this.setState((prevState) => ({
        ...prevState,
        currentLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      }));
    }.bind(this);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition);
    }
  }

  render() {
    const { places, currentLocation, zoom } = this.state;
    return (
      <>
        {!isEmpty(places) && (
          <GoogleMap
            bootstrapURLKeys={{ key: process.env.API_KEY }}
            defaultZoom={10}
            zoom={zoom}
            defaultCenter={DEFAULT_CENTER}
            center={[currentLocation.lat, currentLocation.lng]}
            yesIWantToUseGoogleMapApiInternals
            layerTypes={["TrafficLayer", "TransitLayer"]}
            onGoogleApiLoaded={({ map, maps }) =>
              apiIsLoaded(map, maps, places)
            }
          >
            {[].map((place) => (
              <Marker
                key={place.id}
                text={place.name}
                lat={place.geometry.location.lat}
                lng={place.geometry.location.lng}
              />
            ))}
            {currentLocation && (
              <CurrentLocator
                lat={currentLocation.lat}
                lng={currentLocation.lng}
              />
            )}
          </GoogleMap>
        )}
      </>
    );
  }
}

export default Main;
