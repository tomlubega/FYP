import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";

function AddMed() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentAccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [TOMATO, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setTomatoStage] = useState();

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

  const loadBlockchaindata = async () => {
    setloader(true);
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
      const medCtr = await supplychain.methods.tomatoCtr().call();
      const tomato = {};
      const tomatoStage = [];
      for (i = 0; i < medCtr; i++) {
        tomato[i] = await supplychain.methods.TomatoStock(i + 1).call();
        tomatoStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(tomato);
      setTomatoStage(tomatoStage);
      setloader(false);
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
      var reciept = await SupplyChain.methods
        .addTomato(MedName, MedDes)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occured!!!");
    }
  };
  return (
    <div>
      <span>
        <b>Current Account Address:</b> {currentaccount}
      </span>
      <span
        onClick={redirect_to_home}
        className="btn btn-outline-danger btn-sm"
      >
        {" "}
        HOME
      </span>
      <br />
      <h5>Add Tomato Order:</h5>
      <form onSubmit={handlerSubmitMED}>
        <div className="form-group row">
          <label htmlFor="tomatoName" className="col-sm-2 col-form-label">
            Tomato Name
          </label>
          <div className="col-sm-6">
            <input
              className="form-control form-control-sm"
              type="text"
              id="tomatoName"
              onChange={handlerChangeNameMED}
              placeholder="Tomato Name"
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label
            htmlFor="tomatoDescription"
            className="col-sm-2 col-form-label"
          >
            Tomato Description
          </label>
          <div className="col-sm-6">
            <input
              className="form-control form-control-sm"
              type="text"
              id="tomatoDescription"
              onChange={handlerChangeDesMED}
              placeholder="Tomato Description"
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-6 offset-sm-2">
            <button className="btn btn-success btn-sm btn-block" type="submit">
              Order
            </button>
          </div>
        </div>
      </form>

      <br />
      <h5>Ordered Tomatos:</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Current Stage</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(TOMATO).map(function (key) {
            return (
              <tr key={key}>
                <td>{TOMATO[key].id}</td>
                <td>{TOMATO[key].name}</td>
                <td>{TOMATO[key].description}</td>
                <td>{MedStage[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AddMed;
