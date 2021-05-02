const {Telegraf,Markup} = require('telegraf');
//const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
var fs = require('fs');
//var axios = require('axios');
var fetch = require('node-fetch');
// var express = require('express');
// const request = require('request');

const bot = new Telegraf('1704161411:AAGhQLhEX1gX2YapeGtGSTzURaAWj_X6NA8');
const botName = 'David346';

const helpButtons = Markup.inlineKeyboard([
    [Markup.button.callback('New', 'new'),
        Markup.button.callback('Price', 'price'),
        Markup.button.callback('Charts', 'charts')],
    [Markup.button.callback('Trading', 'trading'),
        Markup.button.callback('Info', 'info'),
        Markup.button.callback('Stocks', 'stocks')],
    [Markup.button.callback('Fun', 'fun'),
        Markup.button.callback('Pro', 'pro'),
        Markup.button.callback('Util', 'util')]
]);





var respr1;


var getIds = async function (coin){

  const data = JSON.parse(fs.readFileSync('list.json'),'utf8');
  for(let d of data){
      if(d.symbol==coin){
          return d.id;
      }
  }
  return null;

};

var getPrice = async function (coin){
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids='+coin+'&vs_currencies=btc%2Cusd%2Ceur'
    var respr1 = await fetch(url)
    var response = await respr1.json();
    return response;        
}


bot.start((ctx) => ctx.reply('Welcome')) // display Welcome text when we start bot
bot.hears('hi', (ctx) => ctx.reply('Hey there')) // listen and handle when user type hi text

bot.hears('/menu', (ctx) => {
    ctx.reply('show menu')
})


bot.command ( async(ctx) => {

const str1 = '/p';
console.log('msg is '+ctx.message.text);
const trimmedMsg = ctx.message.text.trim();
const supported_commands = {help:'/help'};
if(ctx.message.text==supported_commands.help){

    const helpMessage =
        "<a href=\"/bot_command?command=p&bot="+botName+"\">/p</a> - get price of coin"+
        "\n<a href=\"/bot_command?command=c&bot="+botName+"\">/c</a> - get a coin chart"+
        "\n<a href=\"/bot_command?command=ch&bot="+botName+"\">/ch</a> - calculate the number of coins"+
        "\n<a href=\"/bot_command?command=tv&bot="+botName+"\">/tv</a> - get a TradingView Chart"+
        "\n<a href=\"/bot_command?command=cap&bot="+botName+"\">/cap</a> - get marketcap info"+
        "\n<a href=\"/bot_command?command=index&bot="+botName+"\">/index</a> - get an index"
    ;
    return await ctx.replyWithHTML(helpMessage,helpButtons);

}




if( ctx.message.text.indexOf(str1) >= 0){

  var splitt = ctx.message.text.split(" ");

  var str_r = await getIds(splitt[1]);
  var str_r1 = await getPrice(str_r);
  const jsonData = JSON.stringify(str_r1);
  var dataFinal = "<code><b><i>$3.160</i></b>|0.00005091₿/nΞ: 0.00127757\nH|L: 2.54 | 3.88\n1h:    8.86%    🍻\n24h:  -6.42%    😰\n7d:  \n-6.95%    😰\nVol: $2.5M\nJoin 👉 <a href='http://google.com'>@Unfolded</a> ❤️</code>";

  return await ctx.replyWithHTML(jsonData,
     Markup.inlineKeyboard([
      Markup.button.callback('like', 'like'),
      Markup.button.callback('Refresh ➡', 'R1|'+str_r)
    ])
    .oneTime()
    .resize());

} else {
  console.log("option not exist");
}



})



bot.on("callback_query", async function(ctx){
  var callbackCommand = ctx.update.callback_query.data;
  console.log('callback_query '+callbackCommand);
  if(callbackCommand=='new'){

      //TODO find a way to edit text as html
      const newHelpMessage =
          "<a href=\"/bot_command?command=defi&bot="+botName+"\">/defi</a> - get a defi index"+
          "\n<a href=\"/bot_command?command=tw&bot="+botName+"\">/tw</a> coin - get twitter feed for coin"+
          "\n<a href=\"/bot_command?command=txfee&bot="+botName+"\">/txfee</a> - get btc tx fees"+
          "\n<a href=\"/bot_command?command=up&bot="+botName+"\">/up</a> - get uniswap pricing"+
          "\n<a href=\"/bot_command?command=trending&bot="+botName+"\">/trending</a> -  get Coins Trending On Coingecko"
      ;
      return ctx.editMessageText(newHelpMessage,helpButtons);
  }
  else {
      console.log('no handle found');
  }


 // var splitt2 = ctx1.data.split("|");
  if (ctx1.indexOf('R1|') >= 0){

    var spl_c = ctx1.split("|");
    sf = spl_c[1].replace(/["]+/g, '');
    var str_r = await getPrice(sf);
    const jsonData = JSON.stringify(str_r);
    try{

      return ctx.editMessageText(jsonData+(new Date()),
        Markup.inlineKeyboard([
         Markup.button.callback('like', 'like'),
         Markup.button.callback('Refresh ➡️', 'R1|'+sf)
       ])
       .oneTime()
       .resize());

      }

      catch (e) {
        console.log('*** Exception in main function');
        console.log(e);
        console.log('*** End of exception in main');
    }
    


  } else if (ctx1.indexOf('like') >= 0){
    return ctx.reply('Eres un puton que solo compra Rukas');
  }

});




//https://api.coingecko.com/api/v3/simple/price?ids=01coin&vs_currencies=btc%2Cusd%2Ceur
/*
fs.readFile('list.json', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});
*/



bot.launch()