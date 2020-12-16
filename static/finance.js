const navslide=()=>{
  const burger=document.querySelector('.burger');
  const nav=document.querySelector('.nav-links');
  const navLinks=document.querySelectorAll('.nav-links li');

  burger.addEventListener('click',()=>{
    nav.classList.toggle('nav-active');

    navLinks.forEach((link,index)=>{
      if(link.style.animation){
        link.style.animation='';
      } else {
        link.style.animation=`navLinkFade 0.5s ease forwards ${index/7+0.7}s`
      }
    });
    burger.classList.toggle('togle');
  });
}
navslide();

const basehtml='https://financialmodelingprep.com/api/v3/quote/AAPL'
const apikey='16e20ae424370441fbf7356a4e2857f1'
const cryptoApiKey='1eab807a-a159-43eb-9108-ad769328354f'
// company search
async function searchCompany(query) {

    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/${query}?apikey=${apikey}`);
        newData=generateHTML(resp.data[0]);
        $("#data").append(newData);
    
};
function generateHTML(finance){
    return `
        <div class="col" >    
            
            <h5>Symbol: ${ finance.symbol }</h5>
            <h5>Price :$${ finance.price}</h5>
            <h5>Change: ${ finance.change}</h5>
            <h5>Day Low: ${ finance.dayLow}</h5>
            <h5>Day High: ${ finance.dayHigh}</h5>
            <h5>Volume: ${ finance.volume}</h5>
            <h5>Previous Close: ${ finance.previousClose}</h5>
            
        </div>
    `
}

// company profile
async function companyProfile(query){
    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/profile/${query}?apikey=${apikey}`)
    newData=generateProfileHTML(resp.data[0]);
    $("#data").append(newData);
}
function generateProfileHTML(finance){
    return `
        <div class="col" >    
        <img src="${finance.image}"  class='border rounded p-1 img-fluid'>
            <h5>Symbol: ${ finance.symbol }</h5>
            <h5>Company Name: ${ finance.companyName }</h5>
            <h5>Price :USD ${ finance.price }</h5>
            <h5>Address: ${ finance.address}</h5>
            <h5>CEO: ${ finance.ceo}</h5>
            <p>Company Description: ${ finance.description}</p>
            <h5>Industry: ${ finance.industry}</h5>
            <h5>Web Site:<a href='${ finance.website}'>${finance.website}</a></h5>
            
        </div>
    `
}
// search function
$("#search-form").on("submit", async function handleSearch (evt) {
    evt.preventDefault();
  
    let query = $("#search-query").val();
    $("#search-query").val('');
    if (!query) return;
  
    let data = await searchCompany(query);
    
    generateHTML(data[0]);
  });
// index graph
  async function indexChart(){
    const spResp=await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/%5EGSPC?apikey=${apikey}`)
    const dowResp=await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/%5EDJI?apikey=${apikey}`)
    const nasdaqResp=await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/%5EIXIC?apikey=${apikey}`)
    const spHistory=spResp.data.historical;
    const dowHistory=dowResp.data.historical;
    const nasdaqHistory=nasdaqResp.data.historical;
    const date=dowHistory.map(function(d){
      return d.date;
    });
    const dow=dowHistory.map(function(d){
      return d.close;
    });
    const sp=spHistory.map(function(d){
      return d.close;
    });
    const nasdaq=nasdaqHistory.map(function(d){
      return d.close;
    });
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name:  'Dow',
      x: date,
      y: dow,
      line: {color: '#17BECF'}
    }
    var trace2 = {
      type: "scatter",
      mode: "lines",
      name: "S&P",
      x: date,
      y: sp,
      line: {color: 'green'}
    }
    var trace3={
      type: "scatter",
      mode: "lines",
      name: "Nasdaq",
      x: date,
      y: nasdaq,
      line: {color: 'red'}
    }
    var data = [trace1,trace2,trace3];
    var layout = {
        title: `Market Summary Chart`,
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
          range: [Math.min(dow), Math.max(dow)],
          type: 'linear'
        }
      };
        
      Plotly.newPlot('myDiv', data, layout);  
  
  }


// company chart  
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
// currency part
  async function currencies(){
      const resp=await axios.get('https://open.exchangerate-api.com/v6/latest');
      let newCurrency=generateCurrenciesHTML(resp.data.rates);  
      $("#currencies").append(newCurrency); 
  }
  function generateCurrenciesHTML(currency){
      return `
        <div class="col">GBP: ${currency['GBP']}</div>
        <div class="col">EUR: ${currency['EUR']}</div>
        <div class="col">JPY: ${currency['JPY']}</div>
        <div class="col">AED: ${currency['AED']}</div>
        <div class="col">TRY: ${currency['TRY']}</div>
      `
  }

  async function popularsearch() {

    const AAPLResp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=${apikey}`);
    const AMZNResp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/AMZN?apikey=${apikey}`);  
    const JPMResp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/JPM?apikey=${apikey}`);  
    const TSLAResp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/TSLA?apikey=${apikey}`);  
    const STZResp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/STZ?apikey=${apikey}`);  
    const BAResp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/BA?apikey=${apikey}`);  
        newDataArray=[AAPLResp.data[0],AMZNResp.data[0],JPMResp.data[0],TSLAResp.data[0],
        STZResp.data[0],BAResp.data[0]]
    newData=generatePopularHTML(newDataArray);
    for (let i=0;i<newData.length;i++){
      $("#popular-search").append(newData[i]);
        }
    
};

function generatePopularHTML(a){
  let divArray=[];
  divArray.push(`<div class="col">Popular Search</div>`)
  for (let i=0;i<a.length;i++){
    if (a[i].change<0){
      let html=`<div class="col text-danger"><a href="/${a[i].symbol}" style="text-decoration:none;" class="text-danger">${a[i].symbol}</a> <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg>${a[i].change}%</div>`
      divArray.push(html);
    } else {
      let html=`<div class="col text-success"><a href="/${a[i].symbol}" style="text-decoration:none;" class="text-success">${a[i].symbol}</a> <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
    </svg>${a[i].change}%</div>`
      divArray.push(html)
    }
  }
  return divArray;
  
};

async function cryptoCurrencies(){
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quotes/crypto?apikey=${apikey}`);
  const cryptoArray=resp.data.filter((crypto)=>{
    if (crypto.symbol==='BTCUSD' || crypto.symbol==='ETHUSD' || crypto.symbol==='XLMUSD'){
      return true
    }})
  let crypto=generateCryptoHTML(cryptoArray);
  for (let i=0;i<crypto.length;i++){
    $("#crypto").append(crypto[i]);
  }
};

  function generateCryptoHTML(data){
    const divArray=[];
    for (let i=0;i<data.length;i++){
      if (data[i].change<0){
        let html=`<div class="col text-danger">${data[i].symbol} <i class="fas fa-caret-down"></i>${data[i].price}</div>`;
        divArray.push(html);
      } else {
        let html=`<div class="col text-success">${data[i].symbol} <i class="fas fa-caret-up"></i>${data[i].price}</div>`;
        divArray.push(html);
      };
    };  
    return divArray;
  };

  async function gainers(){
    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/gainers?apikey=${apikey}`);
    const gainersArray=resp.data.filter((company,index)=>{if (index<7){return true}})
    gainersHTML=generateGainHTML(gainersArray);
    for (let i=0;i<gainersHTML.length;i++){
      $("#gainers-data").append(gainersHTML[i]);
    }
  }

  async function losers(){
    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/losers?apikey=${apikey}`);
    const losersArray=resp.data.filter((company,index)=>{if (index<7){return true}})
    losersHTML=generateLossHTML(losersArray);
    for (let i=0;i<losersHTML.length;i++){
      $("#losers-data").append(losersHTML[i]);
    }
  }

  function generateGainHTML(data){
    divArray=[];
    for (let i =0;i<data.length;i++){
      let html=`
      <tr class="table-secondary">
        <td>${data[i].ticker}</td>
        <td>${data[i].companyName}</td>
        <td><i class="fas fa-caret-up text-success"></i>${data[i].price}</td>
      </tr>
      `;
      divArray.push(html);
    }
    return divArray;
  }

  function generateLossHTML(data){
    divArray=[];
    for (let i =0;i<data.length;i++){
      let html=`
      <tr class="table-secondary">
        <td>${data[i].ticker}</td>
        <td>${data[i].companyName}</td>
        <td><i class="fas fa-caret-down text-danger"></i>${data[i].price}</td>
      </tr>
      `;
      divArray.push(html);
    }
    return divArray;
  }

  async function index(){
    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quotes/index?apikey=${apikey}`);
    const indexArray= resp.data.filter(company=>(company.symbol==='^DJI' || company.symbol==='^GSPC' || company.symbol==='^IXIC'));
    generateIndexHTML(indexArray);
  }

  function generateIndexHTML(data){
    for (let i=0;i<data.length;i++){
      if (data[i].symbol==='^DJI'){
        if (data[i].change<0){
          $('#dow-data-2').html(`${data[i].change}`).addClass('text-danger');
          $('#dow-data-3').html(`<svg width="1.2em" height="1.3em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg> ${data[i].price.toFixed(2)} `);
          $('#dow-data-4').html(`${data[i].changesPercentage}%`).addClass('text-danger');          
        } else {
          $('#dow-data-2').html(`${data[i].change}`).addClass('text-success');
          $('#dow-data-3').html(`<svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
        </svg> ${data[i].price.toFixed(2)} `);
          $('#dow-data-4').html(`${data[i].changesPercentage}%`).addClass('text-success');          
        } 
      } else if (data[i].symbol==='^IXIC'){
        if (data[i].change<0){
          $('#nasdaq-data-2').html(`${data[i].change}`).addClass('text-danger');
          $('#nasdaq-data-3').html(`<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg> ${data[i].price.toFixed(2)} `);
          $('#nasdaq-data-4').html(`${data[i].changesPercentage}%`).addClass('text-danger');          
        } else {
          $('#nasdaq-data-2').html(`${data[i].change}`).addClass('text-success');
          $('#nasdaq-data-3').html(`<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
        </svg> ${data[i].price.toFixed(2)} `);
          $('#nasdaq-data-4').html(`${data[i].changesPercentage}%`).addClass('text-success');          
        } 
      } else {
        if (data[i].change<0){
          $('#sp-data-2').html(`${data[i].change}`).addClass('text-danger');
          $('#sp-data-3').html(`<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-down-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg> ${data[i].price.toFixed(2)} `);
          $('#sp-data-4').html(`${data[i].changesPercentage}%`).addClass('text-danger');          
        } else {
          $('#sp-data-2').html(`${data[i].change}`).addClass('text-success');
          $('#sp-data-3').html(`<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-caret-up-fill" fill="green" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
        </svg> ${data[i].price.toFixed(2)} `);
          $('#sp-data-4').html(`${data[i].changesPercentage}%`).addClass('text-success');          
        }
      }
    }  
  };
console.log('mete nar');

async function loadData(){
  Promise.all([losers(),gainers(),index(),cryptoCurrencies(),popularsearch(),currencies(),indexChart()])
}

// loadData()

loadArray=[losers(),gainers(),index(),cryptoCurrencies(),popularsearch(),currencies(),indexChart()]
// losers();
// gainers();
// index();
// cryptoCurrencies();
// popularsearch();
// companyChart('AAPL');
// currencies();
// indexChart();


async function loading(){
  for (i=0;i<loadArray.length;i++){
    setTimeout(loadArray[i],700);
  }

}

loading()