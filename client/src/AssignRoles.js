import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import { useHistory } from "react-router-dom";

function AssignRoles() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);
  const [currentaccount, setCurrentAccount] = useState("");
  const [loader, setLoader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [RMSname, setRMSname] = useState();
  const [MANname, setMANname] = useState();
  const [DISname, setDISname] = useState();
  const [RETname, setRETname] = useState();
  const [RMSplace, setRMSplace] = useState();
  const [MANplace, setMANplace] = useState();
  const [DISplace, setDISplace] = useState();
  const [RETplace, setRETplace] = useState();
  const [RMSaddress, setRMSaddress] = useState();
  const [MANaddress, setMANaddress] = useState();
  const [DISaddress, setDISaddress] = useState();
  const [RETaddress, setRETaddress] = useState();
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();

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
      const rmsCtr = await supplychain.methods.rmsCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i] = await supplychain.methods.RMS(i + 1).call();
      }
      setRMS(rms);
      const manCtr = await supplychain.methods.manCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i] = await supplychain.methods.MAN(i + 1).call();
      }
      setMAN(man);
      const disCtr = await supplychain.methods.disCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i] = await supplychain.methods.DIS(i + 1).call();
      }
      setDIS(dis);
      const retCtr = await supplychain.methods.retCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i] = await supplychain.methods.RET(i + 1).call();
      }
      setRET(ret);
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
  const handlerChangeAddressRMS = (event) => {
    setRMSaddress(event.target.value);
  };
  const handlerChangePlaceRMS = (event) => {
    setRMSplace(event.target.value);
  };
  const handlerChangeNameRMS = (event) => {
    setRMSname(event.target.value);
  };
  const handlerChangeAddressMAN = (event) => {
    setMANaddress(event.target.value);
  };
  const handlerChangePlaceMAN = (event) => {
    setMANplace(event.target.value);
  };
  const handlerChangeNameMAN = (event) => {
    setMANname(event.target.value);
  };
  const handlerChangeAddressDIS = (event) => {
    setDISaddress(event.target.value);
  };
  const handlerChangePlaceDIS = (event) => {
    setDISplace(event.target.value);
  };
  const handlerChangeNameDIS = (event) => {
    setDISname(event.target.value);
  };
  const handlerChangeAddressRET = (event) => {
    setRETaddress(event.target.value);
  };
  const handlerChangePlaceRET = (event) => {
    setRETplace(event.target.value);
  };
  const handlerChangeNameRET = (event) => {
    setRETname(event.target.value);
  };
  const handlerSubmitRMS = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .addRMS(RMSaddress, RMSname, RMSplace)
        .send({ from: currentaccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitMAN = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .addManufacturer(MANaddress, MANname, MANplace)
        .send({ from: currentaccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitDIS = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .addDistributor(DISaddress, DISname, DISplace)
        .send({ from: currentaccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };
  const handlerSubmitRET = async (event) => {
    event.preventDefault();
    try {
      var receipt = await SupplyChain.methods
        .addRetailer(RETaddress, RETname, RETplace)
        .send({ from: currentaccount });
      if (receipt) {
        loadBlockchainData();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>
          <b>Current Account Address:</b> {currentaccount}
        </span>
        <button
          onClick={redirect_to_home}
          className="btn btn-outline-danger btn-sm"
        >
          HOME
        </button>
      </div>

      {/* Tomato Farmers */}
      <section className="mb-4">
        <h4 className="text-success fw-bold mb-3">Tomato Farmers:</h4>
        <form onSubmit={handlerSubmitRMS} className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeAddressRMS}
              placeholder="Ethereum Address"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeNameRMS}
              placeholder="Tomato Farmer Name"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangePlaceRMS}
              placeholder="Based In"
              required
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-success w-100">Register</button>
          </div>
        </form>
        <table className="table table-bordered table-sm table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Place</th>
              <th>Ethereum Address</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(RMS).map((key) => (
              <tr key={key}>
                <td>{RMS[key].id}</td>
                <td>{RMS[key].name}</td>
                <td>{RMS[key].place}</td>
                <td>{RMS[key].addr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Suppliers */}
      <section className="mb-4">
        <h4 className="text-primary fw-bold mb-3">Suppliers:</h4>
        <form onSubmit={handlerSubmitMAN} className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeAddressMAN}
              placeholder="Ethereum Address"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeNameMAN}
              placeholder="Supplier Name"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangePlaceMAN}
              placeholder="Based In"
              required
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100">Register</button>
          </div>
        </form>
        <table className="table table-bordered table-sm table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Place</th>
              <th>Ethereum Address</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(MAN).map((key) => (
              <tr key={key}>
                <td>{MAN[key].id}</td>
                <td>{MAN[key].name}</td>
                <td>{MAN[key].place}</td>
                <td>{MAN[key].addr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Distributors */}
      <section className="mb-4">
        <h4 className="text-warning fw-bold mb-3">Distributors:</h4>
        <form onSubmit={handlerSubmitDIS} className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeAddressDIS}
              placeholder="Ethereum Address"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeNameDIS}
              placeholder="Distributor Name"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangePlaceDIS}
              placeholder="Based In"
              required
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-warning w-100 text-white">
              Register
            </button>
          </div>
        </form>
        <table className="table table-bordered table-sm table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Place</th>
              <th>Ethereum Address</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(DIS).map((key) => (
              <tr key={key}>
                <td>{DIS[key].id}</td>
                <td>{DIS[key].name}</td>
                <td>{DIS[key].place}</td>
                <td>{DIS[key].addr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Retailers */}
      <section className="mb-5">
        <h4 className="text-danger fw-bold mb-3">Retailers:</h4>
        <form onSubmit={handlerSubmitRET} className="row g-2 mb-3">
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeAddressRET}
              placeholder="Ethereum Address"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangeNameRET}
              placeholder="Retailer Name"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              onChange={handlerChangePlaceRET}
              placeholder="Based In"
              required
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-danger w-100">Register</button>
          </div>
        </form>
        <table className="table table-bordered table-sm table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Place</th>
              <th>Ethereum Address</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(RET).map((key) => (
              <tr key={key}>
                <td>{RET[key].id}</td>
                <td>{RET[key].name}</td>
                <td>{RET[key].place}</td>
                <td>{RET[key].addr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AssignRoles;
