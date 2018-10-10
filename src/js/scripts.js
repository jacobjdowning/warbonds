import React from "react";
import ReactDOM from "react-dom";

import Layout from "./components/Layout"

// Current Quests
var quests = [];

const copperInGold = 10000;

function filterAuctions(auctions){
	return new Promise((resolve) => {
		resolve (
			auctions.filter(element => {
				for (let quest of quests){
					if(quest.itemID == element.item){
						return true;
					}
				}
				return false;
			})
		)
	});
}

function calcPrices(auctions){
	return new Promise((resolve) => {
		var prices ={};
		for (let auction of auctions){
			var ppu = auction.buyout / auction.quantity / copperInGold;
			if(ppu > 0){
				if(prices[auction.item] == null){
					prices[auction.item] = ppu
				} else if (ppu < prices[auction.item]){
					prices[auction.item] = ppu
				}
			}
		}
		resolve(prices);
	})
}

function createBars (prices, CurQuests) {
	return new Promise((resolve) =>{
		var barlist = [];
		CurQuests.forEach((quest) =>{
			var bar = {};
			bar.id = quest.itemID
			bar.icon = quest.icon;
			bar.count = quest.count;
			bar.share = 50;
			bar.cost = +(quest.count * prices[quest.itemID]).toFixed(2);
			barlist.push(bar)
		})
		resolve(barlist);
	})
}

function orderBars (bars){
	return new Promise((resolve) =>{
		resolve( 
			bars.sort((a, b) =>{
				if(a.cost > b.cost){
					return 1;
				}else if(a.cost < b.cost){
					return -1;
				}else{
					return 0;
				}
			})
		)
	})
}

function assignShare (bars) {
	return new Promise((resolve) =>{
		var fullLength = 90;
		var fullValue = bars[bars.length - 1].cost;
		for (var i = bars.length - 1; i >= 0 ; i--){
			bars[i].share = (bars[i].cost/fullValue) * 90;
		}
		resolve(bars);
	})
}

function getAuctions(){
	const battleNetUrl = "https://evening-chamber-17533.herokuapp.com/";
	const corsAnywhereUrl = "https://fierce-plains-20744.herokuapp.com/"
	const questsUrl = "https://jacobjdowning.github.io/warbonds/quests.json"
	var check;

	var questFetch = fetch(questsUrl).
	then(data => data.json()).
	then(parsed => quests = parsed);


	var auctionFetch = fetch(corsAnywhereUrl + battleNetUrl).
	then(data => data.json()).
	then(response => response.files.pop().url). //Could be multiple, Promise.all is probably the right fix
	then(newUrl => fetch(corsAnywhereUrl + newUrl, {
			headers: new Headers({"origin" : "warbonds.github.io"})	
	})).
	then(response => response.json());


	Promise.all([questFetch, auctionFetch]).
	then(ahDump => filterAuctions(ahDump[1].auctions)).
	then(auctions => calcPrices(auctions)).
	then(prices => createBars(prices, quests)).
	then(bars => orderBars(bars)).
	then(ordered => assignShare(ordered)).
	then(finishedBars => {
		const app = document.getElementById('app');
		ReactDOM.render(<Layout bars={finishedBars} />, app);
	});	
}


getAuctions();