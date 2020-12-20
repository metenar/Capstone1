const $incomeSheet=$('.income-statement-container');
const $balanceSheet=$('.balance-sheet-container');
const $cashFlow=$('.cash-flow-container');
const $summary=$('.summary-container');
const $financial=$('.financial-container');
const $analysis=$('.analysis-container');
const $stockData=$('#stock-data');
const popularSearchArray=[
  {'stock':'AAPL'},
  {'stock':'AMZN'},
  {'stock':'JPM'},
  {'stock':'TSLA'},
  {'stock':'STZ'},
  {'stock':'BA'}
]

// company chart  

const apikey='16e20ae424370441fbf7356a4e2857f1'
async function companyChart(query){
    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${query}?apikey=${apikey}`)
    let historical=resp.data.historical;
    const date=historical.map(function(d){
        return d.date;
    });
    const closed=historical.map(function(d){
        return d.close;
    });
    const low=historical.map(function(d){
        return d.low;
    });
    const high=historical.map(function(d){
        return d.high;
    });
    
    var trace1 = {
        type: "scatter",
        mode: "lines",
        name:  `${resp.data.symbol} High`,
        x: date,
        y: high,
        line: {color: '#17BECF'}
      }
      var trace2 = {
        type: "scatter",
        mode: "lines",
        name: `${resp.data.symbol} Low`,
        x: date,
        y: low,
        line: {color: '#7F7F7F'}
      }
      var trace3={
        type: "scatter",
        mode: "lines",
        name: `${resp.data.symbol} closed`,
        x: date,
        y: closed,
        line: {color: 'red'}
      }
    var data = [trace1,trace2,trace3];
    var layout = {
        title: `${resp.data.symbol} chart`,
        xaxis: {
          autorange: true,
          range: [Math.min(date), Math.max(date)],
          rangeselector: {buttons: [
              {
                count: 1,
                label: '1m',
                step: 'month',
                stepmode: 'backward'
              },
              {
                count: 6,
                label: '6m',
                step: 'month',
                stepmode: 'backward'
              },
              {step: 'all'}
            ]},
          rangeslider: {range: [Math.min(date), Math.max(date)]},
          type: 'date'
        },
        yaxis: {
          autorange: true,
          range: [Math.min(closed), Math.max(closed)],
          type: 'linear'
        }
      };
        
      Plotly.newPlot('myDiv', data, layout);  
  }

async function summary(stock){
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/${stock}?apikey=${apikey}`);
  const newData=generateSummaryHTML(resp.data[0]);
    $('#summary-data').empty();
    $("#summary-data").append(newData);
}

function generateSummaryHTML(data){
  let nf = Intl.NumberFormat();
  if (data.pe===null){
    data.pe=0;
  }
  let html=`
      <tr>
        <th scope='row'>Open</th>
        <td>${data.open}</td>
      </tr>
      <tr>
        <th scope='row'>Previous Close</th>
        <td>${data.previousClose}</td>
      </tr>
      <tr>
        <th scope='row'>Volume(Avg)</th>
        <td>${(Number(data.avgVolume)/1000000).toFixed(2)}M</td>
      </tr>
      <tr>
        <th scope='row'>Market Cap.</th>
        <td>${(Number(data.marketCap)/1000000000000).toFixed(2)}T</td>
      </tr>
      <tr>
        <th scope='row'>Shares Outstanding</th>
        <td>${(Number(data.sharesOutstanding)/1000000000).toFixed(2)}B</td>
      </tr>
      <tr>
        <th scope='row'>P/E Ratio (EPS)</th>
        <td>${(data.pe).toFixed(2)}</td>
      </tr>
      `;
  return html
}

async function financialIncomeStatement(stock){
  const dataArray=[];
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/income-statement/${stock}?limit=120&apikey=${apikey}`);
  for (let i=0;i<4;i++){
    const data=resp.data[i];
    dataArray.push(data);
  }
  newData=generatefinancialIncomeHTML(dataArray);
  $('#financial-data').empty();
  $("#financial-data").append(newData);

}

function generatefinancialIncomeHTML(data){
  let html=`
    <tr>
      <th scope='row'>Period End Date</th>
      <td>${new Date(data[3].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[2].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[1].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[0].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      
    </tr>
    <tr>
      <th scope='row'>Stmt Source</th>
      <td>Annual</td>
      <td>Annual</td>
      <td>Annual</td>
      <td>Annual</td>
    </tr>
    <tr>
      <th scope='row'>Total Revenue</th>
      <td>${(Number(data[3].revenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].revenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].revenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].revenue)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Cost of Revenue</th>
      <td>${(Number(data[3].costOfRevenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].costOfRevenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].costOfRevenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].costOfRevenue)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Gross Profit</th>
      <td>${(Number(data[3].grossProfit)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].grossProfit)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].grossProfit)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].grossProfit)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Selling, General and Administrative</th>
      <td>${(Number((data[3].generalAndAdministrativeExpenses)+(data[3].sellingAndMarketingExpenses))/1000000000).toFixed(1)}</td>
      <td>${(Number((data[2].generalAndAdministrativeExpenses)+(data[2].sellingAndMarketingExpenses))/1000000000).toFixed(1)}</td>
      <td>${(Number((data[1].generalAndAdministrativeExpenses)+(data[1].sellingAndMarketingExpenses))/1000000000).toFixed(1)}</td>
      <td>${(Number((data[0].generalAndAdministrativeExpenses)+(data[0].sellingAndMarketingExpenses))/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Research and Development</th>
      <td>${(Number(data[3].researchAndDevelopmentExpenses)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].researchAndDevelopmentExpenses)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].researchAndDevelopmentExpenses)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].researchAndDevelopmentExpenses)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Operating Expenses</th>
      <td>${(Number(data[3].operatingExpenses)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].operatingExpenses)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].operatingExpenses)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].operatingExpenses)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Operating Income</th>
      <td>${(Number(data[3].operatingIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].operatingIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].operatingIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].operatingIncome)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Pre-Tax Income</th>
      <td>${(Number(data[3].incomeBeforeTax)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].incomeBeforeTax)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].incomeBeforeTax)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].incomeBeforeTax)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Net Income</th>
      <td>${(Number(data[3].netIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].netIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].netIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].netIncome)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Diluted EPS</th>
      <td>${(Number(data[3].epsdiluted)).toFixed(2)}</td>
      <td>${(Number(data[2].epsdiluted)).toFixed(2)}</td>
      <td>${(Number(data[1].epsdiluted)).toFixed(2)}</td>
      <td>${(Number(data[0].epsdiluted)).toFixed(2)}</td>
    </tr>
  `
  return html
}

async function financialBalanceSheet(stock){
  const dataArray=[];
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${stock}?limit=120&apikey=${apikey}`);
  for (let i=0;i<4;i++){
    let data=resp.data[i];
    dataArray.push(data);
  }
  const newData=generateBalanceSheetHTML(dataArray);
  $("#balance-sheet-data").empty();
  $("#balance-sheet-data").append(newData);
}

function generateBalanceSheetHTML(data){
  let html=`
    <tr>
      <th scope='row'>Period End Date</th>
      <td>${new Date(data[3].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[2].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[1].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[0].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>      
    </tr>
    <tr>
      <th scope='row'>Cash and Cash Equivalents</th>
      <td>${(Number(data[3].cashAndCashEquivalents)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].cashAndCashEquivalents)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].cashAndCashEquivalents)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].cashAndCashEquivalents)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Short Term Investments</th>
      <td>${(Number(data[3].shortTermInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].shortTermInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].shortTermInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].shortTermInvestments)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Account Receivable</th>
      <td>${(Number(data[3].netReceivables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].netReceivables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].netReceivables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].netReceivables)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Inventories</th>
      <td>${(Number((data[3].inventory)/1000000000)).toFixed(1)}</td>
      <td>${(Number((data[2].inventory)/1000000000)).toFixed(1)}</td>
      <td>${(Number((data[1].inventory)/1000000000)).toFixed(1)}</td>
      <td>${(Number((data[0].inventory)/1000000000)).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Current Assets</th>
      <td>${(Number(data[3].totalCurrentAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalCurrentAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalCurrentAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalCurrentAssets)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Goodwill andf Other Intangible Assets</th>
      <td>${(Number(data[3].goodwillAndIntangibleAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].goodwillAndIntangibleAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].goodwillAndIntangibleAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].goodwillAndIntangibleAssets)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Investments and Advences</th>
      <td>${(Number(data[3].longTermInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].longTermInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].longTermInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].longTermInvestments)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Non-Current Assets</th>
      <td>${(Number(data[3].totalNonCurrentAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalNonCurrentAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalNonCurrentAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalNonCurrentAssets)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Assets</th>
      <td>${(Number(data[3].totalAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalAssets)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalAssets)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Payables</th>
      <td>${(Number(data[3].accountPayables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].accountPayables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].accountPayables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].accountPayables)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Deferred Revenue</th>
      <td>${(Number(data[3].deferredRevenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].deferredRevenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].deferredRevenue)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].deferredRevenue)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Current Liabilities</th>
      <td>${(Number(data[3].totalCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalCurrentLiabilities)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Long Term Debt</th>
      <td>${(Number(data[3].longTermDebt)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].longTermDebt)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].longTermDebt)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].longTermDebt)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Deferred Revenue,Non-Current</th>
      <td>${(Number(data[3].deferredRevenueNonCurrent)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].deferredRevenueNonCurrent)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].deferredRevenueNonCurrent)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].deferredRevenueNonCurrent)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Other Non-Current Liabilities</th>
      <td>${(Number(data[3].otherNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].otherNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].otherNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].otherNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Non-Current Liabilities</th>
      <td>${(Number(data[3].totalNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalNonCurrentLiabilities)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Liabilities</th>
      <td>${(Number(data[3].totalLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalLiabilities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalLiabilities)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Common Stock</th>
      <td>${(Number(data[3].commonStock)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].commonStock)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].commonStock)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].commonStock)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Retained Earnings</th>
      <td>${(Number(data[3].retainedEarnings)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].retainedEarnings)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].retainedEarnings)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].retainedEarnings)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Equity</th>
      <td>${(Number(data[3].totalStockholdersEquity)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalStockholdersEquity)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalStockholdersEquity)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalStockholdersEquity)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Total Liabilities and Equity</th>
      <td>${(Number(data[3].totalLiabilitiesAndStockholdersEquity)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].totalLiabilitiesAndStockholdersEquity)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].totalLiabilitiesAndStockholdersEquity)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].totalLiabilitiesAndStockholdersEquity)/1000000000).toFixed(1)}</td>
    </tr>
  `
  return html
}

async function financialCashFlow(stock){
  const dataArray=[];
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${stock}?limit=120&apikey=${apikey}`);
  for (let i=0;i<4;i++){
    const data=resp.data[i];
    dataArray.push(data);
  }
  const newData=generateCashFlowHTML(dataArray);
  $("#cash-flow-data").empty();
  $("#cash-flow-data").append(newData);
}

function generateCashFlowHTML(data){
  let html=`
    <tr>
      <th scope='row'>Period End Date</th>
      <td>${new Date(data[3].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[2].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[1].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
      <td>${new Date(data[0].date).toLocaleDateString('en-EN',{ year: 'numeric', month: 'numeric', day: 'numeric' })}</td>      
    </tr>
    <tr>
      <th scope='row'>Net Income</th>
      <td>${(Number(data[3].netIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].netIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].netIncome)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].netIncome)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Depreciation,Amortization Depletion</th>
      <td>${(Number(data[3].depreciationAndAmortization)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].depreciationAndAmortization)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].depreciationAndAmortization)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].depreciationAndAmortization)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Deferred Taxes</th>
      <td>${(Number(data[3].deferredIncomeTax)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].deferredIncomeTax)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].deferredIncomeTax)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].deferredIncomeTax)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Change in Inventories</th>
      <td>${(Number((data[3].inventory)/1000000000)).toFixed(1)}</td>
      <td>${(Number((data[2].inventory)/1000000000)).toFixed(1)}</td>
      <td>${(Number((data[1].inventory)/1000000000)).toFixed(1)}</td>
      <td>${(Number((data[0].inventory)/1000000000)).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Change in Payables</th>
      <td>${(Number(data[3].accountsPayables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].accountsPayables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].accountsPayables)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].accountsPayables)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Cash Flow from Operating Activities</th>
      <td>${(Number(data[3].netCashProvidedByOperatingActivities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].netCashProvidedByOperatingActivities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].netCashProvidedByOperatingActivities)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].netCashProvidedByOperatingActivities)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Purchase/Sale of Prop,Plant,Equip: Net</th>
      <td>${(Number(data[3].investmentsInPropertyPlantAndEquipment)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].investmentsInPropertyPlantAndEquipment)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].investmentsInPropertyPlantAndEquipment)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].investmentsInPropertyPlantAndEquipment)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Purchase/Sale of Business,Net</th>
      <td>${(Number(data[3].acquisitionsNet)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].acquisitionsNet)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].acquisitionsNet)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].acquisitionsNet)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Purchase of Investments</th>
      <td>${(Number(data[3].purchasesOfInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].purchasesOfInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].purchasesOfInvestments)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].purchasesOfInvestments)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Cash Dividends Paid</th>
      <td>${(Number(data[3].dividendsPaid)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].dividendsPaid)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].dividendsPaid)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].dividendsPaid)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Cash, Equivalents, Start of Period</th>
      <td>${(Number(data[3].cashAtBeginningOfPeriod)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].cashAtBeginningOfPeriod)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].cashAtBeginningOfPeriod)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].cashAtBeginningOfPeriod)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Cash, Equivalents, End of Period</th>
      <td>${(Number(data[3].cashAtEndOfPeriod)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[2].cashAtEndOfPeriod)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[1].cashAtEndOfPeriod)/1000000000).toFixed(1)}</td>
      <td>${(Number(data[0].cashAtEndOfPeriod)/1000000000).toFixed(1)}</td>
    </tr>
    <tr>
      <th scope='row'>Change in Cash</th>
      <td>${(Number((data[3].cashAtEndOfPeriod)-(data[3].cashAtBeginningOfPeriod))/1000000000).toFixed(1)}</td>
      <td>${(Number((data[2].cashAtEndOfPeriod)-(data[2].cashAtBeginningOfPeriod))/1000000000).toFixed(1)}</td>
      <td>${(Number((data[1].cashAtEndOfPeriod)-(data[1].cashAtBeginningOfPeriod))/1000000000).toFixed(1)}</td>
      <td>${(Number((data[0].cashAtEndOfPeriod)-(data[0].cashAtBeginningOfPeriod))/1000000000).toFixed(1)}</td>
    </tr>
  `
  return html
}

async function analysis(stock){
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/rating/${stock}?apikey=${apikey}`);
  const newData=generateAnalysisHTML(resp.data[0]);
    $('#analysis-data').empty();
    $("#analysis-data").append(newData);
}
function generateAnalysisHTML(data){
  if(data.ratingScore<3){
    let html=`
  <h4 class='display-5 text-danger'>Rating Score: ${data.ratingScore}</h4>
  <h2 class='display-1 text-danger'>${(data.ratingRecommendation).toUpperCase()}</h2>
  `
  return html
  } else if(data.ratingScore===3){
    let html=`
  <h4 class='display-5 text-danger'>Rating Score: ${data.ratingScore}</h4>
  <h2 class='display-1 text-danger'>${(data.atingRecommendation).toUpperCase()}</h2>
  `
  return html
  } else {
    let html=`
  <h4 class='display-5 text-success'>Rating Score: ${data.ratingScore}</h4>
  <h2 class='display-1 text-success'>${(data.ratingRecommendation).toUpperCase()}</h2>
  `
  return html
  }
  
}

async function stockData(stock){
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/${stock}?apikey=${apikey}`);
  const data=resp.data[0];
  $('#stock-name').text(data.name); 
  $('#stock-data-2').text(`${data.changesPercentage}%`);
  $('#stock-data-3').text(data.change);
  if (data.change<0){
    $('#stock-data').html(`${data.price} <svg width="1.2em" height="1.3em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>`);
    $('#stock-data-2').addClass('text-danger');
    $('#stock-data-3').addClass('text-danger');
  } else if (data.change>0){
    $('#stock-data').html(`${data.price} <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="green" 
  xmlns="http://www.w3.org/2000/svg">
  <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
  </svg>`);
    $('#stock-data-2').addClass('text-success');
    $('#stock-data-3').addClass('text-success');
  } else{
    $('#stock-data').html(`${data.price}`);
    $('#stock-data-2').addClass('text-secondary');
    $('#stock-data-3').addClass('text-secondary');
  }
}

function generatePopularHTML(a){
  let divArray=[];
  divArray.push(`<div class="col" id='popular-fav-search'>Popular Search</div>`)
  for (let i=0;i<a.length;i++){
    if (a[i].change<0){
      let html=`<div class="col text-danger"><a href="/${a[i].symbol}" style="text-decoration:none;" class="text-danger">${a[i].symbol}</a> <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>${a[i].changesPercentage}%</div>`
      divArray.push(html);
    } else {
      let html=`<div class="col text-success"><a href="/${a[i].symbol}" style="text-decoration:none;" class="text-success">${a[i].symbol}</a> <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
    </svg>${a[i].changesPercentage}%</div>`
      divArray.push(html)
    }
  }
  return divArray;
  
  };
async function stockPriceData(stock){
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/${stock}?apikey=${apikey}`);  
  const data=resp.data[0]
  return data;
}
  
async function popularSearch(){
    let stockArray=[];
    const resp=await axios.get('http://127.0.0.1:5000/users/favorites');
    const data=resp.data;
    if (data.length===0){
      for (let j=0;j<popularSearchArray.length;j++){
        let d=await stockPriceData(popularSearchArray[j].stock);
        stockArray.push(d);
      }
      const newData=generatePopularHTML(stockArray);
      for (let i=0;i<newData.length;i++){
      $("#popular-search").append(newData[i]);
      }
    }else {
      if (data.length>5){
        for (let j=0;j<5;j++){
          let d=await stockPriceData(data[j].stock);
          stockArray.push(d);
        } 
      } else {
        for (let j=0;j<data.length;j++){
          let d=await stockPriceData(data[j].stock);
          stockArray.push(d);
        };
      }
      const newData=generatePopularHTML(stockArray);
      for (let i=0;i<newData.length;i++){
        $("#popular-search").append(newData[i]);
      }
      $('#popular-fav-search').text('Favorite Search');
    }
}
  

// Event listeners
$("#summary").on('click', function () {
  $("#summary").addClass('visited');
  $("#analysis").removeClass('visited');
  $("#financial").removeClass('visited');
  hideElements();
  summary(data);
  $('.summary-container').slideToggle();

});
$('#analysis').on('click', function(){
  $("#analysis").addClass('visited');
  $("#summary").removeClass('visited');
  $("#financial").removeClass('visited');
  hideElements();
  $analysis.slideToggle();
  analysis(data);

})

$("#financial").on('click', function () {
  $("#financial").addClass('visited');
  $("#analysis").removeClass('visited');
  $("#summary").removeClass('visited');
  hideElements();
  $financial.slideToggle();
  $incomeSheet.slideToggle();
  financialIncomeStatement(data);
  
  $("#balance-sheet").on('click', () => {
    $("#balance-sheet").addClass('visited');
    $("#income-statement").removeClass('visited');
    $("#cash-flow").removeClass('visited');
      $incomeSheet.hide();
      $cashFlow.hide();
      $balanceSheet.slideToggle();
      financialBalanceSheet(data);
      $("#cash-flow").removeClass('visited');
  }); 
  $("#income-statement").on('click', () => {
    $("#income-statement").addClass('visited');
    $("#balance-sheet").removeClass('visited');
    $("#cash-flow").removeClass('visited');
    $cashFlow.hide();
    $balanceSheet.hide();
    $incomeSheet.slideToggle();
    financialIncomeStatement(data);
  });
  $("#cash-flow").on('click', () => {
    $("#cash-flow").addClass('visited');
    $("#balance-sheet").removeClass('visited');
    $("#income-statement").removeClass('visited');
    $incomeSheet.hide();
    $balanceSheet.hide();
    $cashFlow.slideToggle();
    financialCashFlow(data);
  });
})
function hideElements(){
  const elementsArr=[
    $incomeSheet,
    $balanceSheet,
    $cashFlow,
    $summary,
    $financial,
    $analysis
  ];
  elementsArr.forEach($elem => $elem.hide());
}


// popularSearch()


const data=companyname;
// companyChart(data)
// summary(data)
stockData(data)
// financialIncomeStatement(data)
// financialBalanceSheet(data)
// financialCashFlow(data)

