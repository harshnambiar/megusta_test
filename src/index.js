import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3";
import ABIETH from './abi_eth.json';
import ABIMNT from './abi_mnt.json';
import ABILSK from './abi_lsk.json';
import ABIGVT from './abi_gvt.json';
import ABIFLR from './abi_flr.json';





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
                     "0x2765cd9a5892c0c19fcb5a9b0c76aef65fafe421");
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
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
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
                     "0x2765cd9a5892c0c19fcb5a9b0c76aef65fafe421");
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
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
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
                     "0x2765cd9a5892c0c19fcb5a9b0c76aef65fafe421");
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
                     "0x0eab7b60140079059ae79357b2b9d582b90bedd1");
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


