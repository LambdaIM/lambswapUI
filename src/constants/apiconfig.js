

// const baseUrl = window.location.protocol+'//history.lambswap.fi/' ;

const axios = require('axios');
import {historyAPIDomine} from './index.js';
 
const baseUrl = `${window.location.protocol}//${historyAPIDomine}/` ;


export  async function swapHistory(account,pageNum=1,showNum=10,chainID){
   const method_names =['swapExactTokensForTokens','removeLiquidityWithPermit','addLiquidity',
  'addLiquidityETH','swapExactETHForTokens','removeLiquidityETHWithPermit','swapExactTokensForETH',
  'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'].join(',');

   const pair_addresses=[
    '0x005E0D3157335F4Af22Ea89D7C389AFc6Bd514fc',
    '0x3ef407F05CA26A641E3A3d40B4CA0e7622676E1A',
    '0xE1f45DE5b21Feda6cB6A8e96c577f44240c039a2',
    '0xbd729565FcEC9ECEf76E5a3dD0175E00759B4e23'
    
  ].join(',');
    let data;
   try {
     data =  await  axios.get(`${baseUrl}api/txs?&category=swap&from=${account}&pageNum=${pageNum}&showNum=${showNum}&pair_addresses=${pair_addresses}`);  
   } catch (error) {

    data={
      
    };
   }
   

  // console.log(data);
  return data.data;

    /*
    http://59.110.68.178:8080/api/txs?method_names=*&
    from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
    pageNum=1&showNum=2
    */



}


//['stake','exit','getReward']


export  async function pledgeHistory(account,pageNum=1,showNum=10,chainID){
  const method_names =['stake','exit','getReward'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?&category=stake&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

//  console.log(data);
 return data.data;

   /*
   http://59.110.68.178:8080/api/txs?method_names=*&
   from=0x7c532C5605EFe372aa78a58a5E6a1863E119Dda9&
   pageNum=1&showNum=2
   */



}


export  async function buildrHistory(account,pageNum=1,showNum=10,chainID){
  const method_names =['Mint','Burn','Join','Exit','approval'].join(',');

  const data =  await  axios.get(`${baseUrl}api/txs?&category=builder&from=${account}&pageNum=${pageNum}&showNum=${showNum}`);

//  console.log(data);
 return data.data;
}

export async function coinohlc(id){
  const data =  await  axios.get(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=1`);

//  console.log(data);
 return data.data;


}


export async function pairPrice(pair_address){
  let data;
  try {
     data =  await  axios.get(`${baseUrl}api/24h_price_info?pair_address=${pair_address}`);  
  } catch (error) {
    data={
      data:''
    };
  }
  

//  console.log(data);
 return data.data;


}