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
    <div className="container mt-5">
      <div className="text-center">
        <h2 className="fw-bold text-primary mb-4">
          TomaDigital Supply Chain Flow
        </h2>
        <p className="text-muted fst-italic">
          (Note: Here <span className="fw-bold text-dark">Owner</span> is the
          person who deployed the smart contract on the blockchain)
        </p>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h5 className="fw-bold text-secondary mb-2">Step 1:</h5>
        <p>
          Owner should register farmers, suppliers, distributors, and retailers
        </p>
        <p className="text-muted">
          (Note: This is a one-time step. Skip to step 2 if already done)
        </p>
        <button onClick={redirect_to_roles} className="btn btn-primary w-100">
          Register
        </button>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h5 className="fw-bold text-secondary mb-2">Step 2:</h5>
        <p>Owner should order tomatoes</p>
        <button onClick={redirect_to_addmed} className="btn btn-success w-100">
          Order Tomatoes
        </button>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h5 className="fw-bold text-secondary mb-2">Step 3:</h5>
        <p>Control the supply chain</p>
        <button onClick={redirect_to_supply} className="btn btn-warning w-100">
          Control Supply Chain
        </button>
      </div>

      <hr className="my-4" />

      <div className="text-center">
        <h5 className="fw-bold mb-3">Track the Tomatoes</h5>
        <button onClick={redirect_to_track} className="btn btn-outline-dark">
          Track Tomatoes
        </button>
      </div>
    </div>
  );
}
export default Home;
