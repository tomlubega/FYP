// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    //Smart Contract owner will be the person who deploys the contract only he can authorize various roles like retailer, Supplier,etc
    address public Owner;

    //note this constructor will be called when smart contract will be deployed on blockchain
    constructor() public {
        Owner = msg.sender;
    }

    //Roles (flow of tomato supply chain)
    // Farmer; //This is where Supplier will get tomatoes to make tomatoes
    // Supplier;  //Various WHO guidelines should be followed by this person
    // Distributor; //This guy distributes the tomatoes to retailers
    // Retailer; //Normal customer buys from the retailer

    //modifier to make sure only the owner is using the function
    modifier onlyByOwner() {
        require(msg.sender == Owner);
        _;
    }

    //stages of a tomato in tomato supply chain
    enum STAGE {
        Init,
        Farmer,
        Supplier,
        Distribution,
        Retail,
        sold
    }
    //using this we are going to track every single tomato the owner orders

    //Tomatoes count
    uint256 public tomatoCtr = 0;
    //farmer count
    uint256 public rmsCtr = 0;
    //Supplier count
    uint256 public manCtr = 0;
    //distributor count
    uint256 public disCtr = 0;
    //retailer count
    uint256 public retCtr = 0;

    //To store information about the tomato
    struct tomato {
        uint256 id; //unique tomato id
        string name; //name of the tomato
        string description; //about tomato
        uint256 RMSid; //id of the Farmer for this particular tomato
        uint256 MANid; //id of the Supplier for this particular tomato
        uint256 DISid; //id of the distributor for this particular tomato
        uint256 RETid; //id of the retailer for this particular tomato
        STAGE stage; //current tomato stage
    }

    //To store all the tomatoes on the blockchain
    mapping(uint256 => tomato) public TomatoStock;

    //To show status to client applications
    function showStage(uint256 _tomatoID)
        public
        view
        returns (string memory)
    {
        require(tomatoCtr > 0);
        if (TomatoStock[_tomatoID].stage == STAGE.Init)
            return "Tomatoes Ordered";
        else if (TomatoStock[_tomatoID].stage == STAGE.Farmer)
            return "Farmer Stage";
        else if (TomatoStock[_tomatoID].stage == STAGE.Supplier)
            return "Manufacturing Stage";
        else if (TomatoStock[_tomatoID].stage == STAGE.Distribution)
            return "Distribution Stage";
        else if (TomatoStock[_tomatoID].stage == STAGE.Retail)
            return "Retail Stage";
        else if (TomatoStock[_tomatoID].stage == STAGE.sold)
            return "Tomatoes Sold";
    }

    //To store information about farmer
    struct farmer {
        address addr;
        uint256 id; //supplier id
        string name; //Name of the farmer
        string place; //Place the farmer is based in
    }

    //To store all the farmers on the blockchain
    mapping(uint256 => farmer) public RMS;

    //To store information about supplier
    struct supplier {
        address addr;
        uint256 id; //supplier id
        string name; //Name of the supplier
        string place; //Place the supplier is based in
    }

    //To store all the suppliers on the blockchain
    mapping(uint256 => supplier) public MAN;

    //To store information about distributor
    struct distributor {
        address addr;
        uint256 id; //distributor id
        string name; //Name of the distributor
        string place; //Place the distributor is based in
    }

    //To store all the distributors on the blockchain
    mapping(uint256 => distributor) public DIS;

    //To store information about retailer
    struct retailer {
        address addr;
        uint256 id; //retailer id
        string name; //Name of the retailer
        string place; //Place the retailer is based in
    }

    //To store all the retailers on the blockchain
    mapping(uint256 => retailer) public RET;

    //To add farmers. Only contract owner can add a new farmer
    function addRMS(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        rmsCtr++;
        RMS[rmsCtr] = farmer(_address, rmsCtr, _name, _place);
    }

    //To add supplier. Only contract owner can add a new supplier
    function addSupplier(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        manCtr++;
        MAN[manCtr] = supplier(_address, manCtr, _name, _place);
    }

    //To add distributor. Only contract owner can add a new distributor
    function addDistributor(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        disCtr++;
        DIS[disCtr] = distributor(_address, disCtr, _name, _place);
    }

    //To add retailer. Only contract owner can add a new retailer
    function addRetailer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner() {
        retCtr++;
        RET[retCtr] = retailer(_address, retCtr, _name, _place);
    }

    //To supply tomatoes from RMS supplier to the supplier
    function RMSsupply(uint256 _tomatoID) public {
        require(_tomatoID > 0 && _tomatoID <= tomatoCtr);
        uint256 _id = findRMS(msg.sender);
        require(_id > 0);
        require(TomatoStock[_tomatoID].stage == STAGE.Init);
        TomatoStock[_tomatoID].RMSid = _id;
        TomatoStock[_tomatoID].stage = STAGE.Farmer;
    }

    //To check if RMS is available in the blockchain
    function findRMS(address _address) private view returns (uint256) {
        require(rmsCtr > 0);
        for (uint256 i = 1; i <= rmsCtr; i++) {
            if (RMS[i].addr == _address) return RMS[i].id;
        }
        return 0;
    }

    //To supplier tomato
    function Manufacturing(uint256 _tomatoID) public {
        require(_tomatoID > 0 && _tomatoID <= tomatoCtr);
        uint256 _id = findMAN(msg.sender);
        require(_id > 0);
        require(TomatoStock[_tomatoID].stage == STAGE.Farmer);
        TomatoStock[_tomatoID].MANid = _id;
        TomatoStock[_tomatoID].stage = STAGE.Supplier;
    }

    //To check if Supplier is available in the blockchain
    function findMAN(address _address) private view returns (uint256) {
        require(manCtr > 0);
        for (uint256 i = 1; i <= manCtr; i++) {
            if (MAN[i].addr == _address) return MAN[i].id;
        }
        return 0;
    }

    //To supply tomatoes from Supplier to distributor
    function Distribute(uint256 _tomatoID) public {
        require(_tomatoID > 0 && _tomatoID <= tomatoCtr);
        uint256 _id = findDIS(msg.sender);
        require(_id > 0);
        require(TomatoStock[_tomatoID].stage == STAGE.Supplier);
        TomatoStock[_tomatoID].DISid = _id;
        TomatoStock[_tomatoID].stage = STAGE.Distribution;
    }

    //To check if distributor is available in the blockchain
    function findDIS(address _address) private view returns (uint256) {
        require(disCtr > 0);
        for (uint256 i = 1; i <= disCtr; i++) {
            if (DIS[i].addr == _address) return DIS[i].id;
        }
        return 0;
    }

    //To supply tomatoes from distributor to retailer
    function Retail(uint256 _tomatoID) public {
        require(_tomatoID > 0 && _tomatoID <= tomatoCtr);
        uint256 _id = findRET(msg.sender);
        require(_id > 0);
        require(TomatoStock[_tomatoID].stage == STAGE.Distribution);
        TomatoStock[_tomatoID].RETid = _id;
        TomatoStock[_tomatoID].stage = STAGE.Retail;
    }

    //To check if retailer is available in the blockchain
    function findRET(address _address) private view returns (uint256) {
        require(retCtr > 0);
        for (uint256 i = 1; i <= retCtr; i++) {
            if (RET[i].addr == _address) return RET[i].id;
        }
        return 0;
    }

    //To sell tomatoes from retailer to consumer
    function sold(uint256 _tomatoID) public {
        require(_tomatoID > 0 && _tomatoID <= tomatoCtr);
        uint256 _id = findRET(msg.sender);
        require(_id > 0);
        require(_id == TomatoStock[_tomatoID].RETid); //Only correct retailer can mark tomato as sold
        require(TomatoStock[_tomatoID].stage == STAGE.Retail);
        TomatoStock[_tomatoID].stage = STAGE.sold;
    }

    // To add new tomatoes to the stock
    function addTomato(string memory _name, string memory _description)
        public
        onlyByOwner()
    {
        require((rmsCtr > 0) && (manCtr > 0) && (disCtr > 0) && (retCtr > 0));
        tomatoCtr++;
        TomatoStock[tomatoCtr] = tomato(
            tomatoCtr,
            _name,
            _description,
            0,
            0,
            0,
            0,
            STAGE.Init
        );
    }
}
