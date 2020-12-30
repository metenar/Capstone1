# Capstone1
Daily updated Stock Market Web Application

## Website Goal
The aim of this website is following stock market prices, currencies as well as crypto currencies.

## API Data
Data will be sourced from the Free version of Financial Modeling Prep API and Exchange Rate API.
Financial Modeling API has limit of requests which is 250 request by daily. 

### Database Schema
![database schema](https://github.com/metenar/Capstone1/master/static/images/Stock_Schema.png)

## Usage of App
First of all you should register or login.


### Register
![Register](https://github.com/metenar/Capstone1/tree/master/static/images/Register.png)
	
### Login
![Login](https://github.com/metenar/Capstone1/tree/master/static/images/Login.png)

### Index Page
When user loged in or registered the app redirect user to this page.

![Index Page](https://github.com/metenar/Capstone1/tree/master/static/images/Index_Page.png)

In this page you can examine the market data, Most Gainers and Most loosers also you can check some Currency exchange rates and Crypto Currencies as well.

If user has favorite stocks in database Index Page shows this stocks on Favorite Search Part. If User has no favorite stock in database then index page shows popular stocks data at same area.

![Popular Search](https://github.com/metenar/Capstone1/tree/master/static/images/Popular_Search_Explain.png)

If User made a stock search using Stock Tick or clicking the stock ticks 

![Index Page With Search](https://github.com/metenar/Capstone1/tree/master/static/images/Index_Page_With_Search.png)

App redirect the user Stock Details Page.

### Stock Details Page
![Stock Detail Page](https://github.com/metenar/Capstone1/tree/master/static/images/Stock_Detail_Page.png)

If User clicked on Thumbs Up icon then app add/remove this stock to/from database as favorites

![Stock Detail Explain](https://github.com/metenar/Capstone1/tree/master/static/images/Stock_Details_explain.png)

User can examine stocks financial status by clicking Summary/Financial and Analysis Buttons.
![Financial Explain](https://github.com/metenar/Capstone1/tree/master/static/images/Financial_explain.png)

Like Summary/Financial and Analysis In financial section there are 3 options. 

#### Income Statement
![Income Statement](https://github.com/metenar/Capstone1/tree/master/static/images/Financial_explain.png)

#### Balance Sheet
![Balance Sheet](https://github.com/metenar/Capstone1/tree/master/static/images/Balance_Sheet_explain.png)

#### Cash Flow
![Cash Flow](https://github.com/metenar/Capstone1/tree/master/static/images/Cash_Flow_explain.png)

User can also check Recommendation of the APP's by clicking Analysis.

![Analysis](https://github.com/metenar/Capstone1/tree/master/static/images/Analysis.png)

When User loged in or Registered The navbar changed and add an option to user check his account info. If user clicked his username on navbar the App shows the Users details page.

### Users Details Page

![User Details](https://github.com/metenar/Capstone1/tree/master/static/images/User_Detail_Page.png)

In this page user can edit accounts information or delete the account. Also App shows the favorite stocks related this user. User can delete this favorite stock by clicking the icon.


#### Technology Used:
* Python
* JavaScript
* HTML
* CSS
* Flask
* Bootstrap
