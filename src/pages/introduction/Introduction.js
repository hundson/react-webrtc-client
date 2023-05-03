import React, { useEffect } from "react";
import ConnectButtons from "./ConnectButtons";
import { connect } from "react-redux";
import { setIsCallHost } from "../../store/actions";
import "./Introduction.css";

const Introduction = ({ setIsCallHostAction }) => {
  useEffect(() => {
    setIsCallHostAction(false);
  }, []);

  return (
    <div className="introduction_container">
      <div className="introduction_panel">
        <h2>AUGMENTED REALITY MATCHER</h2>
        <ConnectButtons />
      </div>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    setIsCallHostAction: (isCallHost) => dispatch(setIsCallHost(isCallHost)),
  };
};

export default connect(null, mapActionsToProps)(Introduction);
