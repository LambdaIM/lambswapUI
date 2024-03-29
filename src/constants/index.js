import { ChainId, JSBI, Percent, Token, WETH } from '@webfans/uniswapsdk';


export const historyAPIDomine= process.env.VUE_APP_historylambswap;


export const ROUTER_ADDRESS = '0x24E3F89d6eb4Bc8f988B8aB5273C7F380975e2BB';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const UNI_ADDRESS = '';

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

export const BASE_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000));
export const ONE_HUNDRED_PERCENT = new Percent(
  JSBI.BigInt(10000),
  JSBI.BigInt(10000)
);


export const ALLOWED_PRICE_IMPACT_LOW = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

export const AirDropper_address ='0x0559DfceeeEdB151454a51a56Cf2270F1E122371';



