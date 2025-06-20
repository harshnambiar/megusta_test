import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3";
import axios from "axios";
import ABIETH from './abi_eth.json';
import ABIMNT from './abi_mnt.json';
import ABILSK from './abi_lsk.json';
import ABIGVT from './abi_gvt.json';
import ABIFLR from './abi_flr.json';
import ABISKL from './abi_skl.json';
import ABISTT from './abi_stt.json';




//50-36gold 47 9-39grey 11-21blue 26-40bluishgreen 34-16grey 26-40greenish 37-5blue 43-18fadedblue 30-46maroon 36-12gold
async function connect() {
  var url = window.location.toString();
  var chain_name = document.getElementById('chain_name').value;
  console.log(chain_name);
  if (chain_name == 'current'){
    console.log('no chain selected');
    return;
  }

  var chainId = 0;
  var cid = '';
  var chain = '';
  var symbol = '';
  var name = '';
  var rpc = '';

  if (chain_name == 'mnt'){
    chainId = 5003;
    cid = '0x138b';
    chain = 'Mantle Testnet Sepolia';
    name = 'MANTLE';
    symbol = 'MNT';
    //rpc = "https://rpc.sepolia.mantle.xyz";
    rpc = "https://rpc.ankr.com/mantle_sepolia";
  }
  else if (chain_name == 'flr'){
    chainId = 114;
    cid = '0x72';
    chain = 'Flare Testnet Coston 2';
    name = 'FLARE';
    symbol = 'C2FLR';
    rpc = "https://coston2-api.flare.network/ext/C/rpc";
  }
  else if (chain_name == 'lsk'){
    chainId = 4202;
    cid = '0x106a';
    chain = 'Lisk Sepolia'
    name = 'LISK';
    symbol = 'ETH';
    rpc = "https://rpc.sepolia-api.lisk.com";
  }
  else if (chain_name == 'fhe'){
    chainId = 8008148;
    cid = '0x7a31d4';
    chain = 'Fhenix Nitrogen';
    name = 'FHENIX';
    symbol = 'FHE';
    rpc = "https://api.nitrogen.fhenix.zone";
  }
  else if (chain_name == 'gvt'){
    chainId = 13505;
    cid = '0x34c1';
    chain = 'Gravity Alpha Testnet Sepolia';
    name = 'GRAVITY';
    symbol = 'G';
    rpc = "https://rpc-sepolia.gravity.xyz";
  }
  else if (chain_name == 'eth'){
    chainId = 11155111;
    cid = '0xaa36a7';
    chain = 'Sepolia';
    name = 'SEPOLIA-ETH';
    symbol = 'ETH';
    rpc = "https://sepolia.infura.io";
  }
  else if (chain_name == 'skl'){
    chainId = 37084624;
    cid = '0x235ddd0';
    chain = 'SKALE Nebula Hub Testnet';
    name = 'SKALE-NEBULA';
    symbol = 'sFUEL';
    rpc = "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet";
  }
  else if (chain_name == 'stt'){
    chainId = 50312;
    cid = '0xc488';
    chain = 'Somnia Testnet';
    name = 'SOMNIA';
    symbol = 'STT';
    rpc = "https://dream-rpc.somnia.network";
  }
  else {
    console.log('unrecognized chain');
    return;
  }
  const provider = await detectEthereumProvider()
  console.log(window.ethereum);
  if (provider && provider === window.ethereum) {
    console.log("MetaMask is available!");

    console.log(window.ethereum.networkVersion);
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: cid }]
        });
        console.log("changed to ".concat(name).concat(" testnet successfully"));

      } catch (err) {
        console.log(err);
          // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
        console.log("please add ".concat(name).concat(" Testnet as a network"));
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chain,
                chainId: cid,
                nativeCurrency: { name: name, decimals: 18, symbol: symbol },
                rpcUrls: [rpc]
              }
            ]
          });
        }
        else {
            console.log(err);
        }
      }
    }
    await startApp(provider, chain_name);
  } else {
    console.log("Please install MetaMask!")
  }



}
window.connect = connect;


async function startApp(provider, chain) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?")
  }
  else {
    const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.")
      } else {
        console.error(err)
      }
    })
    console.log("hi");
  const account = accounts[0];
  var web3 = new Web3(window.ethereum);
  const bal = await web3.eth.getBalance(account);
  //console.log("hi");
  console.log(bal);
  console.log(account);
  localStorage.setItem("acc",account.toString());
  const tnow = Date.now();
  localStorage.setItem('last_session', tnow.toString());
  localStorage.setItem("last_chain", chain);
  document.getElementById('nright').innerHTML = `
    <a>`.concat(account.slice(0,10).concat('...')).concat(`</a>
    <a style="color: black; background-color: #ff6600; cursor: pointer; border-radius: 5%;padding: 1%; padding-bottom: 2%" onclick='logout();'>logout</a>
  `);
  }
}

async function choose_chain(){
    const cname = document.getElementById('chain_name').value;
    console.log(cname);
    localStorage.setItem('chain_meg', cname);
}
window.choose_chain = choose_chain;


async function loadHome(){
    const w = window.innerWidth;
    if (w < 1000){
      document.getElementById('nright').style.display = 'none';
      document.getElementById('gli').style.display = 'none';
    };
    console.log(w);
    localStorage.setItem('warn_once','n');
    var c = localStorage.getItem('last_chain');
    var ts = localStorage.getItem('last_session');
    const tnow = Date.now();
    if (c == null || ts == null){
      localStorage.setItem('last_chain', 'eth');
      localStorage.setItem('last_session', tnow.toString());
      localStorage.setItem('acc', '');
    }
    else if (parseInt(tnow) - parseInt(ts) > 6000000){
      localStorage.setItem('last_session', tnow.toString());
      localStorage.setItem('acc', '');
    }
    c = localStorage.getItem('last_chain');
    var acc = localStorage.getItem('acc');
    console.log(acc);
   if (acc == null || acc == ''){
      return;
    }
    else {
      document.getElementById('nright').innerHTML = `
        <a>`.concat(acc.slice(0,10).concat('...')).concat(`</a>
        <a style="color: black; background-color: #ff6600; cursor: pointer; border-radius: 5%;padding: 1%; padding-bottom: 2%" onclick='logout();'>logout</a>
      `);

    }


}
window.loadHome = loadHome;

async function logout(){
  localStorage.setItem('last_chain', null);
  localStorage.setItem('last_session', null);
  localStorage.setItem('acc', '');
  document.getElementById('nright').innerHTML = `
    <select name="typc" id="chain_name" style="width: 60%;font-size: 1.4em;padding-top: 3%;padding-bottom: 1%;">
        <option value="current">Select Chain</option>
        <option value="eth">Ethereum</option>
        <option value="mnt">Mantle</option>
        <option value="lsk">Lisk</option>
        <option value="flr">Flare</option>
        <option value="gvt">Gravity</option>
        <option value="skl">Skale</option>


    </select>
    <img src="img/wallet-icon.svg" alt="Wallet" class="wallet-icon" onclick="connect();">
  `;
}
window.logout = logout;

async function getMyScore() {
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    const web3 = new Web3(window.ethereum);
    var abiInstance;
    var contract;
    
    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x235df0fa64b5c273a83835906b5c8f9acb5fe878");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xb0A2aBcb9C0E18b5C66b69d8f7b9018118CE681C");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else if (chn == 'stt'){
        abiInstance = ABISTT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else {
        console.log('unknown chain');
        return;
    }
  
  try  {
    const arg = BigInt(1);
    var res = await contract.methods['fetch_myscore'](arg).call({from: acc});
    console.log(res);
  }
  catch (err){
    console.log(err);
  }
}
window.getMyScore = getMyScore;


async function getBest() {
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    const web3 = new Web3(window.ethereum);
    var abiInstance;
    var contract;
    
    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else if (chn == 'stt'){
        abiInstance = ABISTT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else {
        console.log('unknown chain');
        return;
    }
  

  const encodedArg = web3.eth.abi.encodeParameter('uint256', 1);
  const method = abiInstance.find(m => m.name === 'fetch_bestscore');
  const encodedTx = web3.eth.abi.encodeFunctionCall(method, [1]); 
  const res = await web3.eth.call({to: contract.options.address, data: encodedTx});
  console.log(res);
  
  
}
window.getBest = getBest;


async function getCount() {
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    const web3 = new Web3(window.ethereum);
    var abiInstance;
    var contract;
    
    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else if (chn == 'stt'){
        abiInstance = ABISTT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else {
        console.log('unknown chain');
        return;
    }
  
  
  
  contract.methods.fetch_count()
    .call({from: acc})
    .then((result) => {
        console.log('Count is:', result);
        console.log(typeof result);
    })
    .catch((error) => {
        console.error('Call Error:', error);
    });
}
window.getCount = getCount;

async function registerScore(){
    const web3 = new Web3(window.ethereum);
    const chn = localStorage.getItem("last_chain");
    const acc = localStorage.getItem("acc");
    var abiInstance;
    var contract;
    console.log(chn);
    if (chn == 'eth'){
        abiInstance = ABIETH.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
    }
    else if (chn == 'mnt'){
        abiInstance = ABIMNT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x7440fb654481859c181a5b135a47f69b90f4c7ce");
        
    }
    else if (chn == 'lsk'){
        abiInstance = ABILSK.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x293617E4cd7C57AD2Dd6239B4e7F47e0Fe1691a9");
    }
    else if (chn == 'flr'){
        abiInstance = ABIFLR.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0x3C35228c92bd72D8A8871583F000F7EB70D1f29c");
    }
    else if (chn == 'gvt'){
        abiInstance = ABIGVT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xAA1683d804f95FF02BB829A5616baDAc0B10732E");
        
    }
    else if (chn == 'skl'){
        abiInstance = ABISKL.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else if (chn == 'stt'){
        abiInstance = ABISTT.abi;
        contract = new web3.eth.Contract(
                                    abiInstance,
                     "0xddFA5fE9a651eF1411605dA65D73971429841280");
    }
    else {
        console.log('unknown chain');
        return;
    }

  var gasEst = BigInt(100000);
  var gasPriceEst = BigInt(10);
  try {
    gasEst = await contract.methods.register(44,1).estimateGas({from: acc});
    gasEst = (BigInt(100) * gasEst)/BigInt(10);
    gasPriceEst = await web3.eth.getGasPrice();
    gasPriceEst = (BigInt(100) * gasPriceEst)/BigInt(10);
  }
  catch (err){
    console.log(err);
  }



  contract.methods.register(2490, 2)
    .send({from: acc, gas: gasEst, gasPrice: gasPriceEst})
    .catch((error) => {
        console.error('Call Error:', error);
    });

    const wl = '0x99E90CEe9A53D9171fc25CA143004f8f209858E3';
  const ts = (Date.now()).toString();
  const data = {
    wallet: wl,
    timestamp: ts,
    score: "2490",
    gameId: "2",
    chain: "SKL",
    sessionId: wl.concat((Math.floor(Math.random(1000,9999))).toString()).concat(ts)
  };
  try{
    const res = await axios.post("http://localhost:5000/api/megustacampaign/set", {
      data: data,
    });

    console.log(res);
  }
  catch (err){
    console.log(err);
  }
    
}
window.registerScore = registerScore;


async function to_site(){
    window.open("https://megustaapp.netlify.app", "_blank");
}
window.to_site = to_site;


async function getDbScores(){

  var ret1 = [];
  var ret2 = [];
  var ret3 = [];
  try{
    const res = await axios.post("http://localhost:5000/api/megustacampaign/all", {
      data: null,
    });
    var i = 0;
    while (i < res.data.entries1.length){
      ret1.push(res.data.entries1[i]);
      i++;
    }
    i = 0;
    while (i < res.data.entries2.length){
      ret2.push(res.data.entries2[i]);
      i++;
    }
    i = 0;
    while (i < res.data.entries3.length){
      ret3.push(res.data.entries3[i]);
      i++;
    }

  }
  catch (err){
    console.log(err);
  }
  console.log('First Game:');
  console.log(ret1);
  console.log('Second Game');
  console.log(ret2);
  console.log('Third Game');
  console.log(ret3);
}
window.getDbScores = getDbScores;

async function getMyDbScore(){
  const data = {
    wallet: '0xD0dC8A261Ad1B75A92C5e502AE10c3Fde042b879',
    gameId: "2"
  };

  try{
    const res = await axios.post("http://localhost:5000/api/megustacampaign/get", {
      data: data,
    });
    console.log(res.data.entries);
  }
  catch (err){
    console.log(err);
  }
}
window.getMyDbScore = getMyDbScore;

async function setDbScore(){
  const wl = '0x5C7fA034Bcc308AFcCa8F93FFe5E38838b038F09';
  const ts = (Date.now()).toString();
  const data = {
    wallet: wl,
    timestamp: ts,
    score: "193",
    gameId: "3",
    chain: "SKL",
    sessionId: wl.concat((Math.floor(Math.random(1000,9999))).toString()).concat(ts)
  };
  try{
    const res = await axios.post("http://localhost:5000/api/megustacampaign/set", {
      data: data,
    });

    console.log(res);
  }
  catch (err){
    console.log(err);
  }
}
window.setDbScore = setDbScore;


async function setQrtest(){
  const ts = (Date.now()).toString();
  const data = {
    mnemonic: 'ninetyseven ninetyeight ninetynine hundred',
    timestamp: ts,
    encoded: false,
  };
  try{
    const res = await axios.post("http://localhost:5000/api/qrtest/set", {
      data: data,
    });

    console.log(res);
  }
  catch (err){
    console.log(err);
  }
}
window.setQrtest = setQrtest;



async function getQrtest(){

  try{
    const res = await axios.post("http://localhost:5000/api/qrtest/get", {
      data: null,
    });

  console.log(res);
  }
  catch (err){
    console.log(err);
  }

}
window.getQrtest = getQrtest;


async function createKey(){

  try{
    const res = await axios.post("http://localhost:5000/api/quantumsure/create", {
      data: null,
    });

  console.log(res);
  }
  catch (err){
    console.log(err);
  }

}
window.createKey = createKey;


async function deleteKey(){
  const data = {
    api_key: "9171750409791300585",
    secret_phrase: "duk4dct0",
  };
  try{
    const res = await axios.post("http://localhost:5000/api/quantumsure/delete", {
      data: data,
    });

  console.log(res);
  }
  catch (err){
    console.log(err);
  }

}
window.deleteKey = deleteKey;

async function decryptData(){
  const data = {
    encrypted_text: "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:xJAzZakHhNFMsDjqJ4YhqQ==.HN5uQPBWvyFVZG25zBgvXlSNN+X+mU/groTC5ngL8YEICc+S/UHS7huQ/JgSTJxU.No1jUKz0nOyvfJBBRcFJvrC3Gi3VYpIOCM3S+3lZIUU=",
  };
  const headers = {
        'api_key': "9751750412188204396",
  }
  try{
    const res = await axios.post("http://localhost:5000/api/quantumsure/decrypt", {
      data: data
      },
      {
      headers: headers
      });

  console.log(res);
  }
  catch (err){
    console.log(err);
  }

}
window.decryptData = decryptData;

async function encryptData(){
  const data = {
    normal_text: "lookin at ze mun, feelin vary vary spiritual",
  };
  const headers = {
        'api_key': "9751750412188204396",
        'public_key': "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"
  };
  try{
    const res = await axios.post("http://localhost:5000/api/quantumsure/encrypt", {
      data: data,
    }, {
      headers: headers
    });

  console.log(res);
  }
  catch (err){
    console.log(err);
  }

}
window.encryptData = encryptData;
