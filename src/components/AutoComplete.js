// Autocomplete.js
import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: 5px;
  display: flex;

  button {
    flex: 0 0 200px;
  }
`;

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount({ map, mapApi } = this.props) {
    const options = {
      // restrict your search to a specific type of result
      types: ["geocode", "establishment"], // this to list only specific type of place details like only geocode or only address ["address"]
      fields: ["name", "geometry", "formatted_address", "address_components"], // to return only specified values from api
      // restrict your search to a specific country, or an array of countries
      componentRestrictions: { country: ["in"] }, // for us it is not required
    };
    this.autoComplete = new mapApi.places.Autocomplete(
      this.searchInput,
      options
    );
    this.autoComplete.addListener("place_changed", this.onPlaceChanged);
    this.autoComplete.bindTo("bounds", map);
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlaceChanged = ({ map, addplace } = this.props) => {
    const place = this.autoComplete.getPlace();

    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    addplace(place);
    this.searchInput.blur();
  };

  clearSearchBox() {
    this.searchInput.value = "";
  }

  render() {
    return (
      <>
        <Wrapper>
          <input
            className="search-input"
            ref={(ref) => {
              this.searchInput = ref;
            }}
            style={{ width: "100%", height: "100%", padding: "10px" }}
            type="text"
            placeholder="Enter a location"
          />
          <button onClick={this.clearSearchBox}>Clear</button>
        </Wrapper>
        <h1>When to use Autocomplete</h1>
        <ul style={{ textAlign: "left" }}>
          <li>
            This will add a UI Controls in our DOM and when the user search will
            returns place predictions in the form of a dropdown pick list.
          </li>

          <li>
            When the user selects a place from the list, information about the
            place is returned
          </li>
          <li>
            This class has many controls like types of place details, search
            restriction options etc
          </li>
          <li>
            <a href="https://developers.google.com/maps/documentation/javascript/reference/places-widget?hl=en">
              https://developers.google.com/maps/documentation/javascript/reference/places-widget?hl=en
            </a>
          </li>
        </ul>
      </>
    );
  }
}

export default AutoComplete;
