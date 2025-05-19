import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function AddMed() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const [currentAccount, setCurrentAccount] = useState("");
  const [loader, setLoader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setMedStage] = useState();

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
  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };
  const handlerChangeDesMED = (event) => {
    setMedDes(event.target.value);
  };
  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .addMedicine(MedName, MedDes)
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
      <div className="d-flex justify-content-between align-items-center mb-4">
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

      <section className="card shadow-sm p-4 mb-4">
        <h5 className="fw-bold text-success mb-3">Add Tomatoes Order:</h5>
        <form
          onSubmit={handlerSubmitMED}
          className="row g-3 align-items-center"
        >
          <div className="col-md-4">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeNameMED}
              placeholder="Tomatoes Name"
              required
            />
          </div>
          <div className="col-md-5">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeDesMED}
              placeholder="Tomatoes Description"
              required
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-success w-100">Order</button>
          </div>
        </form>
      </section>

      <section className="mb-5">
        <h5 className="fw-bold mb-3">Ordered Tomatoes:</h5>
        <table className="table table-bordered table-striped table-sm">
          <thead className="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Current Stage</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(MED).map((key) => (
              <tr key={key}>
                <td>{MED[key].id}</td>f
                <td>{MED[key].name}</td>
                <td>{MED[key].description}</td>
                <td>{MedStage[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AddMed;
