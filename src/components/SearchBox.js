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

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount({ map, mapApi } = this.props) {
    this.searchBox = new mapApi.places.SearchBox(this.searchInput, {
      fields: ["name", "geometry"],
    });
    this.searchBox.addListener("places_changed", this.onPlacesChanged);
    this.searchBox.bindTo("bounds", map);
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlacesChanged = ({ map, addplace } = this.props) => {
    const selected = this.searchBox.getPlaces();
    const { 0: place } = selected;
    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    addplace(selected);
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
            ref={(ref) => {
              this.searchInput = ref;
            }}
            style={{ width: "100%", height: "100%", padding: "10px" }}
            type="text"
            placeholder="Enter a location"
          />
          <button onClick={this.clearSearchBox}>Clear</button>
        </Wrapper>
        <h1>When to use Searchbox</h1>
        <ul style={{ textAlign: "left" }}>
          <li>
            When we need an extended list of predictions, which can include
            places along with suggested search terms.
          </li>
          <li>
            Example : For example, if the user enters 'pizza in new', the pick
            list may include the phrase 'pizza in New York, NY' as well as the
            names of various pizza outlets.
          </li>

          <li>
            SearchBox offers fewer options than Autocomplete for restricting the
            search.
          </li>

          <li>
            In the former, you can bias the search towards a given LatLngBounds.
          </li>
        </ul>
      </>
    );
  }
}

export default SearchBox;
