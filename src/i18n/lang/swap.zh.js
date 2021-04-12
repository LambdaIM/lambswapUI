export default {
    swap:{
        subMenu1:"交易",
        subMenu2:"流动性池",
        subMenu3:"历史记录",
        Exchanges:'交易',
        pageTitle: "交易",
        Pair:'交易对',
        Price:'最新价格',
        Change:'涨幅',
        ChangeTip:'24小时价格涨幅',
        fromToken: "支付",
        toToken: "兑换为",
        balance: "余额",
        swapBtn: "下一步",
        price: "价格",
        PriceImpact: "价格滑点",
        LiquidityProviderFee: "流动性池手续费",
        Minimumreceived: "最小接收数量",
        PriceImpactError: "价格波动较大，无法交易",
        approve: "授权",
        ethgasfree: "手续费",
        enterthequantity: "请输入数量",
        actions: {
          Amountexceedsbalance: "输入数量不能大于当前余额",
          needNumber:"请输入数量",
          Transactionfailure: "交易失败",
          approvesuccessful: "授权成功",
          approvecancel:'取消授权',
          Transactionsent: "交易已发送",
          Successfultrade:'交易成功'
        },
    },
    swapConfirm:{
      Confirm:'确认',
      fromToken: "支付",
      toToken: "兑换为",
      Asset:'资产',
      Destination:'目标地址',
      NetworkFee:'手续费',
      Youwillreceive:'你将收到',
      ConfirmBtn:'确认',
      Transactioncancelled:'交易已取消',
      success:'成功',
      fail:'失败',
      successCom:'成功',
      failCom:'失败',
      txhavesend:'交易已发送',
      add:'添加',
    },
    swapHistory: {
      history: '历史记录',
      table: {
        Pair: '交易对',
        Action: '动作',
        Amount: '数量',
        Recived:'已收到',
        Status: '状态'
      },
      removeDialog:{
        title:'移除',
        amount:'数量',
        balance:'余额',
        button:'授权',
        max:'全部',
      },
      confirmDialog:{
        titleConfirm:'确认',
        willReceive:'你将收到',
        loading:'等待确认',
        share:'矿池占比',
        fee:'手续费',
        Price:'价格',
        to:'至',
        content1:'当前显示收到的数量为预估数量，你将至少收到',
        content2:'LP 如果市场价格波动过大，交易将被重置。',
      },
      inputDialog:{
        title:'注入',
        balance:'余额',
        button:'下一步',
        buy:'购买scUSD',
      }
    },
    liquidity: {
      title: '获取scUSD稳定币',
      subTitle: '为交易对提供流动性赚取交易手续费，移除流动性来赎回流动性及所赚取的收益。',
      btnBuild: 'LambSwap铸造',
      btnGetscusd: '获取scUSD额度',
      btnExchange: 'LambSwap交易',
      btnBuyscusd: '购买scUSD',
      pool: {
        title: '注入流动性获取 LP',
        totalInputed: '当前注入LP总量',
        inputed: '注入的',
        sharePool: '我提供的流动性占比',
        btnInput: '注入',
        btnRemove: '移除'
      },
      airdrop: {
        next: '下次空投时间',
        subTitle: '对 LP Token 质押期间进行不定期快照，根据平均占比获取空投额度',
        title1: '空投量',
        tag: 'LAMB 空投',
        count: '倒计时',
        extract: '提取',
        t1: '社区奖励正在空投中...',
        t2: '您的空投奖励将在4.6-4.11分六天平均发放',
        t3: '当前空投进度：6/6'
      }
    },
};