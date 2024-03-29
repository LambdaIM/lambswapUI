import { Contract } from "@ethersproject/contracts";

import { ChainId, WETH } from "@webfans/uniswapsdk";


import ERC20_ABI from "../constants/abis/erc20.json";
import ERC20_ABI_LAMB from "../constants/abis/erc20lamb.json";

import ERC20_ABI_tlambbar from "../constants/abis/mLAMBBar.json";

import { getContractMulticall  } from "./utils.js";

// import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";

import ERC20_ABI_StakingRewards from "@/constants/abis/StakingRewards.json";

import IUniswapV2PairABI  from '@/constants/abis/UniswapV2Pair.json';
import mlambBarABI  from '@/constants/abis/mLAMBBar.json';


// returns null on errors
function useContract(
  address,
  ABI,

) {
  // console.log('useContract');
  if (!address || !ABI) return null;
  try {
    // return new web3.eth.Contract(ABI,address)
    return getContractMulticall(
      address,
      ABI
    );
  } catch (error) {
    console.error("Failed to get contract", error);
    return null;
  }
}

export function useTokenContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ERC20_ABI
  );
}
export function useStakingRewardsContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ERC20_ABI_StakingRewards
  );
}

export function mlambBarContractCall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    mlambBarABI
  );
}

export function useIUniswapV2PairABIContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    IUniswapV2PairABI
  );
}



