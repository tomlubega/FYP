import React from "react";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();
  
  const redirect_to_roles = () => {
    history.push("/roles");
  };
  const redirect_to_addmed = () => {
    history.push("/AddTomato");
  };
  const redirect_to_supply = () => {
    history.push("/supply");
  };
  const redirect_to_track = () => {
    history.push("/track");
  };
  
  return (
    <div className="container">
      <h2 className="text-tomato-red text-bold">Tomatoes Supply Chain Flow</h2>
      <div className="note-section">
        <p>(Note: Here <u>Owner</u> is the person who deployed the smart contract on the blockchain)</p>
      </div>
      <div className="step-section">
        <h5>Step 1: Owner Should Register farmers, Suppliers, Distributors, and Retailers</h5>
        <p>(Note: This is a one-time step. Skip to step 2 if already done)</p>
        <button onClick={redirect_to_roles} className="btn btn-primary">Register</button>
      </div>
      <div className="step-section">
        <h5>Step 2: Owner should order tomatoes</h5>
        <button onClick={redirect_to_addmed} className="btn btn-primary">Order Tomatoes</button>
      </div>
      <div className="step-section">
        <h5>Step 3: Control Supply Chain</h5>
        <button onClick={redirect_to_supply} className="btn btn-primary">Control Supply Chain</button>
      </div>
      <hr className="custom-hr" />
      <div className="track-section">
        <h5><b>Track</b> the tomatoes:</h5>
        <button onClick={redirect_to_track} className="btn btn-primary">Track Tomatoes</button>
      </div>
    </div>
  );
}

export default Home;
