import multiSymbolData from "@/constants/earnList.json";
import tokenlist from "@/constants/token.json";
import config from "@/config/config.js";
import { TokenAmount } from "@webfans/uniswapsdk";
import _ from 'underscore';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });


import { useStakingRewardsbalance, useStakingRewardstotalSupply, useStakingRewardsRead, useTokenBalance, useTokentotalSupply } from "./allowances.js";
import { usemLAMBContract } from './useContract.js';

import { Provider } from '@webfans/ethers-multicall';

import { useStakingRewardsContractMulticall, useTokenContractMulticall, mlambBarContractCall } from "@/contacthelp/useContractMulticall.js";

import { calculateGasMargin } from "@/contacthelp/utils.js";

import axios from 'axios';

function getTokenInfo(chainID, address) {
    let result;
    _.find(tokenlist.tokens, (item) => {
        if (item.chainId === chainID && item.address.toString() === address.toString()) {
            result = item;
        }
    });
    return result;
}

export async function StakingRewardList(library, account, chainID) {
    // console.log({library, account, chainID});
    const list = multiSymbolData || [];
    const result = [];

    list.forEach((item) => {
        if (item.chainId === chainID) {
            result.push(item);
        }
    });

    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        let balance, totalSupply, rewardRate, earned, rewardToken, TokenAddress, TokenAddressbalance;
        const originRewardRate = await useStakingRewardsRead(library, account, element, 'rewardRate', []);
        totalSupply = await useStakingRewardstotalSupply(library, account, element);
        rewardRate = new TokenAmount(element, originRewardRate.toString());
        // 未连接钱包状态
        if (!account) {
            element.data = {
                balance: '',
                totalSupply: totalSupply.toSignificant(6),
                rewardRate: rewardRate.toSignificant(6),
                LPTokenAddress: '',
                earned: '',
                rewardToken: '',
                LPTokenbalance: '',
            };
        } else {
            try {
                const rewardsTokenAddress = await useStakingRewardsRead(library, account, element, 'rewardsToken', []);

                rewardToken = getTokenInfo(chainID, rewardsTokenAddress);

                balance = await useStakingRewardsbalance(library, account, element);

                //  TokenAddress = await useStakingRewardsRead(library,account,element,'stakingToken',[]);
                earned = await useStakingRewardsRead(library, account, element, 'earned', [account]);

                TokenAddress = await useStakingRewardsRead(library, account, element, 'stakingToken', []);

                const newToken = _.clone(element);
                newToken.address = TokenAddress;
                TokenAddressbalance = await useStakingRewardsbalance(library, account, newToken);

                earned = new TokenAmount(element, earned.toString());

                //  console.log('TokenAddress',TokenAddress)

            } catch (error) {
                console.log(error);
            }
            element.data = {
                balance: balance.toSignificant(6),
                totalSupply: totalSupply.toSignificant(6),
                rewardRate: rewardRate.toSignificant(6),
                LPTokenAddress: TokenAddress,
                earned: earned.toSignificant(6),
                rewardToken: rewardToken.symbol,
                LPTokenbalance: TokenAddressbalance.toSignificant(6),
            };
        }
        element.tokens = [];
        _.find(tokenlist.tokens, (item) => {
            if (item.chainId === chainID && element.symbol.indexOf(item.symbol) > -1) {
                element.tokens.push(item);

            }

        });


    }
    return result;
}


export async function StakingRewardListbatch(library, account, chainID) {
    console.log({ library, account, chainID });
    const list = multiSymbolData || [];
    const result = [];
    list.forEach((item) => {
        if (item.chainId === chainID && item.kind === 'multi') {
            result.push(item);
        }
    });
    let callList = [];
    result.forEach((element) => {
        const TokenAContract = useStakingRewardsContractMulticall(element);
        callList.push(TokenAContract.rewardRate());
        callList.push(TokenAContract.stakingToken());
        callList.push(TokenAContract.totalSupply());
        callList.push(TokenAContract.rewardsToken());
    });
    const ethcallProvider = new Provider(library, chainID);
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
    const infoList = await ethcallProvider.all(callList);
    console.log({ infoList });


    callList = [];
    let j = 0;

    for (let index = 0; index < infoList.length; index += 4) {
        const element = result[j];
        j++;
        const rewardRate = infoList[index];
        const totalSupply = infoList[index + 2];
        const stakingToken_ = infoList[index + 1];
        const rewardsToken_ = infoList[index + 3];

        // 不需要链接钱包就能获取到的数据
        const rewardRateNumber = new BigNumber(rewardRate.toString()).div('1e18').toNumber();
        const totalSupplyNumber = new BigNumber(totalSupply.toString()).div('1e18').toNumber();
        // console.log({totalSupplyNumber});
        const rewardTokenSymbol = getTokenInfo(chainID, rewardsToken_);
        element.data = {
            rewardRate: rewardRateNumber,
            LPTokenAddress: stakingToken_,
            totalSupply: totalSupplyNumber,
            rewardToken: rewardTokenSymbol.symbol,
        };
        // 未连接钱包状态
        if (!account) {
            element.data = {
                earned: '',
                balance: '',
                LPTokenbalance: '',
                rewardRate: rewardRateNumber,
                LPTokenAddress: stakingToken_,
                totalSupply: totalSupplyNumber,
                rewardToken: rewardTokenSymbol.symbol,
            };
        } else {
            const stakingToken = {
                address: stakingToken_
            };
            try {
                // const rewardTokenContract = useTokenContractMulticall(rewardToken);
                const stakingTokenContract = useTokenContractMulticall(stakingToken);
                const TokenAContract = useStakingRewardsContractMulticall(element);
                // callList.push(rewardTokenContract.balanceOf(account));
                callList.push(stakingTokenContract.balanceOf(account));
                callList.push(TokenAContract.earned(account));
                callList.push(TokenAContract.balanceOf(account));
            } catch (error) {
                console.log(error);
            }
            const infoList2 = await ethcallProvider.all(callList);
            // console.log('infoList2',infoList2);
            let jj = 0;
            for (let index = 0; index < infoList2.length; index += 3) {
                const element = result[jj];
                // console.log({ element });
                jj++;
                // const rewardbalance = infoList2[index];
                const stakingbalance = infoList2[index];
                const earn = infoList2[index + 1];
                const haveStack = infoList2[index + 2];

                // 链接钱包后获取剩下的数据
                element.data['LPTokenbalance'] = new BigNumber(stakingbalance.toString()).div('1e18').toNumber();
                element.data['earned'] = new BigNumber(earn.toString()).div('1e18').toNumber();
                element.data['balance'] = new BigNumber(haveStack.toString()).div('1e18').toNumber();

            }
        }
    }
    return result;
}

export async function getFarmList(library, account, chainID) {
    // console.log({library, account, chainID});
    const list = multiSymbolData || [];
    const result = [];
    list.forEach((item) => {
        if (item.chainId === chainID && item.kind === 'depositMLAMB') {
            result.push(item);
        }
    });

    for (let index = 0; index < result.length; index++) {
        const item = result[index];
        const TokenAContract = mlambBarContractCall(item);
        const ethcallProvider = new Provider(library, chainID);
        await ethcallProvider.init();
        // console.log({TokenAContract});
        const totalSupplycall = TokenAContract.totalSupply();
        const [totalSupply] = await ethcallProvider.all([totalSupplycall]);
        const token = _.find(tokenlist.tokens, (token) => {
            return item.symbol === token.symbol && item.chainId === token.chainId;
        });

        // 总质押xmlamb(份额)
        const totalSupplyShare = new BigNumber(totalSupply.toString()).div('1e18').decimalPlaces(6).toNumber();

        // 总质押mlamb
        const totalAsset = await useTokenBalance(library, item.address, token);

        const totalSupplyAPY = new BigNumber(totalSupplyShare.toString());
        const totalAssetAPY = new BigNumber(totalAsset.toExact());
        let mlambReward;
        try {
            const mlambData = await axios.get(`https://explorer.lambdastorage.com/api/proxy/pledgeInfo`);
            mlambReward = mlambData.data.data.PoolSupplierReward;
        } catch (error) {
            mlambReward = config.defaultReward;
        }

        const mlambRewardPerDay = new BigNumber(mlambReward).div(365).times(totalAssetAPY.toString());

        console.log(mlambRewardPerDay.toString());

        const big0 = new BigNumber('0');
        // console.log(`supplyshare: ${totalSupplyAPY.toString()}, totalAsset: ${totalAssetAPY.toString()}`);

        // console.log(totalSupplyAPY.toNumber(),totalAssetAPY.toNumber());
        let share;

        if (totalSupplyAPY.isEqualTo(big0) || totalAssetAPY.isEqualTo(big0)) {
            share = new BigNumber('1');
        } else {
            share = totalSupplyAPY.div(totalAssetAPY);
        }

        // console.log(share.toNumber());
        const rewards = totalAssetAPY.plus(1).plus(mlambRewardPerDay).toString();
        const allShares = totalSupplyAPY.plus(share).toString();
        // console.log(`share: ${share.toString()}`);
        // console.log( `rewards:${rewards.toString()} , allshare: ${allShares.toString()}`);

        let apy = share.times(rewards).div(allShares).minus(1).times(365).times(100).decimalPlaces(2);

        console.log('totalSupplyAPY', totalSupplyAPY.toString());
        console.log('totalAssetAPY', totalAssetAPY.toString());
        console.log('share', share.toString());
        console.log('apy', apy.toString());
        const targetNum = new BigNumber('0.000001');
        if (apy.isLessThan(targetNum)) {
            apy = `<0.0001`;
        }
        // console.log(apy.toNumber());
        console.log(totalSupplyShare);
        // 未连接钱包
        if (!account) {
            item.data = {
                totalSupplyShare: totalSupplyShare,
                balanceShare: '',
                totalAsset: totalAssetAPY.decimalPlaces(2),
                myAsset: '',
                rewardTokenAddress: token.address,
                apy: apy
                    // claimedReward:claimedReward.toSignificant(6)
            };
        } else {
            const balancecall = TokenAContract.balanceOf(account);
            const [balance] = await ethcallProvider.all([balancecall]);
            // 个人账户xmlamb
            const balanceShare = new BigNumber(balance.toString()).div('1e18').decimalPlaces(6).toNumber();
            // 总资产

            const myAsset = new BigNumber(balanceShare).times(totalAsset.toExact()).div(totalSupplyShare.toString()).decimalPlaces(6).toNumber();
            item.data = {
                totalSupplyShare: totalSupplyShare,
                balanceShare: balanceShare,
                totalAsset: totalAssetAPY.decimalPlaces(2),
                myAsset: myAsset,
                rewardTokenAddress: token.address,
                apy: apy
                    // claimedReward:claimedReward.toSignificant(6)
            };
        }
    }
    return result;
}

// 质押mLAMB
export async function useSushiBarEnter(library, account, token, amount) {
    const contract = usemLAMBContract(library, account, token.address, true);
    let result;
    try {
        const safeGasEstimate = await contract.estimateGas.enter(amount);
        result = await contract.enter(amount, {
            gasLimit: calculateGasMargin(safeGasEstimate),
        });
    } catch (error) {
        console.log(error);
    }
    return result;
}

// 取出mLAMB
export async function useSushiBarLeave(library, account, token, amount) {
    // console.log({library, account, token, amount});
    const contract = usemLAMBContract(library, account, token.address, true);
    let result;
    try {
        const safeGasEstimate = await contract.estimateGas.leave(amount);
        result = await contract.leave(amount, {
            gasLimit: calculateGasMargin(safeGasEstimate),
        });
    } catch (error) {
        console.log(error);
    }
    return result;
}