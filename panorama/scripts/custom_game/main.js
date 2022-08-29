
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
	isShopOpen = false,
	marci = null,
	pango = null,
	totaldonate = null

function hudInit(){
    /*
    var hud = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("ButtonBar");
    var panel = $.CreatePanel('Panel', hud, '');
    panel.style.backgroundImage = "url('file://{resources}/images/custom_game/rating/Rating1.png')";
    panel.style.width = "35px";
    panel.style.height = "30px";
    panel.style.backgroundRepeat = "no-repeat";
    panel.style.height = "30px";
    panel.AddClass("DOTAHudMenuButtons");
    panel.AddClass("Button");
    */
    //2314
}

function closeRaiting(){
	isopen = false
	$('#RatingPanel').style.opacity = "0"
	$("#RatingPanel").style.transform = "translate3d(-100px, 0px, 0px)";
	$("#RatingPanel").style.preTransformScale2d = "0.8";

}
var openRaitingButton =  function(){
	return function(){
		if(isopen == true){
			if(windowName == "shop"){
				closeShop()
				openRaiting('team')
			}else if(windowName == "rating"){
				closeRaiting()
			}
			return
		}
		openRaiting('team')
	}
}
function openRaiting(x){
	isRatingOpen = true
	isopen = true
	windowName = "rating"
	$('#RatingPanel').style.opacity = "1"
	$("#RatingPanel").style.transform = "translate3d(0px, 0px, 0px)";
	$("#RatingPanel").style.preTransformScale2d = "1";
	visibleOn("RatingPanel")
	visibleOff("RatingTeamPanel")
	visibleOff("RatingTopPanel")
	visibleOff("RatingProfilPanel")
	visibleOff("RatingProfilPlayerByIdPanel")
	visibleOff("RatingSeasonPanel")
	$('#RatingVkladkaText1').style.color = 'white';
	$('#RatingVkladkaText2').style.color = 'white';
	$('#RatingVkladkaText3').style.color = 'white';
	$('#RatingVkladkaText4').style.color = 'white';
	$('#RatingVkladkaPlayerRank_img').SetImage('file://{resources}/images/custom_game/rating/unactive_rating_button.png');
	$('#RatingVkladkaTop_img').SetImage('file://{resources}/images/custom_game/rating/unactive_rating_button.png');
	$('#RatingVkladkaProfil_img').SetImage('file://{resources}/images/custom_game/rating/unactive_rating_button.png');
	$('#RatingVkladkaSeason_img').SetImage('file://{resources}/images/custom_game/rating/unactive_rating_button.png');
	
	if(x == 'team'){
		visibleOn("RatingTeamPanel")
		$('#RatingVkladkaText1').style.color = 'yellow';
		$('#RatingVkladkaPlayerRank_img').SetImage('file://{resources}/images/custom_game/rating/active_rating_button.png');
	}else if(x == 'top'){
		visibleOn("RatingTopPanel")
		$('#RatingVkladkaText2').style.color = 'yellow';
		$('#RatingVkladkaTop_img').SetImage('file://{resources}/images/custom_game/rating/active_rating_button.png');
	}else if(x == 'profil'){
		visibleOn("RatingProfilPanel")
		$('#RatingVkladkaText3').style.color = 'yellow';
		$('#RatingVkladkaProfil_img').SetImage('file://{resources}/images/custom_game/rating/active_rating_button.png');
	}else if(x == 'season'){
		visibleOn("RatingSeasonPanel")
		$('#RatingVkladkaText4').style.color = 'yellow';
		$('#RatingVkladkaSeason_img').SetImage('file://{resources}/images/custom_game/rating/active_rating_button.png');
	}
}
function Noti(t){
	$.Msg("Noti")
	// turn += 1
	// $.Schedule(turn*8, function(){
	// 	$('#LikeNotificationsFrom').text = Players.GetPlayerName(t.from)
	// 	visibleOn("LikeNotificationsPanel")
	// 	$('#LikeNotificationsPanel').AddClass('show_notif')
	// 	$.Schedule(5, function(){
	// 		$('#LikeNotificationsPanel').RemoveClass('show_notif')
	// 		$('#LikeNotificationsPanel').AddClass('hide_notif')
	// 		$.Schedule(1.5, function(){
	// 			visibleOff("LikeNotificationsPanel")
	// 			$('#LikeNotificationsPanel').RemoveClass('hide_notif')
	// 		})
	// 		turn -= 1
	// 	})
	// })
}
var playerProfil = (function(t,i,plysteamid,rankUrl,playerconf)
{
	return function()
	{
		
		if(i == LocalPlayer){
			openRaiting('profil')
			return
		}
		
		visibleOff("RatingTeamPanel")
		visibleOff("RatingTopPanel")
		visibleOff("RatingProfilPanel")
		visibleOn("RatingProfilPlayerByIdPanel")
		
		var profil = $("#RatingProfilPlayerByIdPanel")
		profil.FindChildTraverse('profavatar').steamid = plysteamid
		profil.FindChildTraverse('RatingProfilName').steamid = plysteamid
		profil.FindChildTraverse('logotext1').text = t.rating[i+1].points
		profil.FindChildTraverse('logotext2').text = t.rating[i+1].games
		profil.FindChildTraverse('logotext3').text = t.rating[i+1].likes
		profil.FindChildTraverse('logotext4').text = t.rating[i+1].reports
		profil.FindChildTraverse('RatingProfilRank').SetImage(rankUrl)
		profil.FindChildTraverse("RatingProfilLike").visible = false
		profil.FindChildTraverse("RatingProfilDislike").visible = false
		profil.FindChildTraverse("RatingProfilLike").SetPanelEvent("onmouseactivate",function(){сommenBut(i,'likes')})
		profil.FindChildTraverse("RatingProfilDislike").SetPanelEvent("onmouseactivate",function(){сommenBut(i,'reports')})
		profil.FindChildTraverse("profil_first_game_label").text = typeof(t.rating[i+1].first_game) == 'string' ? t.rating[i+1].first_game : "-"
		profil.FindChildTraverse("last_games_profil").RemoveAndDeleteChildren()
		for(let n in t.history[i+1]){
			let pan = $.CreatePanelWithProperties("Panel", profil.FindChildTraverse("last_games_profil"), "", {class:"profil_game"})
			let p1 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			$.CreatePanelWithProperties("DOTAHeroImage", p1, "", {class:"last_game_hero_img", heroimagestyle:"landscape", heroname:t.history[i+1][n].hero_name})
			let p2 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			$.CreatePanelWithProperties("Label", p2, "", {text:$.Localize("#"+t.history[i+1][n].result), style: `color:${t.history[i+1][n].result == 'win' ? "#19962b" : "rgb(204, 68, 68)"};`})
			let p3 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			$.CreatePanelWithProperties("Label", p3, "", {text:$.Localize("#"+t.history[i+1][n].status), style: `color:${t.history[i+1][n].status == 'in' ? "#19962b" : "rgb(204, 68, 68)"};`})
			let p4 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			$.CreatePanelWithProperties("Label", p4, "", {text:Math.ceil(t.history[i+1][n].in_game_time/60) + " " + $.Localize("#min")})
			let p5 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			$.CreatePanelWithProperties("Label", p5, "", {text:t.history[i+1][n].level, style:"color:yellow;"})
			let mode_color = "white"
			if(t.history[i+1][n].mode == "hard"){
				mode_color = "rgb(204, 68, 68)"
			}else if(t.history[i+1][n].mode == "ultra"){
				mode_color = "rgb(159, 68, 212)"
			}else if(t.history[i+1][n].mode == 4){
				mode_color = "rgb(46, 108, 201)"
			}
			let p6 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			$.CreatePanelWithProperties("Label", p6, "", {text:$.Localize("#"+t.history[i+1][n].mode), style:"color:"+mode_color+";"})
			// pan.BLoadLayoutSnippet("profil_game_history")
			// $.Msg(profil.FindChildTraverse("last_games_profil"))
			// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i+1][n].hero_name
			// let children_count = profil.FindChildTraverse("last_games_profil").GetChildCount()
			// let pan = profil.FindChildTraverse("last_games_profil").GetChild(children_count-1)
			// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i+1][n].hero_name
		}
		if(playerconf){
			if(playerconf["color"] != '' && playerconf["color"] != null){
				profil.FindChildTraverse("RatingProfilName").style.color = playerconf["color"];
			}else{
				profil.FindChildTraverse("RatingProfilName").style.color = 'white';
			}
			if(playerconf["url"] != '' && playerconf["url"] != null){
				profil.FindChildTraverse("profilimage").visible = true;
				profil.FindChildTraverse("profilimage").style.backgroundImage = "url(" + playerconf["url"] + ")";
			}else{
				profil.FindChildTraverse("profilimage").visible = false;
			}
		}else{
            profil.FindChildTraverse("RatingProfilName").style.color = "";
            profil.FindChildTraverse("profilimage").style.backgroundImage = ""
        }
	}
});

var сommenBut = (function(i, type)
{
	return function(){
		Game.EmitSound("ui_team_select_shuffle")
		var loc = Players.GetLocalPlayer();
		// $.Msg(rating[loc+1]);
		if(rating[loc+1].commens > 0 && commented[i] != true){
			$("#RatingTeamPlayer"+i).FindChildTraverse("comens").visible = false;
			// $.Msg("1");
			rating[loc+1].commens -= 1;
			commented[i] = true;
			GameEvents.SendCustomGameEventToServer("CommentChange", {type:type,pid:i});
			$("#RatingCommentCout").text = rating[loc+1].commens;
		}
	}
});




function initRating(t){
	PlayerCount = Object.keys( t.rating ).length;
	rating = t.rating;
	LocalPlayer = Players.GetLocalPlayer()
	for(var i = 0; i < PlayerCount; i++){
		var playerconf = null;
		for (const [key, value] of Object.entries(t.bg)) {
			if(GetUniverseSteamID32(i) == value['sid']){
				playerconf = value;
				break;
			}
		}
		// init all team
		var plysteamid = Game.GetPlayerInfo(i).player_steamid
		var rankUrl = 'file://{resources}/images/custom_game/ranks/' + rank(t.rating[i+1].points) + '.png';
		
		
		if($("#RatingTeamPanel")){
			var pan = $.CreatePanel("Panel", $("#RatingTeamPanel"), "RatingTeamPlayer" + i)
			pan.BLoadLayout("file://{resources}/layout/custom_game/RatingTeam.xml", false, false)
			pan.FindChildTraverse("RatingPlayerAvatar").heroname = Players.GetPlayerSelectedHero(i)
			pan.FindChildTraverse("RatingPlayerName").steamid = plysteamid
			pan.FindChildTraverse("RatingPlayerAvatar").SetPanelEvent("onmouseactivate",playerProfil(t,i,plysteamid,rankUrl,playerconf))
			pan.FindChildTraverse("RatingPlayerLikes2").text = t.rating[i+1].likes
			pan.FindChildTraverse("RatingPlayerReports2").text = t.rating[i+1].reports
			pan.FindChildTraverse("RatingPlayergames").text = t.rating[i+1].games
			pan.FindChildTraverse("RatingPlayerrait").text = t.rating[i+1].points
			pan.FindChildTraverse("RatingPlayerRank").SetImage(rankUrl)
			
			if(t.rating[i+1].last_heros){
				var last_heros = JSON.parse( t.rating[i+1].last_heros );
				for(var z = 0; z < 3; z++){
					if(last_heros[z]){
						pan.FindChildTraverse("heroicon_"+z).heroname = last_heros[z]["name"];
						var time = ~~(last_heros[z]["in_game_time"] / 60);
						time = time + " min"
						pan.FindChildTraverse("heroicon_"+z).SetPanelEvent("onmouseover",TipsOver2( time, pan.FindChildTraverse("heroicon_"+z) ))
						pan.FindChildTraverse("heroicon_"+z).SetPanelEvent("onmouseout",TipsOut2())
					}else{
						pan.FindChildTraverse("heroicon_"+z).visible = false;
					}
					
				}
			}else{
				pan.FindChildTraverse("besthero").visible = false;
			}
			if(i!=playerID){ // !=
				pan.FindChildTraverse("likeimg").SetPanelEvent("onmouseactivate",сommenBut(i,'likes'))
				pan.FindChildTraverse("dislikeimg").SetPanelEvent("onmouseactivate",сommenBut(i,'reports'))
			}else{
				pan.FindChildTraverse("likeimg").visible = false;
				pan.FindChildTraverse("dislikeimg").visible = false;
			}
			

			if(playerconf){
				if(playerconf["color"] != '-'){
					pan.FindChildTraverse("RatingPlayerName").style.color = playerconf["color"]
				}
			}
		}
		
		// init profil
		
		if(i == LocalPlayer){
			if($("#RatingProfilPanel")){
				var profil = $.CreatePanel("Panel", $("#RatingProfilPanel"),"RatingProfilPlayer")
				profil.BLoadLayout("file://{resources}/layout/custom_game/RatingProfil.xml", false, false)
				profil.FindChildTraverse('profavatar').steamid = plysteamid
				profil.FindChildTraverse('RatingProfilName').steamid = plysteamid
				profil.FindChildTraverse('logotext1').text = t.rating[i+1].points
				profil.FindChildTraverse('logotext2').text = t.rating[i+1].games
				profil.FindChildTraverse('logotext3').text = t.rating[i+1].likes
				profil.FindChildTraverse('logotext4').text = t.rating[i+1].reports
				profil.FindChildTraverse("profil_first_game_label").text = t.rating[i+1].first_game
				for(let n in t.history[i+1]){
					let pan = $.CreatePanelWithProperties("Panel", profil.FindChildTraverse("last_games_profil"), "", {class:"profil_game"})
					let p1 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
					$.CreatePanelWithProperties("DOTAHeroImage", p1, "", {class:"last_game_hero_img", heroimagestyle:"landscape", heroname:t.history[i+1][n].hero_name})
					let p2 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
					$.CreatePanelWithProperties("Label", p2, "", {text:$.Localize("#"+t.history[i+1][n].result), style: `color:${t.history[i+1][n].result == 'win' ? "#19962b" : "rgb(204, 68, 68)"};`})
					let p3 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
					$.CreatePanelWithProperties("Label", p3, "", {text:$.Localize("#"+t.history[i+1][n].status), style: `color:${t.history[i+1][n].status == 'in' ? "#19962b" : "rgb(204, 68, 68)"};`})
					let p4 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
					$.CreatePanelWithProperties("Label", p4, "", {text:Math.ceil(t.history[i+1][n].in_game_time/60) + " " + $.Localize("#min")})
					let p5 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
					$.CreatePanelWithProperties("Label", p5, "", {text:t.history[i+1][n].level, style:"color:yellow;"})
					let mode_color = "white"
					if(t.history[i+1][n].mode == "hard"){
						mode_color = "rgb(204, 68, 68)"
					}else if(t.history[i+1][n].mode == "ultra"){
						mode_color = "rgb(159, 68, 212)"
					}else if(t.history[i+1][n].mode == 4){
						mode_color = "rgb(46, 108, 201)"
					}
					let p6 = $.CreatePanelWithProperties("Panel", pan, "", {class:"profil_game_colun_des_panel"})
					$.CreatePanelWithProperties("Label", p6, "", {text:$.Localize("#"+t.history[i+1][n].mode), style:"color:"+mode_color+";"})
					// pan.BLoadLayoutSnippet("profil_game_history")
					// $.Msg(profil.FindChildTraverse("last_games_profil"))
					// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i+1][n].hero_name
					// let children_count = profil.FindChildTraverse("last_games_profil").GetChildCount()
					// let pan = profil.FindChildTraverse("last_games_profil").GetChild(children_count-1)
					// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i+1][n].hero_name
				}
				profil.FindChildTraverse('RatingProfilRank').SetImage(rankUrl)
				profil.FindChildTraverse('RatingProfilLikeDislikePanel').visible = false
				if(playerconf){
					if(playerconf["color"] != '-'){
						profil.FindChildTraverse("RatingProfilName").style.color = playerconf["color"]
					}
					if(playerconf["url"] != '-'){
						profil.FindChildTraverse("profilimage").style.backgroundImage = "url(" + playerconf["url"] + ")"
					}
				}
			}
		}
	}
	if($("#RatingCommentCout")){
		$("#RatingCommentCout").text = rating[LocalPlayer+1].commens
	}
	if($("#RatingProfilPlayerByIdPanel")){
		$("#RatingProfilPlayerByIdPanel").BLoadLayout("file://{resources}/layout/custom_game/RatingProfil.xml", false, false)
	}
	
	for(var i = 1; i <= Object.keys( t.top ).length; i++){
		var top = t.top[i]
		if($("#RatingTopPanel")){
			var pan = $.CreatePanel("Panel", $("#RatingTopPanel"), "RatingTopPlayer" + i)
			pan.BLoadLayout("file://{resources}/layout/custom_game/RatingTop.xml", false, false)
			
			pan.FindChildTraverse("RatingPlayerNameTop").steamid = top["sid"]
			pan.FindChildTraverse("RatingPlayerAvatarTop").accountid = top["sid"]
			pan.FindChildTraverse("RatingPlayerrait").text = top["points"]
			pan.FindChildTraverse("RatingPlayergames").text = top["games"]
			pan.FindChildTraverse("RatingPlayerReports2").text = top["reports"]
			pan.FindChildTraverse("RatingPlayerLikes2").text = top["likes"]
			pan.FindChildTraverse("RatingPlayerTopNumberRank").text = i
			pan.FindChildTraverse('RatingPlayerRankTop').SetImage('file://{resources}/images/custom_game/ranks/' + rank(top["points"]) + '.png')
			var color = "gold"
			pan.FindChildTraverse("RatingPlayerTopNumberRankPanel").style.border = "5px solid " + color
			var playerconf = null;
			for (const [key, value] of Object.entries(t.bg)) {
				if(top["sid"] == value['sid']){
					playerconf = value;
					break;
				}
			}
			if(playerconf){
				if(playerconf["color"] != '-'){
					pan.FindChildTraverse("RatingPlayerNameTop").style.color = playerconf["color"]
				}
			}
			if(top["last_heros"]){
				var last_heros = JSON.parse( top["last_heros"] );
				for(var z = 0; z < 3; z++){
					if(last_heros[z]){
						pan.FindChildTraverse("heroicon_"+z).heroname = last_heros[z]["name"];
						var time = ~~(last_heros[z]["in_game_time"] / 60);
						time = time + " min"
						pan.FindChildTraverse("heroicon_"+z).SetPanelEvent("onmouseover",TipsOver2( time, pan.FindChildTraverse("heroicon_"+z) ))
						pan.FindChildTraverse("heroicon_"+z).SetPanelEvent("onmouseout",TipsOut2())
					}else{
						pan.FindChildTraverse("heroicon_"+z).visible = false;
					}
				}
			}else{
				pan.FindChildTraverse("besthero").visible = false;
			}
		}
	}

	// СЕЗОНЫ 
	for(var i = Object.keys( t.seasons ).length; i >= 1; i--){
		$case = t.seasons[i]
		$seasonColor = "color_" + i
		if($("#RatingSeasonPanel")){
			let pan = $.CreatePanel("Panel", $("#RatingSeasonPanel"), "")
			pan.BLoadLayoutSnippet("SnippetName")
			pan.FindChildTraverse("rait_season_id_1").AddClass($seasonColor)
			pan.FindChildTraverse("rait_season_id_2").text = i
			pan.FindChildTraverse("rait_season_id_2").AddClass($seasonColor)
			pan.FindChildTraverse("rait_season_id_4").text = $.Localize("#season_name_" + i)
			pan.FindChildTraverse("RatingSeasonImage").SetImage('file://{resources}/images/custom_game/rating/seasons/' + i + '.png')
			let arr = JSON.parse($case.play_info)
			for( var j = 4; j >= 0; j--){
				// $.Msg(j)
				// $.Msg(arr[j])
				let p = pan.FindChildTraverse("rait_pl_" + j)
				p.FindChildTraverse("rait_pl_id").AddClass($seasonColor)
				p.FindChildTraverse("rait_pl_ava").accountid = arr[j].sid
				p.FindChildTraverse("rait_pl_name").steamid = arr[j].sid
				p.FindChildTraverse("rait_pl_mmr").text = arr[j].rait
				p.FindChildTraverse("rait_pl_mmr").AddClass($seasonColor)
			}
		}
	}

}
var TipsOver2 = (function(message, pos)
{
	return function()
	{
        $.DispatchEvent( "DOTAShowTextTooltip", pos, $.Localize("#"+message));
	}
});

var TipsOut2 = (function()
{
	return function()
	{
        $.DispatchEvent( "DOTAHideTitleTextTooltip");
        $.DispatchEvent( "DOTAHideTextTooltip");
	}
});
function rank(points){
	var r
	if(parseInt(points) <= 2000){
		var step = 2000/15
		r = Math.trunc(parseInt(points)/step)
		r += 1
	}else if(parseInt(points) <= 5500){
		var step = 3500/20
		r = Math.trunc(parseInt(points-2000)/step)
		r += 15 + 1
	}else{
		r = 37
	}
	return r
}
/*
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
********************************************************************************************************************************************
*/

var shopnumber = 0
var specialAltOpenBut = false;

var openShopButton = function(){
	return function(){
		isShopOpen = true
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

	$('#DonateShopPanel').style.opacity = "0"
	$('#DonateShopPanel').style.preTransformScale2d = "0.8"
	$('#DonateShopPanel').style.transform = "translate3d(0px, 300px, 0px)"
	
	$('#donateShop').SetFocus(false)
	$('#BuyControl').visible = false
	$('#accept_shadow').visible = false
}
function specialOpnBut(){
	
	if(GameUI.IsAltDown() && specialAltOpenBut == true){
		specialAltOpenBut = false;
	}
	$('#openShopLabel').visible = false;
	let opnshp = openShopButton()
	opnshp()
}

function openShop(n){
	isopen = true
	windowName = "shop"
	$('#DonateShopPanel').style.opacity = "1"
	$('#DonateShopPanel').style.preTransformScale2d = "1"
	$('#DonateShopPanel').style.transform = "translate3d(0px, 0px, 0px)"
	for(var i = 1; i <= Object.keys( shopinfo ).length; i++){
		if(i == n){
			$('#TabLabelImg_' + i).AddClass('selected_bd')
			$('#TabLabelImg_' + i).RemoveClass('TabPanelOnServ')
			$('#TabLabel_' + i).AddClass('selected_text')
			$('#TabLabel_' + i).RemoveClass('TabLabelOnServ')
			visibleOn("DonateShopContentPanel_" + i)
		}else{
			if($('#TabLabelImg_' + i)){
				$('#TabLabelImg_' + i).AddClass('TabPanelOnServ')
				$('#TabLabelImg_' + i).RemoveClass('selected_bd')
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
		// $.Msg("accept buy 1")
		$('#BuyControl').visible = false;
		$('#accept_shadow').visible = false
		GameEvents.SendCustomGameEventToServer("buyItem", {i,n, amountBuy,currency})
		if(consumabl){
			var numb = Number(Number(shopinfo[i][n].now) + amountBuy)
			pan.FindChildTraverse('DonateShopItemButtonLabelStock').text = $.Localize('#stock') + ': ' + numb
			shopinfo[i][n].now = numb
		}else if(shopinfo[i][n].type == 'talant' || shopinfo[i][n].type == 'pet_change'){
			pan.FindChildTraverse('DonateShopItemButtonBuy').visible = false
			pan.FindChildTraverse('DonateShopItemButtonActive').visible = true
			pan.FindChildTraverse('DonateShopItemButtonLabelActive').text = $.Localize('#active')
			if(shopinfo[i][n].type == 'pet_change'){
				shopinfo[i][n].now = Number(Number(shopinfo[i][n].now) + amountBuy)
				RefreshPet(shopinfo)
			}
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
	// $.Msg()
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
		// $.Msg("buy 1")
		Game.EmitSound("ui_team_select_shuffle")
		if((shopinfo[i][n]['price']['don'] <= shopinfo.coins && !currency)
		|| (shopinfo[i][n]['price']['rp'] <= shopinfo.mmrpoints && currency)){
			$('#BuyControlTextLine2').text = $.Localize("#"+shopinfo[i][n]['name'])
			amountBuy = 1
			let dropdown = $('#BuyControlDrop')
			if(currency){
				$('#BuyControlCurGem').visible = false
				$('#BuyControlCurRp').visible = true
				$('#BuyControlTextLine3').text = shopinfo[i][n]['price']['rp']
				priceBuy = shopinfo[i][n]['price']['rp']
			}else{
				$('#BuyControlCurGem').visible = true
				$('#BuyControlCurRp').visible = false
				$('#BuyControlTextLine3').text = shopinfo[i][n]['price']['don']
				priceBuy = shopinfo[i][n]['price']['don']
			}
			if(shopinfo[i][n]['combinable']){
				dropdown.visible = true
				dropdown.RemoveAllOptions()
				for(let z = 1; z <= 10; z++){
					if(currency){
						if(z * shopinfo[i][n]['price']['rp'] <= shopinfo.mmrpoints){
							dropdown.AddOption($.CreatePanelWithProperties("Label", dropdown, "entry"+z, {text:z}))
						}
					}else{
						if(z * shopinfo[i][n]['price']['don'] <= shopinfo.coins){
							dropdown.AddOption($.CreatePanelWithProperties("Label", dropdown, "entry"+z, {text:z}))
						}
					}
					
				}
				dropdown.SetSelected('entry1')
			}else{
				dropdown.visible = false
			}
			
			$('#BuyControl').visible = true;
			$('#accept_shadow').visible = true;
			$('#acceptButton').SetPanelEvent("onmouseactivate",acceptBuy(i, n, pan, consumabl, currency))
		}
	}
});
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
				}else if(type == 'hero_change'){
					pan.FindChildTraverse('DonateShopItemButtonGived').visible = false
					pan.FindChildTraverse('DonateShopItemButtonActive').visible = true
					pan.FindChildTraverse('DonateShopItemButtonLabelActive').text = $.Localize('#active')
					for (const [productKey, productValue] of Object.entries(shopinfo[6])) {
						if(productValue.type == "hero_change" && productKey != n){
							sel = $("#ShopItem" + 6 + '_' + productKey)
							sel.FindChildTraverse('DonateShopItemButtonGived').visible = true
							sel.FindChildTraverse('DonateShopItemButtonHas').visible = false
							sel.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#shop_lock')
						}
					}
				}else{
			//item
					pan.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
				}
			//pets
				if(type == 'pet'){
					var shopPanel = $("#DonateShopContentPanel")
					
					for (const [categoryKey, categoryValue] of Object.entries(shopinfo)) {
						if(typeof(categoryValue) == 'object'){
							for (const [productKey, productValue] of Object.entries(categoryValue)) {
								if(typeof(productValue) == 'object' && productValue.type == "pet"){
									if(shopinfo[1][1].now == 0){
										singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
										singl.FindChildTraverse('DonateShopItemButtonHas').visible = false
										singl.FindChildTraverse('DonateShopItemButtonGived').visible = true
										singl.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
									}else if(shopinfo[1][1].now > 0){
										singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
										singl.FindChildTraverse('DonateShopItemButtonHas').visible = false
										singl.FindChildTraverse('DonateShopItemButtonGived').visible = true
										singl.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#shop_sleep')
									}
								}
							}
						}
					}
				}
			}
			GameEvents.SendCustomGameEventToServer("giveItem", {i : i, n : n})
			$.Schedule(0.2, function(){
				RefreshPet(shopinfo)
			})
		
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

$.Msg("212312")
function RefreshPet(t){
	issued = false
	for (const [key, value] of Object.entries(t[1])) {
		if(value.status && value.status == "issued"){
			issued = true;
			break;
		}
	}
	// $.Msg("issued:",issued)
	var shopPanel = $("#DonateShopContentPanel")
	if(t != null){
		for (const [categoryKey, categoryValue] of Object.entries(t)) {
			if(typeof(categoryValue) == 'object'){
				for (const [productKey, productValue] of Object.entries(categoryValue)) {
					if(typeof(productValue) == 'object' && productValue.type == "pet" && shopPanel){
						singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
						singl.FindChildTraverse('DonateShopItemButtonBuy').visible = false
						singl.FindChildTraverse('DonateShopItemButtonHas').visible = false
						singl.FindChildTraverse('DonateShopItemButtonGived').visible = false
						singl.FindChildTraverse('DonateShopItemButtonActive').visible = false
						if(issued){
							singl.FindChildTraverse('DonateShopItemButtonHas').visible = false
							singl.FindChildTraverse('DonateShopItemButtonGived').visible = true
							singl.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
						}else{
							if(productValue.status == 'taik'){
								singl.FindChildTraverse('DonateShopItemButtonHas').visible = true
								singl.FindChildTraverse('DonateShopItemButtonLabel').text = $.Localize('#taik')
							}else if(productValue.status == 'buy'){
								singl.FindChildTraverse('DonateShopItemButtonBuy').visible = true
							}else if(productValue.status == 'issued' && dr == null){
								singl.FindChildTraverse('DonateShopItemButtonGived').visible = true
								singl.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#issued')
							}else if(productValue.status == 'takeoff'){
								singl.FindChildTraverse('DonateShopItemButtonGived').visible = true
								singl.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#takeoff')
							}else if(productValue.status == 'active'){
								singl.FindChildTraverse('DonateShopItemButtonActive').visible = true
								singl.FindChildTraverse('DonateShopItemButtonLabelActive').text = $.Localize('#active')
							}
						}
					}
				}
			}
		}
	}
}

function change_pet(t){
	let pan = $("#ShopItem" + t[1] + '_' + t[2])
	if(pan){
		pan.FindChildTraverse('DonateShopItemButtonBuy').visible = false
		pan.FindChildTraverse('DonateShopItemButtonHas').visible = false
		pan.FindChildTraverse('DonateShopItemButtonGived').visible = false
		pan.FindChildTraverse('DonateShopItemButtonActive').visible = false
		pan.FindChildTraverse('DonateShopItemButtonHas').visible = true
		pan.FindChildTraverse('DonateShopItemButtonLabel').text = $.Localize('#taik')
	}
}

function initShop(tab){
	shopinfo = tab
	// деньги
	if($('#DonateMoneyLabel')){
		$('#DonateMoneyLabel').text = shopinfo.coins
		$('#MMMRPointsLabel').text = shopinfo.mmrpoints
	}

	
	for (const [key, value] of Object.entries(tab)) {
		if(typeof(value) == 'object'){
			if(value.name == 'pets'){continue}
			if($("#DonateShopTabsPanel")){
				var TabPanel = $.CreatePanel("Panel", $("#DonateShopTabsPanel"), "TabPanel_" + key);
				TabPanel.AddClass("TabPanel");
				TabPanel.SetPanelEvent("onmouseactivate",opn(key));
				var TabLabelImg = $.CreatePanel("Image", TabPanel, "TabLabelImg_" + key);
				TabLabelImg.SetImage('file://{resources}/images/custom_game/DonateShop/button_main.png')
				TabLabelImg.AddClass('TabLabelImg')
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
						if(tovarValue.type && tovarValue.type == 'consumabl'){
							pan.BLoadLayout("file://{resources}/layout/custom_game/DonateShopItem2.xml", false, false)
							pan.FindChildTraverse('DonateShopItemButtonLabelStock').text = $.Localize('#stock') + ': ' + tovarValue.now
							pan.FindChildTraverse('DonateShopItemButtonLabelNotAlign').text = tovarValue['price']['don']
							
							if(currency){
								pan.FindChildTraverse('DonateShopItemButtonBuyCon').SetPanelEvent("onmouseactivate",give(key, tovarKey, pan, true, true))
								pan.FindChildTraverse('DonateShopItemButtonHasCon').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, true, true))
							}else{
								pan.FindChildTraverse('DonateShopItemButtonBuyCon').SetPanelEvent("onmouseactivate",give(key, tovarKey, pan, true, false))
								pan.FindChildTraverse('DonateShopItemButtonHasCon').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, true, false))
							}
						}else{
							pan.BLoadLayout("file://{resources}/layout/custom_game/DonateShopItem1.xml", false, false)
							
							pan.FindChildTraverse('DonateShopItemButtonBuy').visible = false
							pan.FindChildTraverse('DonateShopItemButtonHas').visible = false
							pan.FindChildTraverse('DonateShopItemButtonGived').visible = false
							pan.FindChildTraverse('DonateShopItemButtonActive').visible = false
							if(tovarValue.status == 'taik' && tovarValue.type != 'gem'){
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
							}else if(tovarValue.status == 'shop_lock'){
								pan.FindChildTraverse('DonateShopItemButtonGived').visible = true
								pan.FindChildTraverse('DonateShopItemButtonLabelGived').text = $.Localize('#shop_lock')
							}else if(tovarValue.status == 'shop_select'){
								pan.FindChildTraverse('DonateShopItemButtonHas').visible = true
								pan.FindChildTraverse('DonateShopItemButtonLabel').text = $.Localize('#shop_select')
							}

							pan.FindChildTraverse('DonateShopItemButtonHas').SetPanelEvent("onmouseactivate",give(key, tovarKey, pan, false))
							pan.FindChildTraverse('shopButtonImgAndText1').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, false, false))
							pan.FindChildTraverse('shopButtonImgAndText2').SetPanelEvent("onmouseactivate",buy(key, tovarKey, pan, false, true))
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
						pan.AddClass('DonateShopItemPanel')
						// img
						if( tovarValue.image ){
							let img = pan.FindChildTraverse('DonateShopImg')
							img.SetImage('file://{resources}/' + tovarValue.image);
							img.SetPanelEvent("onmouseover",TipsOver2(tovarValue.tooltip, img))
							img.SetPanelEvent("onmouseout",TipsOut2())
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
						pan.FindChildTraverse('DonateShopItemLabel').style.color = 'white'
						// name 
						pan.FindChildTraverse('DonateShopItemLabel').text = $.Localize("#"+tovarValue.name)
						if(tovarValue.text_color){
							pan.FindChildTraverse('DonateShopItemLabel').style.color = tovarValue.text_color;
						}
						// price
						
						
					}
					n += 1
				}
			}
		}
	}
	// if(shopinfo[1][1].now == 0){
	// 	RefreshPet(tab)
	// }

	for(var i = 1; i <= Object.keys( shopinfo ).length; i++){
		if(typeof(shopinfo[i] == 'object')){
			if($('#TabPanel_' + i)){
				$('#TabPanel_' + i).AddClass('TabPanelOnServ')
				$('#TabLabel_' + i).AddClass('TabLabelOnServ')
				$('#TabLabel_' + i).AddClass('tab-normal-style')
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
	

	$.Schedule(0.5, function(){
		if($('#logotext1shop'))
			$('#logotext1shop').text = rating[LocalPlayer+1].points
		if($('#logotext2shop'))
			$('#logotext2shop').text = rating[LocalPlayer+1].games
		if($('#logotext3shop'))
			$('#logotext3shop').text = rating[LocalPlayer+1].likes
	})
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
	// $.Msg('TipsOver')

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

// click = false

// var trymove = (function()
// {
// 	return function()
// 	{
// 		click = true;
// 		clickingloop();
// 	}
// });

// var x = 0;
// var y = 0;
// function clickingloop(){
// 	if(click == false && GameUI.IsMouseDown(0) == false){
// 		return
// 	}
// 	if(GameUI.IsMouseDown(0)){
// 		var cursor = GameUI.GetCursorPosition()
// 		width = $('#DonateShopPanel').actuallayoutwidth;
// 		height = $('#DonateShopPanel').actuallayoutheight;
// 		x += cursor[0] - lastCursorPosition[0];
// 		y += cursor[1] - lastCursorPosition[1];
// 		lastCursorPosition = cursor
// 		$('#DonateShopPanel').style.position = x + 'px ' + y + 'px 0'
// 		$('#openShopPanelLabel').style.position = x + 'px ' + y + 'px 0'
// 	}else{
// 		lastCursorPosition = GameUI.GetCursorPosition()
// 	}
// 	$.Schedule(1/20,function(){
// 		clickingloop()
// 	})
// }


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
var ChangeOpen = false;
function UpdateChangeHeresInfo(t){
	// $.Msg(t)
	marci = t[1]
	pango = t[2]
}
function DeactivateShop(){
	hide_change()
}
// class ChangeHero {
// 	constructor(name, text1){
//         this.pan = $.CreatePanel("Panel", p, "")
//         this.amount = amount
//         this.pan.BLoadLayoutSnippet("achievement")
//         this.pan.FindChildTraverse("achi_task_des_lab").text = decription
//         this.pan.FindChildTraverse("achi_task_amount_lab").text = `${progress}/${amount}`
//         this.pan.FindChildTraverse("achi_line_filling").style.width = `${progress/amount*100}%`
//     }
// }

var ChangeHeroEventButton = (function(ChangeHero){
	return function(){
		if(ChangeHero.available[playerID]){
			hide_change()
			GameEvents.SendCustomGameEventToServer("ChangeHeroLua", {hero_name : ChangeHero.hero_name})
		}
	}
})
function hide_change(){
	if($("#ChangeHeroMainPanel") && ChangeOpen){
		$('#ChangeHeroMainPanel').RemoveClass('show_change')
		$('#ChangeHeroMainPanel').AddClass('hide_change')
		Game.EmitSound("ui_team_select_shuffle")
		$.Schedule(0.3, function(){
			$('#ChangeHeroMainPanel').RemoveClass('hide_change')
			$("#ChangeHeroMainPanel").visible = false
		})
		ChangeOpen = false
	}
}
function open_quest_window(index){
    var unit = Players.GetLocalPlayerPortraitUnit(),
		vecunit = Entities.GetAbsOrigin(unit),
		hero = Players.GetPlayerHeroEntityIndex(playerID),
		vechero = Entities.GetAbsOrigin(hero),
		length = Game.Length2D(vecunit,vechero),
		ChangeHero = null,
		i = 1
	
	if(index.index){
		//$.Msg(index)
		unit = Number(index.index)
		vecunit = Entities.GetAbsOrigin(unit)
	}
	if(unit != hero){
		//$.Msg('unit')
		if(!pango || !marci){
			return
		}
		if(pango && pango.index == unit){
			ChangeHero = pango;
		}else if(marci && marci.index == unit){
			ChangeHero = marci;
		}else{
			return
		}
		if(ChangeHero){
			GameUI.SelectUnit(unit, false)
			if(length < 350){
				if($("#ChangeHero_Text_2")){
					$("#ChangeHero_Text_2").text = $.Localize("#"+ChangeHero.hero_name)
				}
				if($("#ChangeHeroButtonText")){
					if(ChangeHero.selected[playerID]){
						$("#ChangeHeroButtonText").text = $.Localize("#сharacter_change_selected")
					}else if(ChangeHero.available[playerID]){
						$("#ChangeHeroButtonText").text = $.Localize("#сharacter_change_can_select")
					}else{
						$("#ChangeHeroButtonText").text = $.Localize("#сharacter_change_not_available")
					}
					if($("#ChangeHeroButtonPanel")){
						$("#ChangeHeroButtonPanel").SetPanelEvent("onmouseactivate",ChangeHeroEventButton(ChangeHero));
					}
				}
				if($("#ChangeHeroMainPanel")){
					$('#ChangeHeroMainPanel').RemoveClass('hide_change');
					$('#ChangeHeroMainPanel').AddClass('show_change');
					$("#ChangeHeroMainPanel").visible = true
				}
				ChangeOpen = true
			}
		}
	}
}

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

function FindChildTraverse(name){
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(name)
}

(function(){
	GameEvents.Subscribe( "Noti", Noti)
	GameEvents.Subscribe( "initRating", initRating)
	GameEvents.Subscribe( "initShop", initShop)
	GameEvents.Subscribe( "updateRatingCouter", updateRatingCouter)
	GameEvents.Subscribe( "update_gems_js", update_gems_js)
	GameEvents.Subscribe( "change_pet", change_pet)
	GameEvents.Subscribe( "UpdateChangeHeresInfo", UpdateChangeHeresInfo)
	GameEvents.Subscribe("dota_player_update_query_unit", open_quest_window);
	GameEvents.Subscribe("DeactivateShop",DeactivateShop)
	GameEvents.Subscribe("shop_refresh_pets",RefreshPet)
	// GameEvents.Subscribe('dota_player_update_selected_unit', open_quest_window);
	GameEvents.Subscribe('open_quest_window', open_quest_window);
	
	CustomNetTables.SubscribeNetTableListener( "shopinfo", shopinfoed );
	puls_bg_rating()
	puls_bg_shop()
	hudInit()
	visibleOff("openShopLabel")
	visibleOff("ChangeHeroMainPanel")
	visibleOff("LikeNotificationsPanel")
	visibleOff("BuyControl")
	visibleOff("RatingPanel")
	visibleOff("accept_shadow")
	if(FindChildTraverse('EditButton'))
		FindChildTraverse('EditButton').visible = false;
	if(FindChildTraverse("ToggleScoreboardButton"))
		FindChildTraverse("ToggleScoreboardButton").visible = false
	let topBar = FindChildTraverse("ButtonBar")
	if(topBar)
		topBar.style.height = "75px";
	let btn1 = FindChildTraverse("DashboardButton")
	if(btn1){
		btn1.style.height = "65px";
		btn1.style.width = "65px";	
	}
	let btn2 = FindChildTraverse("SettingsButton")
	if(btn2){
		btn2.style.height = "65px";
		btn2.style.width = "65px";
		btn2.style.backgroundSize = "65px"
	}
	if(topBar){
		let pan = $.CreatePanel('Panel', topBar, '')
		pan.BLoadLayout("file://{resources}/layout/custom_game/main/rating.xml", false, false)
		pan.SetPanelEvent("onmouseactivate",openRaitingButton());
		pan.SetPanelEvent("onmouseover",TipsOver2('rating',pan));
		pan.SetPanelEvent("onmouseout",TipsOut2());
		pan.style.tooltipPosition = 'bottom';
	}
	if(topBar){
		let pan = $.CreatePanel('Panel', topBar, '')
		pan.BLoadLayout("file://{resources}/layout/custom_game/main/shop.xml", false, false)
		pan.SetPanelEvent("onmouseactivate",openShopButton());
		pan.SetPanelEvent("onmouseover",TipsOver2('shop',pan));
		pan.SetPanelEvent("onmouseout",TipsOut2());
		pan.style.tooltipPosition = 'bottom';
	}

	if($("#smithy_main_item_panel")){
        $("#smithy_main_item_panel").SetPanelEvent("onmouseover", OnMouseOverItem("main"))
        $("#smithy_main_item_panel").SetPanelEvent("onmouseactivate", ReturnItemBack('main'))
    }
    if($("#smithy_gold_bar_panel")){
        $("#smithy_gold_bar_panel").SetPanelEvent("onmouseover", OnMouseOverItem("gold"))
        $("#smithy_gold_bar_panel").SetPanelEvent("onmouseactivate", ReturnItemBack('gold'))
    }
    if($("#smithy_soul_panel")){
        $("#smithy_soul_panel").SetPanelEvent("onmouseover", OnMouseOverItem("soul"))
        $("#smithy_soul_panel").SetPanelEvent("onmouseactivate", ReturnItemBack('soul'))
    }
    if($("#smithy_craft_button_panel")){
        $("#smithy_craft_button_panel").SetPanelEvent("onmouseactivate", PickUpItem())
    }

    if($('#smithy_gem_purple_panel')){
        $("#smithy_gem_purple_panel").SetPanelEvent("onmouseover", TipsOver2('tooltip_purple_gem_description', $("#smithy_gem_purple_panel")))
        $("#smithy_gem_purple_panel").SetPanelEvent("onmouseout", TipsOut2())
    }
    if($('#smithy_gem_blue_panel')){
        $("#smithy_gem_blue_panel").SetPanelEvent("onmouseover", TipsOver2('tooltip_blue_gem_description', $("#smithy_gem_blue_panel")))
        $("#smithy_gem_blue_panel").SetPanelEvent("onmouseout", TipsOut2())
    }
    if($('#smithy_gem_orange_panel')){
        $("#smithy_gem_orange_panel").SetPanelEvent("onmouseover", TipsOver2('tooltip_orange_gem_description', $("#smithy_gem_orange_panel")))
        $("#smithy_gem_orange_panel").SetPanelEvent("onmouseout", TipsOut2())
    }
    if($('#smithy_gem_red_panel')){
        $("#smithy_gem_red_panel").SetPanelEvent("onmouseover", TipsOver2('tooltip_red_gem_description', $("#smithy_gem_red_panel")))
        $("#smithy_gem_red_panel").SetPanelEvent("onmouseout", TipsOut2())
    }
    if($('#smithy_gem_green_panel')){
        $("#smithy_gem_green_panel").SetPanelEvent("onmouseover", TipsOver2('tooltip_green_gem_description', $("#smithy_gem_green_panel")))
        $("#smithy_gem_green_panel").SetPanelEvent("onmouseout", TipsOut2())
    }
})();

// function getRandomInt(max) {
// 	return Math.floor(Math.random() * Math.floor(max));
// }
// var allHeroes = [
// 	{heroname : "BrewMaster", image : "asdfgsf/sdfsgdfg/sdf.png"},
// 	{heroname : "BrewMaster2", image : "2asdfgsf/sdfsgdfg/sdf.png"},
// 	{heroname : "BrewMaster3", image : "3asdfgsf/sdfsgdfg/sdf.png"},
// 	{heroname : "BrewMaster4", image : "4asdfgsf/sdfsgdfg/sdf.png"},
// 	{heroname : "BrewMaster5", image : "5asdfgsf/sdfsgdfg/sdf.png"},
// 	{heroname : "BrewMaster6", image : "6asdfgsf/sdfsgdfg/sdf.png"},
// ]

// var rand1 = getRandomInt(allHeroes.length)
// var rand2 = getRandomInt(allHeroes.length)
// var rand3 = getRandomInt(allHeroes.length)
// $.Msg('--------------')
// $.Msg(allHeroes[rand1].heroname, ' ---------- ', allHeroes[rand1].image)
// $.Msg(allHeroes[rand2].heroname, ' ---------- ', allHeroes[rand2].image)
// $.Msg(allHeroes[rand3].heroname, ' ---------- ', allHeroes[rand3].image)


// $("#panel").SetImage("file://{resources}/images/custom_game/ranks/image-" + i + ".png");