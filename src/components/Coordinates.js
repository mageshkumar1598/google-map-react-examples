import React from "react";

class Coordinates extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      isReadOnly: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.lat !== this.props.lat ||
      prevProps.lng !== this.props.lng ||
      prevProps.readOnly !== this.props.readOnly
    ) {
      this.setState({
        lat: this.props.lat,
        lng: this.props.lng,
        isReadOnly: this.props.readOnly,
      });
    }
  }
  handleChange = (event) => {
    let { name, value } = event.target;
    this.setState({
      [name]: Number(value),
    });
  };
  render() {
    let { lng, lat, isReadOnly } = this.state;
    return (
      <div>
        <label>
          Latitude{" "}
          <input
            onChange={this.handleChange}
            name="lat"
            type="number"
            value={lat}
            disabled={isReadOnly}
          />
        </label>
        <label>
          Longtitude{" "}
          <input
            onChange={this.handleChange}
            name="lng"
            type="number"
            value={lng}
            disabled={isReadOnly}
          />
        </label>
        <button onClick={() => this.props.applyCoordinates({ lat, lng })}>
          Apply changes
        </button>
      </div>
    );
  }
}

export default Coordinates;
