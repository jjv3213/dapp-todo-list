import React, { useState, useEffect } from "react";
import Web3 from "web3";

function App() {
  const [account, setAccount] = useState("");

  const loadBlockChainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  };

  useEffect(() => {
    loadBlockChainData();
  }, []);

  return (
    <div className="App">
      <h1>Welcome....</h1>
      <p>Your account: {account}</p>
    </div>
  );
}

export default App;
