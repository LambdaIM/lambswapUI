import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import numeral from "numeral";
dayjs.extend(utc);
const BigNumber = require("bignumber.js");
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

const formatLAMBValue = (value) => {
  if (!value) {
    return 0;
  }
  const val = parseFloat(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div("1e6").toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};

const format1e18Value = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div("1e18").toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};

const format1e18ValueList = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div("1e18").decimalPlaces(6);
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal.decimalPlaces(6);
};

const formatNormalValue = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div(1).decimalPlaces(6).toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};


const formatNormal3Value = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div(1).decimalPlaces(3).toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};

const formatDate = (value) => {
  if (value == "" || value == undefined) {
    return "";
  }
  if (value == "0001-01-01T00:00:00Z") {
    return "--";
  }

  return dayjs
    .utc(value)
    .local()
    .format("YYYY-MM-DD HH:mm:ss");
};

const formatAmount = (value) => {
  if (value == "" || value == null) {
    return 0;
  }
  let letters;
  let val;

  if (value.indexOf(",") >= 0) {
    let letters1;
    let val1;
    const newValueList = [];
    const valueList = value.split(",");
    valueList.forEach((item) => {
      const originValue = item.match(/[0-9\.]+/g);
      const num = originValue[0].toString().length;

      // let originLetters = item.split(originValue)[1];
      const originLetters = item.slice(num);

      letters1 = originLetters.substr(1);
      const newval = new BigNumber(originValue[0]);
      val1 = newval.div("1e6").toNumber();

      letters1 = letters1.toUpperCase();
      const amount = `${val1} ${letters1}`;
      newValueList.push(amount);
    });
    return newValueList.join(",");
  } else {
    // console.log(value);
    const originValue = value.match(/[0-9\.]+/g);
    const num = originValue[0].toString().length;
    const originLetters = value.slice(num);
    letters = originLetters.slice(1);
    const newval = new BigNumber(originValue[0]);
    val = newval.div("1e6");
    letters = letters.toUpperCase();
    return `${val} ${letters}`;
  }
};

const formatToken = (value) => {
  if (!value) {
    return "";
  }
  let val;

  if (value.indexOf("u") >= 0) {
    val = value.slice(1);
  } else {
    val = value;
  }
  val = val.toUpperCase();
  return val;
};

const formatRate = (value) => {
  if (!value) {
    return "0%";
  }
  if (value >= 0.00001 || value == 0) {
    return numeral(value).format("0.[00]%");
  } else {
    return "<0.001%";
  }
};

const formatReward = (value, days, scashPrice, totalSupply,LPvalue) => {
  // console.log(value, days, scashPrice, totalSupply,LPvalue);
  if (!value) {
    return "0";
  }
  const rate = new BigNumber(value);
  const time = new BigNumber(3600 * 24 * days);
  let total = new BigNumber(totalSupply);

  if (total.isZero()) {
    total = new BigNumber('1');
  }
  const scash = new BigNumber(scashPrice);
  // console.log(value, days, scashPrice, totalSupply,LPvalue,total.toNumber());
  const reward = time.times(rate).div(LPvalue).times(scash).times('100').decimalPlaces(2).toNumber();
  return reward;
};

const formatBalance = (value) => {
  if (!value || isNaN(value)) {
    return "--";
  }
  const bigValue = new BigNumber(value);
  return bigValue.toFixed(2);
};

const formatBalanceNumber = (value) => {
  if (!value || isNaN(value)) {
    return "--";
  }
  const bigValue = new BigNumber(value);
  return bigValue.toFixed(6);
};

const two_digits = (value)=> {
  if (value < 0) {
    return '00';
  }
  if (value.toString().length <= 1) {
    return `0${value}`;
  }
  return value;
};

export default {
  formatBalance,
  formatLAMBValue,
  format1e18Value,
  formatDate,
  formatToken,
  formatAmount,
  formatNormalValue,
  formatRate,
  formatReward,
  formatBalanceNumber,
  format1e18ValueList,
  two_digits,
  formatNormal3Value
};
