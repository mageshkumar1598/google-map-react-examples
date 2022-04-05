// MyGoogleMaps.js
import React, { Component } from "react";

import GoogleMapReact from "google-map-react";

import styled from "styled-components";

import AutoComplete from "./components/AutoComplete";
import Marker from "./components/Marker";
import Coordinates from "./components/Coordinates";
// import SearchBox from "./components/SearchBox";
const Wrapper = styled.main`
  width: 100%;
  height: 500px;
`;

class MyGoogleMap extends Component {
  defaultAddress = {
    state: "",
    country: "",
    city: "",
    pinCode: "",
    area: "",
    fullAddress: "",
  };
  state = {
    mapApiLoaded: false,
    mapInstance: null,
    mapApi: null,
    geoCoder: null,
    places: [],
    center: [],
    zoom: 9,
    address: {
      state: "",
      country: "",
      city: "",
      pinCode: "",
      area: "",
      fullAddress: "",
    },
    draggable: true,
    lat: "",
    lng: "",
    autoDetect: false, // automatically detect current location on load
    showMap: true,
  };
  detectMyLocation = this.detectMyLocation.bind(this);

  componentDidMount() {
    if (this.state.autoDetect) {
      this.setCurrentLocation();
    } else {
      this.setState({
        center: [35, 98],
        lat: 35,
        lng: 98,
      });
    }
  }
  componentWillMount() {
    // this.setCurrentLocation();
  }
  toggleShowMap = () => {
    this.setState((prevState) => {
      return {
        showMap: !prevState.showMap,
      };
    });
  };
  onMarkerInteraction = (childKey, childProps, mouse) => {
    this.setState({
      draggable: false,
      lat: mouse.lat,
      lng: mouse.lng,
    });
  };
  onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
    this.setState({
      draggable: true,
      center: [this.state.lat, this.state.lng],
    });
    this._generateAddress();
  };

  _onChange = ({ center, zoom }) => {
    this.setState({
      center: center,
      zoom: zoom,
    });
  };

  _onClick = (value) => {
    this.setState({
      lat: value.lat,
      lng: value.lng,
    });
  };

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });

    this._generateAddress();
  };

  addPlaceByAutoComplete = (place) => {
    console.log("AUTO COMPLETE__", place);
    // let extractAddress = this.extractAddress(place?.address_components);

    this.setState({
      places: [place],
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    this._generateAddress();
  };

  addPlaceBySearch = (place) => {
    let { formatted_address, geometry, address_components } = place && place[0];
    let extractAddress = this.extractAddress(address_components);
    this.setState({
      address: { ...extractAddress, fullAddress: formatted_address },
      zoom: 15,
      lat: geometry.location.lat(),
      lng: geometry.location.lng(),
    });
  };
  extractAddress(addressArray = []) {
    let placeInfo = { ...this.defaultAddress };
    if (addressArray && addressArray.length > 0) {
      addressArray.forEach((el) => {
        if (
          el.types.find(
            (type) => ["locality"].includes(type) //administrative_level_1
          )
        ) {
          placeInfo.city = el.long_name;
        } else if (
          el.types.find((type) =>
            ["state", "administrative_area_level_1"].includes(type)
          )
        ) {
          placeInfo.state = el.long_name;
        } else if (el.types.find((type) => type === "country")) {
          placeInfo.country = el.long_name;
        } else if (el.types.find((type) => type === "postal_code")) {
          placeInfo.pinCode = el.long_name;
        } else if (
          el.types.find((type) =>
            [
              "sublocality_level_1",
              "sublocality_level_2",
              "sublocality",
            ].includes(type)
          )
        ) {
          placeInfo.area = el.long_name;
        } else if (
          el.types.find((type) => ["street_number", "route"].includes(type))
        ) {
          let streetNo =
            el.types.find((type) => type === "street_number") || "";
          let streetName = el.types.find((type) => type === "route") || "";
          placeInfo.streetAddress = `${streetNo} ${streetName}`;
        }
      });
    }
    return placeInfo;
  }
  _generateAddress() {
    const { mapApi } = this.state;

    const geocoder = new mapApi.Geocoder();

    geocoder.geocode(
      { location: { lat: this.state.lat, lng: this.state.lng } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            let extractAddress = this.extractAddress(
              results[0].address_components
            );
            this.setState({
              address: {
                ...extractAddress,
                fullAddress: results[0].formatted_address,
              },
              zoom: 15,
            });
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  // Get Current Location Coordinates
  setCurrentLocation(generateAddress = false) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState(
          {
            center: [position.coords.latitude, position.coords.longitude],
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            zoom: 20,
          },
          function genAddress() {
            if (generateAddress) this._generateAddress();
          }
        );
      });
    }
  }

  detectMyLocation() {
    this.setCurrentLocation(true);
  }
  render() {
    const {
      mapApiLoaded,
      mapInstance,
      mapApi,
      showMap,
      lat,
      lng,
      center,
      zoom,
      draggable,
      address,
    } = this.state;

    return (
      <Wrapper>
        {showMap && (
          <GoogleMapReact
            center={center}
            zoom={zoom}
            draggable={draggable}
            onChange={this._onChange}
            onChildMouseDown={this.onMarkerInteraction}
            onChildMouseUp={this.onMarkerInteractionMouseUp}
            onChildMouseMove={this.onMarkerInteraction}
            onChildClick={() => {}}
            onClick={this._onClick}
            bootstrapURLKeys={{
              key: process.env.REACT_APP_PRABHU_API_KEY,
              libraries: ["places"],
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
            options={{
              panControl: true,
              mapTypeControl: true,
              rotateControl: true,
              streetViewControl: true,
            }}
            defaultZoom={10}
          >
            <Marker lat={this.state.lat} lng={this.state.lng} />
          </GoogleMapReact>
        )}
        <button onClick={this.toggleShowMap}>
          {showMap ? "Don't show map" : "Show Map"}
        </button>
        <div className="info-wrapper">
          <Coordinates
            lat={lat}
            lng={lng}
            readOnly={false}
            applyCoordinates={({ lat: latVal, lng: lngVal }) => {
              this.setState(
                {
                  lat: latVal,
                  lng: lngVal,
                  center: [latVal, lngVal],
                  zoom: 12,
                },
                () => {
                  this._generateAddress();
                }
              );
            }}
          />
          <div className="map-details">
            <label>
              Area <input disabled value={address.area} />
            </label>
            <label>
              City <input disabled value={address.city} />
            </label>
            <label>
              State <input disabled value={address.state} />
            </label>
            <label>
              Country <input disabled value={address.country} />
            </label>
            <label>
              PinCode <input disabled value={address.pinCode} />
            </label>
            <label>Address : {address.fullAddress}</label>
          </div>
        </div>
        {mapApiLoaded && (
          <div>
            <button
              onClick={this.detectMyLocation}
              style={{ padding: "20px", margin: "10px" }}
            >
              Use my current location
            </button>
            <hr />
            <h1>Search by auto complete</h1>
            <AutoComplete
              map={mapInstance}
              mapApi={mapApi}
              addplace={this.addPlaceByAutoComplete}
            />
            <br />
            {/* <h1>Search box</h1>
            <SearchBox
              map={mapInstance}
              mapApi={mapApi}
              addplace={this.addPlaceBySearch}
            />
            <br /> */}
          </div>
        )}
      </Wrapper>
    );
  }
}

export default MyGoogleMap;
