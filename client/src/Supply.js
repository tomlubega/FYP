import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function Supply() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const [currentAccount, setCurrentAccount] = useState("");
  const [loader, setLoader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  const loadBlockchainData = async () => {
    setLoader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentAccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(
        SupplyChainABI.abi,
        networkData.address
      );
      setSupplyChain(supplychain);
      var i;
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = {};
      const medStage = [];
      for (i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setLoader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };
  if (loader) {
    return (
      <div>
        <h1 className="wait">Loading...</h1>
      </div>
    );
  }
  const redirect_to_home = () => {
    history.push("/");
  };
  const handlerChangeID = (event) => {
    setID(event.target.value);
  };
  const handlerSubmitRMSsupply = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .RMSsupply(ID)
        .send({ from: currentAccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitManufacturing = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .Manufacturing(ID)
        .send({ from: currentAccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitDistribute = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .Distribute(ID)
        .send({ from: currentAccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitRetail = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .Retail(ID)
        .send({ from: currentAccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitSold = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .sold(ID)
        .send({ from: currentAccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>
          <strong>Current Account Address:</strong> {currentAccount}
        </span>
        <button
          onClick={redirect_to_home}
          className="btn btn-outline-danger btn-sm"
        >
          HOME
        </button>
      </div>

      {/* Flow Explanation */}
      <section className="mb-3">
        <h6 className="fw-bold text-primary">Supply Chain Flow:</h6>
        <p className="text-muted">
          Tomato Order → Farmer → Supplier → Distributor → Retailer → Consumer
        </p>
      </section>

      {/* Table Display */}
      <section className="mb-4">
        <table className="table table-bordered table-striped table-sm">
          <thead className="table-dark">
            <tr>
              <th>Tomatoes ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Current Processing Stage</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(MED).map((key) => (
              <tr key={key}>
                <td>{MED[key].id}</td>
                <td>{MED[key].name}</td>
                <td>{MED[key].description}</td>
                <td>{MedStage[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Steps Section */}
      <section className="mb-4">
        <h5 className="fw-bold">Step 1: Supply Tomatoes</h5>
        <p className="text-muted">
          (Only a registered Farmer can perform this step)
        </p>
        <form
          onSubmit={handlerSubmitRMSsupply}
          className="row g-2 align-items-center"
        >
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Tomatoes ID"
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100">Supply</button>
          </div>
        </form>
      </section>
      <hr />

      <section className="mb-4">
        <h5 className="fw-bold">Step 2: Supplier</h5>
        <p className="text-muted">
          (Only a registered Supplier can perform this step)
        </p>
        <form
          onSubmit={handlerSubmitManufacturing}
          className="row g-2 align-items-center"
        >
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Tomatoes ID"
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Manufacture</button>
          </div>
        </form>
      </section>
      <hr />

      <section className="mb-4">
        <h5 className="fw-bold">Step 3: Distribute</h5>
        <p className="text-muted">
          (Only a registered Distributor can perform this step)
        </p>
        <form
          onSubmit={handlerSubmitDistribute}
          className="row g-2 align-items-center"
        >
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Tomatoes ID"
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-warning w-100">Distribute</button>
          </div>
        </form>
      </section>
      <hr />

      <section className="mb-4">
        <h5 className="fw-bold">Step 4: Retail</h5>
        <p className="text-muted">
          (Only a registered Retailer can perform this step)
        </p>
        <form
          onSubmit={handlerSubmitRetail}
          className="row g-2 align-items-center"
        >
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Tomatoes ID"
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-secondary w-100">Retail</button>
          </div>
        </form>
      </section>
      <hr />

      <section className="mb-5">
        <h5 className="fw-bold">Step 5: Mark as Sold</h5>
        <p className="text-muted">
          (Only a registered Retailer can perform this step)
        </p>
        <form
          onSubmit={handlerSubmitSold}
          className="row g-2 align-items-center"
        >
          <div className="col-md-6">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Tomatoes ID"
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-dark w-100">Sold</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Supply;
