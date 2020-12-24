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
const popularSearchArray=[
  {'stock':'AAPL'},
  {'stock':'AMZN'},
  {'stock':'JPM'},
  {'stock':'TSLA'},
  {'stock':'STZ'},
  {'stock':'BA'}
]

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
    const sortedArray=resp.data.sort((a,b)=>b.changes-a.changes);
    const gainersArray=sortedArray.filter((company,index)=>{if (index<7){return true}})
    gainersHTML=generateGainHTML(gainersArray);
    for (let i=0;i<gainersHTML.length;i++){
      $("#gainers-data").append(gainersHTML[i]);
    }
  }

  async function losers(){
    const resp=await axios.get(`https://financialmodelingprep.com/api/v3/losers?apikey=${apikey}`);
    const sortedArray=resp.data.sort((a,b)=>a.changes-b.changes);
    const losersArray=sortedArray.filter((company,index)=>{if (index<7){return true}})
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
  async function stockPriceData(stock){
  const resp=await axios.get(`https://financialmodelingprep.com/api/v3/quote/${stock}?apikey=${apikey}`);  
  const data=resp.data[0]
  return data;
  }

  async function popularSearch(){
  let stockArray=[];
  const resp=await axios.get('/users/favorites');
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

// console.log('mete nar');
  async function loadData(){
    Promise.all([index(),cryptoCurrencies(),popularSearch(),currencies(),indexChart(),losers(),gainers()])
  }

loadData();
// popularSearch()


// losers();
// gainers();
// index();
// cryptoCurrencies();
// currencies();
// indexChart();
