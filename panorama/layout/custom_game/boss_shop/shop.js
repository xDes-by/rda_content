$("#ban").visible = false

var PlayerCount = 0,
	rating,
	commented = [],
	LocalPlayer,
	turn = -1,
	shop = CustomNetTables.GetAllTableValues( "shop" ),
	shopCout,
	playerID = Players.GetLocalPlayer(),
	steamID = GetUniverseSteamID32(playerID),
	isopen = false,
	windowName,
	shopinfo,
	isRatingOpen = false,
	isShopOpen = false

var shopnumber = 0
var specialAltOpenBut = false;

function openShopButton(){
	isShopOpen = true
	$('#DonateShopPanel').AddClass('open_shop')
	if(isopen == true){
		if(windowName == "rating"){
			closeRaiting()
			openShop(shopnumber)
		}else if(windowName == "shop"){
			closeShop()
		}
		return
	}else{
		openShop(shopnumber)
	}
}
 
function closeShop(){
	
	isopen = false
	if(IsSelected){
		IsSelected = false;
		$('#donateShop').hittest = false
		$('#DonateShopPanel').style.position = x + 'px ' + y + 'px 0'
	}
	if(GameUI.IsAltDown() && specialAltOpenBut == false){
		specialAltOpenBut = true;
	}else if(GameUI.IsAltDown() && specialAltOpenBut == true){
		specialAltOpenBut = false;
	}
	if(specialAltOpenBut){
		$.Schedule(0.2, function(){
			$('#openShopLabel').visible = true;
		})
	}

	$('#DonateShopPanel').RemoveClass('open_shop')
	$('#DonateShopPanel').AddClass('close_shop')
	$.Schedule(0.2, function(){
		$('#DonateShopPanel').RemoveClass('close_shop')
		visibleOff("DonateShopPanel")
	})
	$('#donateShop').SetFocus(false)
	$('#BuyControl').visible = false
	$('#accept_shadow').visible = false
}
function specialOpnBut(){
	
	if(GameUI.IsAltDown() && specialAltOpenBut == true){
		specialAltOpenBut = false;
	}
	$('#openShopLabel').visible = false;
	openShopButton()
}

function openShop(n){
	isopen = true
	windowName = "shop"
	visibleOn("DonateShopPanel")
	for(var i = 1; i <= Object.keys( shopinfo ).length; i++){
		if(i == n){
			$('#TabPanel_' + i).AddClass('selected_bd')
			$('#TabPanel_' + i).RemoveClass('TabPanelOnServ')
			$('#TabLabel_' + i).AddClass('selected_text')
			$('#TabLabel_' + i).RemoveClass('TabLabelOnServ')
			visibleOn("DonateShopContentPanel_" + i)
		}else{
			if($('#TabPanel_' + i)){
				$('#TabPanel_' + i).AddClass('TabPanelOnServ')
				$('#TabPanel_' + i).RemoveClass('selected_bd')
			}
			if($('#TabLabel_' + i)){
				$('#TabLabel_' + i).AddClass('TabLabelOnServ')
				$('#TabLabel_' + i).RemoveClass('selected_text')
			}
			
			visibleOff("DonateShopContentPanel_" + i)
		}
	}
}




var opn = (function(n)
{
	return function()
	{
		Game.EmitSound("ui_team_select_pick_team")
		shopnumber = n
		openShop(shopnumber)
		
	}
});

var acceptBuy = (function(i, n, pan, consumabl, currency)
{
	return function()
	{
		$.Msg("accept buy 1")
		$('#BuyControl').visible = false;
		$('#accept_shadow').visible = false
		GameEvents.SendCustomGameEventToServer("buyItem", {i,n, amountBuy,currency})
		if(consumabl){
			var numb = Number(Number(shopinfo[i][n].now) + amountBuy)
			pan.FindChildTraverse('DonateShopItemButtonLabelStock').text = $.Localize('#stock') + ': ' + numb
			shopinfo[i][n].now = numb
		}else if(shopinfo[i][n].type == 'talant'){
			pan.FindChildTraverse('DonateShopItemButtonBuy').visible = false
			pan.FindChildTraverse('DonateShopItemButtonActive').visible = true
			pan.FindChildTraverse('DonateShopItemButtonLabelActive').text = $.Localize('#active')
		}else if(shopinfo[i][n].type != 'gem' && shopinfo[i][n].type != 'loot-box'){
			pan.FindChildTraverse('DonateShopItemButtonHas').visible = true
			pan.FindChildTraverse('DonateShopItemButtonBuy').visible = false
			pan.FindChildTraverse('DonateShopItemButtonLabel').text = $.Localize('#taik')
		}
		if(currency){
			shopinfo.mmrpoints = Number(Number(shopinfo.mmrpoints) - Number(shopinfo[i][n]['price']['rp']))
		}else{
			shopinfo.coins = Number(Number(shopinfo.coins) - Number(shopinfo[i][n]['price']['don']))
		}
		$('#DonateMoneyLabel').text = shopinfo.coins
		$('#MMMRPointsLabel').text = shopinfo.mmrpoints
		if(shopinfo[i][n].type == 'talant'){
			var shopPanel = $("#DonateShopContentPanel")
			for (const [categoryKey, categoryValue] of Object.entries(shopinfo)) {
				if(typeof(categoryValue) == 'object'){
					for (const [productKey, productValue] of Object.entries(categoryValue)) {
						if(typeof(productValue) == 'object' && productValue.type == "talant" && productValue.hero == shopinfo[i][n].hero){
							singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
							singl.FindChildTraverse('DonateShopItemButtonBuy').visible = false
							singl.FindChildTraverse('DonateShopItemButtonActive').visible = true
							singl.FindChildTraverse('DonateShopItemButtonLabelActive').text = $.Localize('#active')
						}
					}
				}
			}
		}
	}
});
function OnDropDownChanged(){
	$.Msg()
	for(let i = 1; i <= 10; i++){
		let id = 'entry' + i
		if($('#BuyControlDrop').GetChild(0).id == id){
			amountBuy = i
			$('#BuyControlTextLine3').text = priceBuy * i
		}
	}
}
var amountBuy = 0;
var priceBuy = 0;
var buy = (function(i, n, pan, consumabl, currency)
{
	return function()
	{
		$.Msg("buy 1")
		Game.EmitSound("ui_team_select_shuffle")
		if((shopinfo[i][n]['price']['don'] <= shopinfo.coins && !currency)
		|| (shopinfo[i][n]['price']['rp'] <= shopinfo.mmrpoints && currency)){
			$('#BuyControlTextLine2').text = $.Localize("#"+shopinfo[i][n]['panorama_name'])
			$('#BuyControlDropPanel').RemoveAndDeleteChildren()
			amountBuy = 1
			var dropdown = "<DropDown id='BuyControlDrop' oninputsubmit='OnDropDownChanged()'>"
			if(currency){
				$('#BuyControlCurDon').visible = false
				$('#BuyControlCurRp').visible = true
				$('#BuyControlTextLine3').text = shopinfo[i][n]['price']['rp']
				for(let z = 1; z <= 10; z++){
					if(z * shopinfo[i][n]['price']['rp'] <= shopinfo.mmrpoints){
						dropdown += "<Label text='" + z + "' id='entry"+z+"'/>"
					}
				}
				priceBuy = shopinfo[i][n]['price']['rp']
			}else{
				$('#BuyControlCurDon').visible = true
				$('#BuyControlCurRp').visible = false
				$('#BuyControlTextLine3').text = shopinfo[i][n]['price']['don']
				for(let z = 1; z <= 10; z++){
					if(z * shopinfo[i][n]['price']['don'] <= shopinfo.coins){
						dropdown += "<Label text='" + z + "' id='entry"+z+"'/>"
					}
				}
				priceBuy = shopinfo[i][n]['price']['don']
			}
			dropdown += "</DropDown>"
			if(shopinfo[i][n]['combinable']){
				$('#BuyControlDropPanel').BCreateChildren(dropdown)
			}
			$('#BuyControl').visible = true;
			$('#accept_shadow').visible = true;
			$('#acceptButton').SetPanelEvent("onmouseactivate",acceptBuy(i, n, pan, consumabl, currency))
		}
	}
});
var returnItem = (function(pan, i, n){
    return function(){
        GameEvents.SendCustomGameEventToServer("return_item", {i : i, n : n})
    }
})
function return_item_js(t){
    let pan = $("#ShopItem" + t.i + '_' + t.n)
    if(shopinfo[t.i][t.n].consumabl == true){
        shopinfo[t.i][t.n]['now'] += t.car
        pan.FindChildTraverse('DonateShopItemButtonLabelStock').text = $.Localize('#stock') + ': ' + shopinfo[t.i][t.n]['now']
    }else{
        pan.FindChildTraverse('DonateShopItemButtonGived').visible = false
	    pan.FindChildTraverse('DonateShopItemButtonHas').visible = true
    }
    
}
var give = (function(i, n, pan, consumabl)
{
	return function()
	{	
		Game.EmitSound("ui_team_select_shuffle")
		var type = shopinfo[i][n].type
	// != issued

		// consumabl
			if(consumabl){
				var numb = Number(Number(shopinfo[i][n].now) - Number(1))
				if(Number(shopinfo[i][n].now) > 0){
					pan.FindChildTraverse('DonateShopItemButtonLabelStock').text = $.Localize('#stock') + ': ' + numb
				}
				$.Msg(numb)
				$.Msg(shopinfo[i][n].now)
				if(numb <= 0){
					shopinfo[i][n].now = 0
				}else{
					shopinfo[i][n].now = numb
				}
				
			}else{
		//else
				var c = shopinfo[i][n].now
				pan.FindChildTraverse('DonateShopItemButtonGived').visible = true
				pan.FindChildTraverse('DonateShopItemButtonHas').visible = false
			//effect
				if(type == 'effect'){
					pan.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#takeoff')
					pan.FindChildTraverse('DonateShopItemButtonGived').SetPanelEvent("onmouseactivate",takeoff(pan, i, n))
				}else{
			//item
					pan.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
                    if(shopinfo[i][n].type == 'item'){
                        pan.FindChildTraverse('DonateShopItemButtonLabelGived').SetPanelEvent("onmouseactivate",returnItem(pan, i, n))
                    }
				}
			//pets
				if(type == 'pet'){
					var shopPanel = $("#DonateShopContentPanel")
					for (const [categoryKey, categoryValue] of Object.entries(shopinfo)) {
						if(typeof(categoryValue) == 'object'){
							for (const [productKey, productValue] of Object.entries(categoryValue)) {
								if(typeof(productValue) == 'object' && productValue.type == "pet"){
									singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
									singl.FindChildTraverse('DonateShopItemButtonHas').visible = false
									singl.FindChildTraverse('DonateShopItemButtonGived').visible = true
									singl.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
								}
							}
						}
					}
				}
			}
			GameEvents.SendCustomGameEventToServer("giveItem", {i : i, n : n})
		
	}
});

var takeoff = (function(pan, i, n)
{
	return function()
	{	
		Game.EmitSound("ui_team_select_shuffle")
		
		//$.Msg("take off")
		pan.FindChildTraverse('DonateShopItemButtonGived').visible = false
		pan.FindChildTraverse('DonateShopItemButtonHas').visible = true
		GameEvents.SendCustomGameEventToServer("takeOffEffect", {i : i, n : n})
	}
});


function initShop(tab){
	shopinfo = tab
	
	// деньги
	if($('#DonateMoneyLabel')){
		$('#DonateMoneyLabel').text = shopinfo.coins
		$('#MMMRPointsLabel').text = shopinfo.mmrpoints
	}

	for (const [key, value] of Object.entries(tab)) {
		if(typeof(value) == 'object'){
			if($("#DonateShopTabsPanel")){
				var TabPanel = $.CreatePanel("Panel", $("#DonateShopTabsPanel"), "TabPanel_" + key);
				TabPanel.AddClass("TabPanel");
				TabPanel.SetPanelEvent("onmouseactivate",opn(key));
				var TabPanelLabel = $.CreatePanel("Label", TabPanel, "TabLabel_" + key);
				TabPanelLabel.AddClass('TabLabel');
				TabPanelLabel.text = $.Localize("#"+value.name);
			}
			var TabContent
			if($("#DonateShopContentPanel")){
				TabContent = $.CreatePanel("Panel", $("#DonateShopContentPanel"), "DonateShopContentPanel_" + key);
				TabContent.AddClass('TabContent');
			}
			var n = 0
			var horizontal_panel = 0
			var hPanel
			for (const [tovarKey, tovarValue] of Object.entries(value)) {
				if(typeof(tovarValue) == 'object'){
					if( n % 5 == 0 ){
						horizontal_panel += 1
						if(TabContent){
							var hPanel = $.CreatePanel("Panel", TabContent, "")
							hPanel.AddClass('horizontal_panel')
						}
					}
					if(hPanel){
						// blocks building
						var currency = tovarValue['price']['rp'];
						var pan = $.CreatePanel("Panel", hPanel, "ShopItem" + key + '_' + tovarKey)
						if(tovarValue.type && tovarValue.consumabl == true){
							pan.BLoadLayout("file://{resources}/layout/custom_game/boss_shop/DonateShopItem2.xml", false, false)
							pan.FindChildTraverse('DonateShopItemButtonLabelStock').text = $.Localize('#stock') + ': ' + tovarValue.now
                            pan.FindChildTraverse('DonateShopItemButtonBuyCon').SetPanelEvent("onmouseactivate",give(key, tovarKey, pan, true))
                            pan.FindChildTraverse('shopButtonImgAndText1').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, true, false))
                            pan.FindChildTraverse('shopButtonImgAndText2').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, true, true))
                            pan.FindChildTraverse('DonateShopItemButtonLabelGived').SetPanelEvent("onmouseactivate",returnItem(pan, key, tovarKey))
						}else{
							pan.BLoadLayout("file://{resources}/layout/custom_game/boss_shop/DonateShopItem1.xml", false, false)
							
							pan.FindChildTraverse('DonateShopItemButtonBuy').visible = false
							pan.FindChildTraverse('DonateShopItemButtonHas').visible = false
							pan.FindChildTraverse('DonateShopItemButtonGived').visible = false
							pan.FindChildTraverse('DonateShopItemButtonActive').visible = false
							if(tovarValue.status == 'taik' && tovarValue.type != 'gem' ){
								pan.FindChildTraverse('DonateShopItemButtonHas').visible = true
								pan.FindChildTraverse('DonateShopItemButtonLabel').text = $.Localize('#taik')
							}else if(tovarValue.status == 'buy' || tovarValue.type == 'gem' ){
								pan.FindChildTraverse('DonateShopItemButtonBuy').visible = true
							}else if(tovarValue.status == 'issued'){
								pan.FindChildTraverse('DonateShopItemButtonGived').visible = true
								pan.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
							}else if(tovarValue.status == 'takeoff'){
								pan.FindChildTraverse('DonateShopItemButtonGived').visible = true
								pan.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#takeoff')
							}else if(tovarValue.status == 'active'){
								pan.FindChildTraverse('DonateShopItemButtonActive').visible = true
								pan.FindChildTraverse('DonateShopItemButtonLabelActive').text = $.Localize('#active')
							}

							pan.FindChildTraverse('DonateShopItemButtonHas').SetPanelEvent("onmouseactivate",give(key, tovarKey, pan, false))
							pan.FindChildTraverse('shopButtonImgAndText1').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, false, false))
							pan.FindChildTraverse('shopButtonImgAndText2').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, false, true))
						}
                        
						pan.AddClass('DonateShopItemPanel')
						// img
						if( tovarValue.image ){
							pan.FindChildTraverse('DonateShopImg').SetImage('file://{resources}/' + tovarValue.image);
						}else{
							pan.FindChildTraverse('DonateShopItem').itemname = tovarValue.itemname
						}
						// mmrpoints
						if(currency == "mmrpoints"){
							pan.FindChildTraverse('shopButtonImg').SetImage('file://{resources}/images/custom_game/DonateShop/protection.png')
							pan.FindChildTraverse('shopButtonImg').style.height ="20px";
							pan.FindChildTraverse('shopButtonImg').style.width = "23px";
						}
						// rarity
						pan.FindChildTraverse('DonateShopItem').style.borderColor = tovarValue.rarity
						pan.FindChildTraverse('DonateShopItemLabel').style.color = 'white'
						// name 
						pan.FindChildTraverse('DonateShopItemLabel').text = $.Localize("#"+tovarValue.panorama_name)
						if(tovarValue.text_color){
							pan.FindChildTraverse('DonateShopItemLabel').style.color = tovarValue.text_color;
						}
						// price
						if(tovarValue['price']['don'] && tovarValue['price']['rp']){
                            pan.FindChildTraverse('DonateShopItemButtonLabelNotAlign1').text = tovarValue['price']['don']
                            pan.FindChildTraverse('DonateShopItemButtonLabelNotAlign2').text = tovarValue['price']['rp']
                            pan.FindChildTraverse('shop_button_price_container_don').AddClass('shop_button_2_params')
                            pan.FindChildTraverse('shop_button_price_container_rp').AddClass('shop_button_2_params')
                            
                        }else if(tovarValue['price']['don']){
                            pan.FindChildTraverse('DonateShopItemButtonLabelNotAlign1').text = tovarValue['price']['don']
                            pan.FindChildTraverse('shop_button_price_container_don').AddClass('shop_button_1_params')
                            pan.FindChildTraverse('shop_button_price_container_rp').visible = false
                        }else if(tovarValue['price']['rp']){
                            pan.FindChildTraverse('DonateShopItemButtonLabelNotAlign2').text = tovarValue['price']['rp']
                            pan.FindChildTraverse('shop_button_price_container_rp').AddClass('shop_button_1_params')
                            pan.FindChildTraverse('shop_button_price_container_don').visible = false
                        }
						
					}
					n += 1
				}
			}
		}
	}


	for(var i = 1; i <= Object.keys( shopinfo ).length; i++){
		if(typeof(shopinfo[i] == 'object')){
			if($('#TabPanel_' + i)){
				$('#TabPanel_' + i).AddClass('TabPanelOnServ')
				$('#TabLabel_' + i).AddClass('TabLabelOnServ')
			}
			if($("#DonateShopContentPanel_" + i)){
				$("#DonateShopContentPanel_" + i).visible = false
			}
		}	
	}
	var i = 1;
	while(shopinfo[i]){
		if($('#TabPanel_' + i)){
			shopnumber = i
			break;
		}
		i++;
	}
}

function visibleOff(pan){
	if($('#' + pan)){
		$('#' + pan).visible = false
	}
}

function visibleOn(pan){
	if($('#' + pan)){
		$('#' + pan).visible = true
	}
}

function GetUniverseSteamID32(PID)
{
    var steamID64 = Game.GetPlayerInfo(PID).player_steamid,
    steamIDPart = Number(steamID64.substring(3)),
    steamID32 = String(steamIDPart - 61197960265728);

    return steamID32;
}

function TipsOver(message, pos)
{
	if(pos == "openRating"){
		isRatingOpen = true;
	}else if(pos == "openShop"){
		isShopOpen = true;
	}
	

    if ($("#"+pos) != undefined)
    {
       $.DispatchEvent( "DOTAShowTextTooltip", $("#"+pos), $.Localize("#"+message));
    }
}
function TipsOut()
{
    $.DispatchEvent( "DOTAHideTitleTextTooltip");
    $.DispatchEvent( "DOTAHideTextTooltip");
}

var IsSelected = false
var lastCursorPosition;

function UpdateButtonInWorld(name) {
	var pan = "#"+name+"buttonhud"
	if(shops[name])
		pan = "#shopbuttonhud"
	pan = $(pan)
	var vec = Entities.GetAbsOrigin(Number(sellers[name])),
		uix_offset = -50,
		uiy_offset = 20,
		scrx = Game.WorldToScreenX(vec[0], vec[1], vec[2]),
		scry = Game.WorldToScreenY(vec[0], vec[1], vec[2]),
		uix = scrx + uix_offset,
		uiy = scry + uiy_offset,
		uiw = context.actuallayoutwidth,
		uih = context.actuallayoutheight
	if(uiw!=0 && uih!=0 && scrx != -1 && scry != -1){
		var uixp = uix / uiw * 100,
			uiyp = uiy / uih * 100 
		pan.style.position = uixp + '% ' + uiyp + '% 0'
		pan.SetHasClass("shopbuttonvisible",true)
	}
	else{
		pan.SetHasClass("shopbuttonvisible",false)
	}
	if(butupdate[name] == true)
		$.Schedule(0,function(){UpdateButtonInWorld(name)})
	else
		pan.SetHasClass("shopbuttonvisible",false)
}

click = false

var trymove = (function()
{
	return function()
	{
		click = true;
		clickingloop();
	}
});

var x = 0;
var y = 0;
function clickingloop(){
	if(click == false && GameUI.IsMouseDown(0) == false){
		return
	}
	if(GameUI.IsMouseDown(0)){
		var cursor = GameUI.GetCursorPosition()
		width = $('#DonateShopPanel').actuallayoutwidth;
		height = $('#DonateShopPanel').actuallayoutheight;
		x += cursor[0] - lastCursorPosition[0];
		y += cursor[1] - lastCursorPosition[1];
		lastCursorPosition = cursor
		$('#DonateShopPanel').style.position = x + 'px ' + y + 'px 0'
		$('#openShopPanelLabel').style.position = x + 'px ' + y + 'px 0'
	}else{
		lastCursorPosition = GameUI.GetCursorPosition()
	}
	$.Schedule(1/20,function(){
		clickingloop()
	})
}


function updateRatingCouter(t){
    t.a = Number(t.a);
    if($('#rating_zar') != null && $('#rating_nadez') != null && $('#rating_doom') != null && $('#rating_your_mmr') != null && $('#rating_info_panel_img') != null){
        
            $('#rating_zar').text = t.a
            $('#rating_nadez').text = t.b
            $('#rating_doom').text = t.c

        $('#rating_your_mmr').text = rating[LocalPlayer+1].points
        $('#rating_info_panel_img').SetImage('file://{resources}/images/custom_game/ranks/' + rank(rating[LocalPlayer+1].points) + '.png')
    }
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function puls_bg_rating(){
	var a = getRandomInt(255);
	var b = getRandomInt(255);
	var c = getRandomInt(255);
	var backgroundColor = "rgb(" + a + ", " + b + ", " + c + ");";
	var a = getRandomInt(255);
	var b = getRandomInt(255);
	var c = getRandomInt(255);
	var boxShadow = "rgb(" + a + ", " + b + ", " + c + ") 0px 0px 8px 0px;"
	if($("#openRating")){
		//$("#openRating").style.backgroundColor = "rgb(255, 255, 255);"
		$("#openRating").style.backgroundColor = backgroundColor;
		$("#openRating").style.boxShadow = boxShadow;
	}
	$.Schedule(1/20,function(){
		if(isRatingOpen == false){
			puls_bg_rating()
		}else if($("#openRating")){
			$("#openRating").style.backgroundColor = null
			$("#openRating").style.boxShadow = null;
		}
	})
}
function puls_bg_shop(){
	var a = getRandomInt(255);
	var b = getRandomInt(255);
	var c = getRandomInt(255);
	var backgroundColor = "rgb(" + a + ", " + b + ", " + c + ");";
	var a = getRandomInt(255);
	var b = getRandomInt(255);
	var c = getRandomInt(255);
	var boxShadow = "rgb(" + a + ", " + b + ", " + c + ") 0px 0px 8px 0px;"
	if($("#openShop")){
		//$("#openRating").style.backgroundColor = "rgb(255, 255, 255);"
		$("#openShop").style.backgroundColor = backgroundColor;
		$("#openShop").style.boxShadow = boxShadow;
	}
	$.Schedule(1/20,function(){
		if(isShopOpen == false){
			puls_bg_shop()
		}else if($("#openShop")){
			$("#openShop").style.backgroundColor = null
			$("#openShop").style.boxShadow = null;
		}
	})
}

// function rakurzia(i){
// 	i++;

// 	if(i <= 5){
// 		if($('#element_'+i)){
// 			$('#element_'+i).visible = true
// 			$('#element_'+i).AddClass('box_animation_on'+i)
// 		}
// 	}else{
// 		for(var l = 1; l <= 5;l++){
// 			if($('#element_'+l)){
// 				$('#element_'+l).visible = false
// 				$('#element_'+l).RemoveClass('box_animation_on'+i)
// 			}
// 		}
// 		return
// 	}
// 	$.Schedule(1, function(){
// 		rakurzia(i)
// 	});
// }

// for(var l = 1; l <= 5;l++){
// 	if($('#element_'+l)){
// 		$('#element_'+l).visible = false;
// 	}
// }

// (function(){
// 	rakurzia(0)
// })();

function shopinfoed(table_name, key, data){
    if(key == Players.GetLocalPlayer() && shopinfo != null){
		if(shopinfo.coins)
			shopinfo.coins = data["coins"]
		if(shopinfo.mmrpoints)
			shopinfo.mmrpoints = data["mmrpoints"]
		if($('#DonateMoneyLabel'))
        	$('#DonateMoneyLabel').text = shopinfo.coins
		if($('#MMMRPointsLabel'))
			$('#MMMRPointsLabel').text = shopinfo.mmrpoints
		if($('#RatingTeamPlayer'+key))
			if($('#RatingTeamPlayer'+key).FindChildTraverse("RatingPlayerReports2"))
				$('#RatingTeamPlayer'+key).FindChildTraverse("RatingPlayerReports2").text = data['reports'];
		if($('#RatingTeamPlayer'+key))
			if($('#RatingTeamPlayer'+key).FindChildTraverse("RatingPlayerLikes2"))
				$('#RatingTeamPlayer'+key).FindChildTraverse("RatingPlayerLikes2").text = data['likes'];
    }
}


const update_gems_js = (t) => {
	if($('#smithy_purple_label'))
		$('#smithy_purple_label').text = t[1]
	if($('#smithy_blue_label'))
    	$('#smithy_blue_label').text = t[2]
	if($('#smithy_orange_label'))
    	$('#smithy_orange_label').text = t[3]
	if($('#smithy_red_label'))
    	$('#smithy_red_label').text = t[4]
	if($('#smithy_green_label'))
    	$('#smithy_green_label').text = t[5]
}

(function(){
	// rakurzia(0)
	if($("#shop_selection_panel")){
		$("#shop_selection_panel").SetPanelEvent("onmouseover",trymove())
		$("#shop_selection_panel").SetPanelEvent("onmouseout",function(){click = false})
	}
	GameEvents.Subscribe( "initShop", initShop)
	GameEvents.Subscribe( "return_item_js", return_item_js)
    
	// puls_bg_shop()
	visibleOff("DonateShopPanel")
	visibleOff("openShopLabel")
	visibleOff("BuyControl")
	visibleOff("RatingPanel")
	visibleOff("accept_shadow")
	if($.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("EditButton"))
		$.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("EditButton").visible = false;

	// $.Schedule(5,function(){
	// 	$("#cat").RemoveAndDeleteChildren();
	// })
})();