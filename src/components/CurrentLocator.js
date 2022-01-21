import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.button`
  flex: 0 0 200px;
  height: 40px;
  background-color: white;
  color:"blue",
  border: 2px solid #fff;
  user-select: none;
  cursor: ${(props) => (props.onClick ? "pointer" : "default")};
  &:hover {
    z-index: 1;
  }
`;

const CurrentLocator = ({ text, onClick }) => (
  <Wrapper onClick={onClick}>{text}</Wrapper>
);

CurrentLocator.defaultProps = {
  onClick: null,
};

CurrentLocator.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};

export default CurrentLocator;
