const tableLength = 7
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
	pango = null

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
	if(!$('#RatingPanel')) return
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
		profil.FindChildTraverse('logotext1').text = t.rating[i].points
		profil.FindChildTraverse('logotext2').text = t.rating[i].games
		profil.FindChildTraverse('logotext3').text = t.rating[i].likes
		profil.FindChildTraverse('logotext4').text = t.rating[i].reports
		profil.FindChildTraverse('RatingProfilRank').SetImage(rankUrl)
		profil.FindChildTraverse("RatingProfilLike").visible = false
		profil.FindChildTraverse("RatingProfilDislike").visible = false
		profil.FindChildTraverse("RatingProfilLike").SetPanelEvent("onmouseactivate",function(){commenBut(i,'likes')})
		profil.FindChildTraverse("RatingProfilDislike").SetPanelEvent("onmouseactivate",function(){commenBut(i,'reports')})
		profil.FindChildTraverse("profil_first_game_label").text = typeof(t.rating[i].first_game) == 'string' ? t.rating[i].first_game : "-"
		profil.FindChildTraverse("last_games_profil").RemoveAndDeleteChildren()
		for(let n in t.history[i]){
			let pan = $.CreatePanel("Panel", profil.FindChildTraverse("last_games_profil"), "")
			pan.AddClass("profil_game")
			let p1 = $.CreatePanel("Panel", pan, "")
			p1.AddClass("profil_game_colun_des_panel")
			let p11 = $.CreatePanel("DOTAHeroImage", p1, "")
			p11.AddClass("last_game_hero_img")
			p11.heroimagestyle = landscape
			p11.heroname = t.history[i][n].hero_name
			let p2 = $.CreatePanel("Panel", pan, "")
			p2.AddClass("profil_game_colun_des_panel")
			const p22 = $.CreatePanel("Label", p2, "")
			p22.text = $.Localize("#"+t.history[i][n].result)
			p22.style.color = t.history[i][n].result == 'win' ? "#19962b" : "rgb(204, 68, 68)"
			let p3 = $.CreatePanel("Panel", pan, "")
			p3.AddClass("profil_game_colun_des_panel")
			const p33 = $.CreatePanel("Label", p3, "")
			p33.text = $.Localize("#"+t.history[i][n].status)
			p33.style.color = t.history[i][n].status == 'in' ? "#19962b" : "rgb(204, 68, 68)"
			let p4 = $.CreatePanel("Panel", pan, "", {class:"profil_game_colun_des_panel"})
			p4.AddClass("profil_game_colun_des_panel")
			const p44 = $.CreatePanel("Label", p4, "")
			p44.text = Math.ceil(t.history[i][n].in_game_time/60) + " " + $.Localize("#min")
			let p5 = $.CreatePanel("Panel", pan, "")
			p5.AddClass("profil_game_colun_des_panel")
			const p55 = $.CreatePanel("Label", p5, "")
			p55.text = t.history[i][n].level
			p55.style.color = "yellow"
			let mode_color = "white"
			if(t.history[i][n].mode == "hard"){
				mode_color = "rgb(204, 68, 68)"
			}else if(t.history[i][n].mode == "ultra"){
				mode_color = "rgb(159, 68, 212)"
			}else if(t.history[i][n].mode == 4){
				mode_color = "rgb(46, 108, 201)"
			}
			let p6 = $.CreatePanel("Panel", pan, "")
			p6.AddClass("profil_game_colun_des_panel")
			const p66 = $.CreatePanel("Label", p6, "")
			p66.text = $.Localize("#"+t.history[i][n].mode)
			p66.style.color = mode_color
			// pan.BLoadLayoutSnippet("profil_game_history")
			// $.Msg(profil.FindChildTraverse("last_games_profil"))
			// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i][n].hero_name
			// let children_count = profil.FindChildTraverse("last_games_profil").GetChildCount()
			// let pan = profil.FindChildTraverse("last_games_profil").GetChild(children_count-1)
			// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i][n].hero_name
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

var commenBut = (function(i, type)
{
	return function(){
		Game.EmitSound("ui_team_select_shuffle")
		var loc = Players.GetLocalPlayer();
		// $.Msg(rating[loc]);
		if(rating[loc].commens > 0 && commented[i] != true){
			$("#RatingTeamPlayer"+i).FindChildTraverse("comens").visible = false;
			// $.Msg("1");
			rating[loc].commens -= 1;
			commented[i] = true;
			GameEvents.SendCustomGameEventToServer("CommentChange", {type:type,pid:i});
			$("#RatingCommentCout").text = rating[loc].commens;
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
		var rankUrl = 'file://{resources}/images/custom_game/ranks/' + rank(t.rating[i].points) + '.png';
		
		
		if($("#RatingTeamPanel")){
			var pan = $.CreatePanel("Panel", $("#RatingTeamPanel"), "RatingTeamPlayer" + i)
			pan.BLoadLayout("file://{resources}/layout/custom_game/RatingTeam.xml", false, false)
			pan.FindChildTraverse("RatingPlayerAvatar").heroname = Players.GetPlayerSelectedHero(i)
			pan.FindChildTraverse("RatingPlayerName").steamid = plysteamid
			pan.FindChildTraverse("RatingPlayerAvatar").SetPanelEvent("onmouseactivate",playerProfil(t,i,plysteamid,rankUrl,playerconf))
			pan.FindChildTraverse("RatingPlayerLikes2").text = t.rating[i].likes
			pan.FindChildTraverse("RatingPlayerReports2").text = t.rating[i].reports
			pan.FindChildTraverse("RatingPlayergames").text = t.rating[i].games
			pan.FindChildTraverse("RatingPlayerrait").text = t.rating[i].points
			pan.FindChildTraverse("RatingPlayerRank").SetImage(rankUrl)
			
			if(t.rating[i].last_heros){
				var last_heros = JSON.parse( t.rating[i].last_heros );
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
				pan.FindChildTraverse("likeimg").SetPanelEvent("onmouseactivate",commenBut(i,'likes'))
				pan.FindChildTraverse("dislikeimg").SetPanelEvent("onmouseactivate",commenBut(i,'reports'))
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
				profil.FindChildTraverse('logotext1').text = t.rating[i].points
				profil.FindChildTraverse('logotext2').text = t.rating[i].games
				profil.FindChildTraverse('logotext3').text = t.rating[i].likes
				profil.FindChildTraverse('logotext4').text = t.rating[i].reports
				profil.FindChildTraverse("profil_first_game_label").text = t.rating[i].first_game
				for(let n in t.history[i]){
					let pan = $.CreatePanel("Panel", profil.FindChildTraverse("last_games_profil"), "")
					pan.AddClass("profil_game")
					let p1 = $.CreatePanel("Panel", pan, "")
					p1.AddClass("profil_game_colun_des_panel")
					const p11 = $.CreatePanel("DOTAHeroImage", p1, "")
					p11.AddClass("last_game_hero_img")
					p11.heroimagestyle = "landscape"
					p11.heroname = t.history[i][n].hero_name
					let p2 = $.CreatePanel("Panel", pan, "")
					p2.AddClass("profil_game_colun_des_panel")
					const p22 = $.CreatePanel("Label", p2, "")
					p22.text = $.Localize("#"+t.history[i][n].result)
					p22.style.color = t.history[i][n].result == 'win' ? "#19962b" : "rgb(204, 68, 68)"
					let p3 = $.CreatePanel("Panel", pan, "")
					p3.AddClass("profil_game_colun_des_panel")
					const p33 = $.CreatePanel("Label", p3, "")
					p33.text = $.Localize("#"+t.history[i][n].status)
					p33.style.color = t.history[i][n].status == 'in' ? "#19962b" : "rgb(204, 68, 68)"
					let p4 = $.CreatePanel("Panel", pan, "")
					p4.AddClass("profil_game_colun_des_panel")
					const p44 =  $.CreatePanel("Label", p4, "")
					p44.text = Math.ceil(t.history[i][n].in_game_time/60) + " " + $.Localize("#min")
					let p5 = $.CreatePanel("Panel", pan, "")
					p5.AddClass("profil_game_colun_des_panel")
					const p55 = $.CreatePanel("Label", p5, "")
					p55.text = t.history[i][n].level
					p55.style.color = "yellow"
					let mode_color = "white"
					if(t.history[i][n].mode == "hard"){
						mode_color = "rgb(204, 68, 68)"
					}else if(t.history[i][n].mode == "ultra"){
						mode_color = "rgb(159, 68, 212)"
					}else if(t.history[i][n].mode == 4){
						mode_color = "rgb(46, 108, 201)"
					}
					let p6 = $.CreatePanel("Panel", pan, "")
					p6.AddClass("profil_game_colun_des_panel")
					const p66 = $.CreatePanel("Label", p6, "")
					p66.text = $.Localize("#"+t.history[i][n].mode)
					p66.style.color = mode_color
					// pan.BLoadLayoutSnippet("profil_game_history")
					// $.Msg(profil.FindChildTraverse("last_games_profil"))
					// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i][n].hero_name
					// let children_count = profil.FindChildTraverse("last_games_profil").GetChildCount()
					// let pan = profil.FindChildTraverse("last_games_profil").GetChild(children_count-1)
					// pan.FindChildTraverse("last_game_hero_img").heroname = t.history[i][n].hero_name
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
		$("#RatingCommentCout").text = rating[LocalPlayer].commens
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
				var last_heros = top["last_heros"];
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
		let text = $.Localize("#"+message)
		if(text == $.Localize("#"+message)){
			text = message
		}
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
	if(!$('#RDAShopPanel')) return
	isopen = false
	if(IsSelected){
		IsSelected = false;
		$('#RDAShop').hittest = false
		$('#RDAShopPanel').style.position = x + 'px ' + y + 'px 0'
	}
	// if(GameUI.IsAltDown() && specialAltOpenBut == false){
	// 	specialAltOpenBut = true;
	// }else if(GameUI.IsAltDown() && specialAltOpenBut == true){
	// 	specialAltOpenBut = false;
	// }
	if(specialAltOpenBut){
		$.Schedule(0.2, function(){
			$('#openShopLabel').visible = true;
		})
	}

	$('#RDAShopPanel').style.opacity = "0"
	$('#RDAShopPanel').style.preTransformScale2d = "0.8"
	$('#RDAShopPanel').style.transform = "translate3d(0px, 300px, 0px)"
	
	$('#RDAShop').SetFocus(false)
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
	$('#RDAShopPanel').style.opacity = "1"
	$('#RDAShopPanel').style.preTransformScale2d = "1"
	$('#RDAShopPanel').style.transform = "translate3d(0px, 0px, 0px)"
	for(var i = 1; i <= tableLength; i++){
		if(i == n){
			$('#TabLabelImg_' + i).AddClass('selected_bd')
			$('#TabLabelImg_' + i).RemoveClass('TabPanelOnServ')
			$('#TabLabel_' + i).AddClass('selected_text')
			$('#TabLabel_' + i).RemoveClass('TabLabelOnServ')
			visibleOn("RDAShopContentPanel_" + i)
		}else{
			if($('#TabLabelImg_' + i)){
				$('#TabLabelImg_' + i).AddClass('TabPanelOnServ')
				$('#TabLabelImg_' + i).RemoveClass('selected_bd')
			}
			if($('#TabLabel_' + i)){
				$('#TabLabel_' + i).AddClass('TabLabelOnServ')
				$('#TabLabel_' + i).RemoveClass('selected_text')
			}
			visibleOff("RDAShopContentPanel_" + i)
		}
	}
	if($('#TabLabelImg_Inventory')){
		$('#TabLabelImg_Inventory').AddClass('TabPanelOnServ')
		$('#TabLabelImg_Inventory').RemoveClass('selected_bd')
	}
	if($('#TabLabel_Inventory')){
		$('#TabLabel_Inventory').AddClass('TabLabelOnServ')
		$('#TabLabel_Inventory').RemoveClass('selected_text')
	}
	visibleOff("RDAShopContentPanel_Inventory")
	if(n == 0){
		$('#TabLabelImg_Inventory').AddClass('selected_bd')
		$('#TabLabelImg_Inventory').RemoveClass('TabPanelOnServ')
		$('#TabLabel_Inventory').AddClass('selected_text')
		$('#TabLabel_Inventory').RemoveClass('TabLabelOnServ')
		visibleOn("RDAShopContentPanel_Inventory")
	}
	$('#ShopBuyGemsButtonLabel').AddClass('selected_bd')
	$('#ShopBuyGemsButtonLabel').RemoveClass('TabPanelOnServ')
	$('#ShopBuyGemsButtonLabel').AddClass('selected_text')
	$('#ShopBuyGemsButtonLabel').RemoveClass('TabLabelOnServ')
	if(n == 5){
		$('#ShopBuyGemsButtonLabel').RemoveClass('selected_bd')
		$('#ShopBuyGemsButtonLabel').AddClass('TabPanelOnServ')
		$('#ShopBuyGemsButtonLabel').RemoveClass('selected_text')
		$('#ShopBuyGemsButtonLabel').AddClass('TabLabelOnServ')
	}
}


function OpenInventory(){
	let Inventory = $("#RDAShopContentPanel_Inventory")
	Inventory.RemoveAndDeleteChildren()

	for(var i = 1; i <= tableLength; i++){
		if(shopinfo[i].name == "pets" || shopinfo[i].name == "other") continue
		for (const [key, value] of Object.entries(shopinfo[i])) {
			if(typeof(value) != 'object' || value.onStart == 0) continue
			value.categoryKey = i
			value.productKey = key
			if(Inventory){
				CreateItem(value, Inventory, "ShopItem_Inventory" + value.categoryKey + '_' + value.productKey)
			}
		}
	}
	let o = opn(0)
	o()
}

function OpenBuyGens(){
	let o = opn(7)
	o()
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
		$('#BuyControl').visible = false;
		$('#accept_shadow').visible = false
		GameEvents.SendCustomGameEventToServer("buyItem", {i,n, amountBuy,currency})
		var numb = Number(Number(shopinfo[i][n].now) + amountBuy)
		shopinfo[i][n].now = numb
		shopinfo[i][n].onStart = Number(shopinfo[i][n].onStart) + amountBuy
		$("#ShopItem" + i + '_' + n).FindChildTraverse('RDAShopItemButtonLabelStock').text =  numb
		if($("#ShopItem_Inventory" + i + '_' + n)){
			$("#ShopItem_Inventory" + i + '_' + n).FindChildTraverse('RDAShopItemButtonLabelStock').text =  numb
		}
		if(consumabl){
			
		}else if(shopinfo[i][n].type == 'talant' || shopinfo[i][n].type == 'pet_change'){
			pan.FindChildTraverse('RDAShopItemButtonBuy').visible = false
			pan.FindChildTraverse('RDAShopItemButtonActive').visible = true
			pan.FindChildTraverse('RDAShopItemButtonLabelActive').text = $.Localize('#active')
			if(shopinfo[i][n].type == 'pet_change'){
				shopinfo[i][n].now = Number(Number(shopinfo[i][n].now) + amountBuy)
				// RefreshPet(shopinfo)
			}
		}else if(shopinfo[i][n].type != 'gem' && shopinfo[i][n].type != 'loot-box'){
			if(pan.FindChildTraverse('RDAShopItemButtonHas'))
				pan.FindChildTraverse('RDAShopItemButtonHas').visible = true
			if(pan.FindChildTraverse('RDAShopItemButtonBuy'))
				pan.FindChildTraverse('RDAShopItemButtonBuy').visible = false
			if(pan.FindChildTraverse('RDAShopItemButtonLabel'))
				pan.FindChildTraverse('RDAShopItemButtonLabel').text = $.Localize('#taik')
		}
		if(currency){
			shopinfo.mmrpoints = Number(Number(shopinfo.mmrpoints) - Number(shopinfo[i][n]['price']['rp']))
		}else{
			shopinfo.coins = Number(Number(shopinfo.coins) - Number(shopinfo[i][n]['price']['don']))
		}
		$('#RDAMoneyLabel').text = shopinfo.coins
		$('#MMMRPointsLabel').text = shopinfo.mmrpoints
		if(shopinfo[i][n].type == 'talant'){
			var shopPanel = $("#RDAShopContentPanel")
			for (const [categoryKey, categoryValue] of Object.entries(shopinfo)) {
				if(typeof(categoryValue) == 'object'){
					for (const [productKey, productValue] of Object.entries(categoryValue)) {
						if(typeof(productValue) == 'object' && productValue.type == "talant" && productValue.hero == shopinfo[i][n].hero){
							singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
							singl.FindChildTraverse('RDAShopItemButtonBuy').visible = false
							singl.FindChildTraverse('RDAShopItemButtonActive').visible = true
							singl.FindChildTraverse('RDAShopItemButtonLabelActive').text = $.Localize('#active')
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
		if($('#BuyControlDrop') && $('#BuyControlDrop').GetChild(0) && $('#BuyControlDrop').GetChild(0).id == id){
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
							const new_panel = $.CreatePanel("Label", dropdown, "entry"+z)
							new_panel.text = z
							dropdown.AddOption(new_panel)
						}
					}else{
						if(z * shopinfo[i][n]['price']['don'] <= shopinfo.coins){
							const new_panel = $.CreatePanel("Label", dropdown, "entry"+z)
							new_panel.text = z
							dropdown.AddOption(new_panel)
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
		}else{
			ErrorMessage({message : "#dota_don_shop_error"})
		}
	}
});

function ErrorMessage(data){
	GameEvents.SendEventClientSide("dota_hud_error_message",
	{
		"splitscreenplayer": 0,
		"reason": 80,
		"message": data.message
	})
}
GameEvents.Subscribe("CreateIngameErrorMessage", function(data) { ErrorMessage(data) })
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
					$("#ShopItem" + i + '_' + n).FindChildTraverse('RDAShopItemButtonLabelStock').text =  numb
					if($("#ShopItem_Inventory" + i + '_' + n)){
						$("#ShopItem_Inventory" + i + '_' + n).FindChildTraverse('RDAShopItemButtonLabelStock').text =  numb
					}
				}
				if(numb <= 0){
					shopinfo[i][n].now = 0
				}else{
					shopinfo[i][n].now = numb
				}
				
			}else{
		//else
				var c = shopinfo[i][n].now
				$("#ShopItem" + i + '_' + n).FindChildTraverse('RDAShopItemButtonGived').visible = true
				$("#ShopItem" + i + '_' + n).FindChildTraverse('RDAShopItemButtonHas').visible = false
				if($("#ShopItem_Inventory" + i + '_' + n)){
					$("#ShopItem_Inventory" + i + '_' + n).FindChildTraverse('RDAShopItemButtonGived').visible = true
					$("#ShopItem_Inventory" + i + '_' + n).FindChildTraverse('RDAShopItemButtonHas').visible = false
				}
			//effect
				if(type == 'effect'){
					pan.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#takeoff')
					pan.FindChildTraverse('RDAShopItemButtonGived').SetPanelEvent("onmouseactivate",takeoff(pan, i, n))
				}else if(type == 'hero_change'){
					pan.FindChildTraverse('RDAShopItemButtonGived').visible = false
					pan.FindChildTraverse('RDAShopItemButtonActive').visible = true
					pan.FindChildTraverse('RDAShopItemButtonLabelActive').text = $.Localize('#active')
					for (const [productKey, productValue] of Object.entries(shopinfo[6])) {
						if(productValue.type == "hero_change" && productKey != n){
							sel = $("#ShopItem" + 6 + '_' + productKey)
							sel.FindChildTraverse('RDAShopItemButtonGived').visible = true
							sel.FindChildTraverse('RDAShopItemButtonHas').visible = false
							sel.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#shop_lock')
						}
					}
				}else{
			//item	
					$("#ShopItem" + i + '_' + n).FindChildTraverse('RDAShopItemButtonLabelGived').text =  $.Localize('#issued')
					if($("#ShopItem_Inventory" + i + '_' + n)){
						$("#ShopItem_Inventory" + i + '_' + n).FindChildTraverse('RDAShopItemButtonLabelGived').text =  $.Localize('#issued')
					}
				}
			//pets
				if(type == 'pet'){
					var shopPanel = $("#RDAShopContentPanel")
					
					for (const [categoryKey, categoryValue] of Object.entries(shopinfo)) {
						if(typeof(categoryValue) == 'object'){
							for (const [productKey, productValue] of Object.entries(categoryValue)) {
								if(typeof(productValue) == 'object' && productValue.type == "pet"){
									if(shopinfo[1][1].now == 0){
										singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
										singl.FindChildTraverse('RDAShopItemButtonHas').visible = false
										singl.FindChildTraverse('RDAShopItemButtonGived').visible = true
										singl.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#issued')
									}else if(shopinfo[1][1].now > 0){
										singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
										singl.FindChildTraverse('RDAShopItemButtonHas').visible = false
										singl.FindChildTraverse('RDAShopItemButtonGived').visible = true
										singl.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#shop_sleep')
									}
								}
							}
						}
					}
				}
			}
			GameEvents.SendCustomGameEventToServer("giveItem", {i : i, n : n})
			$.Schedule(0.2, function(){
				// RefreshPet(shopinfo)
			})
		
	}
});

var takeoff = (function(pan, i, n)
{
	return function()
	{	
		Game.EmitSound("ui_team_select_shuffle")
		
		//$.Msg("take off")
		pan.FindChildTraverse('RDAShopItemButtonGived').visible = false
		pan.FindChildTraverse('RDAShopItemButtonHas').visible = true
		GameEvents.SendCustomGameEventToServer("takeOffEffect", {i : i, n : n})
	}
});

function RefreshPet(t){
	issued = false
	for (const [key, value] of Object.entries(t[1])) {
		if(value.status && value.status == "issued"){
			issued = true;
			break;
		}
	}
	// $.Msg("issued:",issued)
	var shopPanel = $("#RDAShopContentPanel")
	if(t != null){
		for (const [categoryKey, categoryValue] of Object.entries(t)) {
			if(typeof(categoryValue) == 'object'){
				for (const [productKey, productValue] of Object.entries(categoryValue)) {
					if(typeof(productValue) == 'object' && productValue.type == "pet" && shopPanel){
						singl = shopPanel.FindChildTraverse("ShopItem" + categoryKey + '_' + productKey)
						singl.FindChildTraverse('RDAShopItemButtonBuy').visible = false
						singl.FindChildTraverse('RDAShopItemButtonHas').visible = false
						singl.FindChildTraverse('RDAShopItemButtonGived').visible = false
						singl.FindChildTraverse('RDAShopItemButtonActive').visible = false
						if(issued){
							singl.FindChildTraverse('RDAShopItemButtonHas').visible = false
							singl.FindChildTraverse('RDAShopItemButtonGived').visible = true
							singl.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#issued')
						}else{
							if(productValue.status == 'taik'){
								singl.FindChildTraverse('RDAShopItemButtonHas').visible = true
								singl.FindChildTraverse('RDAShopItemButtonLabel').text = $.Localize('#taik')
							}else if(productValue.status == 'buy'){
								singl.FindChildTraverse('RDAShopItemButtonBuy').visible = true
							}else if(productValue.status == 'issued' && dr == null){
								singl.FindChildTraverse('RDAShopItemButtonGived').visible = true
								singl.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#issued')
							}else if(productValue.status == 'takeoff'){
								singl.FindChildTraverse('RDAShopItemButtonGived').visible = true
								singl.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#takeoff')
							}else if(productValue.status == 'active'){
								singl.FindChildTraverse('RDAShopItemButtonActive').visible = true
								singl.FindChildTraverse('RDAShopItemButtonLabelActive').text = $.Localize('#active')
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
		pan.FindChildTraverse('RDAShopItemButtonBuy').visible = false
		pan.FindChildTraverse('RDAShopItemButtonHas').visible = false
		pan.FindChildTraverse('RDAShopItemButtonGived').visible = false
		pan.FindChildTraverse('RDAShopItemButtonActive').visible = false
		pan.FindChildTraverse('RDAShopItemButtonHas').visible = true
		pan.FindChildTraverse('RDAShopItemButtonLabel').text = $.Localize('#taik')
	}
}

const QuickUseSpray = (value)=>{
	return ()=>{
		GameEvents.SendCustomGameEventToServer( "CastSpray", {sprayName : value.name} )
		closeShop()
	}
}

const SprayToggleActivate = (value, pan)=>{
	return ()=>{
		toggleState = pan.FindChildTraverse("ShopItemCheckBox").checked
		if(toggleState){
			for(let productKey in shopinfo[value.categoryKey]){
				if(productKey == value.productKey) continue
				const sprayItem = $("#ShopItem" + value.categoryKey + '_' + productKey)
				if(sprayItem){ 
					sprayItem.FindChildTraverse("ShopItemCheckBox").SetSelected(false)
				}
				const inventorySprayItem = $("#ShopItem_Inventory" + value.categoryKey + '_' + productKey)
				if(inventorySprayItem){
					inventorySprayItem.FindChildTraverse("ShopItemCheckBox").SetSelected(false)
				}
			}
		}
		GameEvents.SendCustomGameEventToServer("SprayToggleActivate", { 
			toggleState : toggleState,
			categoryKey : value.categoryKey,
			productKey : value.productKey,
		})
	}
}

const SprayOnmouseover = (value, pan)=>{
	return ()=>{
		if(shopinfo[value.categoryKey][value.productKey].now > 0){
			pan.FindChildTraverse("ShopItemCheckBox").style.opacity = "1"
		}
	}
}
const SprayOnmouseout = (value, pan)=>{
	return ()=>{
		if(shopinfo[value.categoryKey][value.productKey].now > 0){
			pan.FindChildTraverse("ShopItemCheckBox").style.opacity = "0"
		}
	}
}

const CreateItem = function(value, parentPanel, newPanelId){
	var pan = $.CreatePanel("Panel", parentPanel, newPanelId)
	pan.AddClass("RDAShopItemPanel")
	if(value.hidden != undefined) pan.visible = false
	if(!value.layout){
		pan.BLoadLayout("file://{resources}/layout/custom_game/RDAShopItem1.xml", false, false)
	}else{
		pan.BLoadLayout("file://{resources}/layout/custom_game/"+value.layout+".xml", false, false)
	}
	// -----------------------------------------------------------------------------
	if(pan.FindChildTraverse('RDAShopItemButtonBuy')){
		pan.FindChildTraverse('RDAShopItemButtonBuy').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonHas')){
		pan.FindChildTraverse('RDAShopItemButtonHas').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonGived')){
		pan.FindChildTraverse('RDAShopItemButtonGived').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonActive')){
		pan.FindChildTraverse('RDAShopItemButtonActive').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonInTreasuries')){
		pan.FindChildTraverse('RDAShopItemButtonInTreasuries').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonSell')){
		pan.FindChildTraverse('RDAShopItemButtonSell').visible = false
	}
	if(pan.FindChildTraverse('ShopItemCheckBox')){
		pan.FindChildTraverse('ShopItemCheckBox').style.opacity = "0"
	}
	if(pan.FindChildTraverse("RDAShopItemButtonQuickUse")){
		pan.FindChildTraverse('RDAShopItemButtonQuickUse').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonLabelStockPanel') && !value.counter){
		pan.FindChildTraverse('RDAShopItemButtonLabelStockPanel').visible = false
	}
	if(pan.FindChildTraverse('RDAShopItemButtonPreview')){
		pan.FindChildTraverse('RDAShopItemButtonPreview').visible = false
	}
	// -----------------------------------------------------------------------------------
	//////////////////////			Расходники 
	//////////////////////			RDAShopItem2
	// -----------------------------------------------------------------------------------
	// Текст кол-во расходников
	if(pan.FindChildTraverse('RDAShopItemButtonLabelStock')){
		pan.FindChildTraverse('RDAShopItemButtonLabelStock').text = value.now
	}
	// Кнопки расходников
	if(pan.FindChildTraverse('RDAShopItemButtonBuyCon') && pan.FindChildTraverse('RDAShopItemButtonHasCon')){
		if(value.price && value.price.rp){
			pan.FindChildTraverse('RDAShopItemButtonBuyCon').SetPanelEvent("onmouseactivate",give(value.categoryKey, value.productKey, pan, true, true))
			// pan.FindChildTraverse('shop_button_price_container_don').SetPanelEvent("onmouseactivate",buy(value.categoryKey, value.productKey, pan, true, true))
		}else if(value.price && value.price.don){
			pan.FindChildTraverse('RDAShopItemButtonBuyCon').SetPanelEvent("onmouseactivate",give(value.categoryKey, value.productKey, pan, true, false))
			// pan.FindChildTraverse('RDAShopItemButtonHasCon').SetPanelEvent("onmouseactivate",buy(value.categoryKey, value.productKey, pan, true, false))
		}
	}
	

	if(pan.FindChildTraverse('shopButtonImg') && value.price && value.price.rp){
		pan.FindChildTraverse('shopButtonImg').SetImage('file://{resources}/images/custom_game/RDAShop/protection.png')
		pan.FindChildTraverse('shopButtonImg').style.height ="20px";
		pan.FindChildTraverse('shopButtonImg').style.width = "23px";
	}

	// -----------------------------------------------------------------------------------
	//////////////////////			Обычный предмет 
	//////////////////////			RDAShopItem2
	// -----------------------------------------------------------------------------------
	if(value.status == 'taik' && value.type != 'gem'){
		if(pan.FindChildTraverse('RDAShopItemButtonHas')){
			pan.FindChildTraverse('RDAShopItemButtonHas').visible = true
		}
		if(pan.FindChildTraverse('RDAShopItemButtonLabel')){
			pan.FindChildTraverse('RDAShopItemButtonLabel').text = $.Localize('#taik')
		}
	}else if(value.status == 'buy' || value.type == 'gem' ){
		if(pan.FindChildTraverse('RDAShopItemButtonBuy')){
			pan.FindChildTraverse('RDAShopItemButtonBuy').visible = true
		}
	}else if(value.status == 'issued'){
		if(pan.FindChildTraverse('RDAShopItemButtonGived')){
			pan.FindChildTraverse('RDAShopItemButtonGived').visible = true
		}
		if(pan.FindChildTraverse('RDAShopItemButtonLabelGived')){
			pan.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#issued')
		}
	}else if(value.status == 'takeoff'){
		if(pan.FindChildTraverse('RDAShopItemButtonGived')){
			pan.FindChildTraverse('RDAShopItemButtonGived').visible = true
			pan.FindChildTraverse('RDAShopItemButtonGived').SetPanelEvent("onmouseactivate",takeoff(pan, value.categoryKey, value.productKey))
		}
		if(pan.FindChildTraverse('RDAShopItemButtonLabelGived')){
			pan.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#takeoff')
		}
	}else if(value.status == 'active'){
		if(pan.FindChildTraverse('RDAShopItemButtonActive')){
			pan.FindChildTraverse('RDAShopItemButtonActive').visible = true
		}
		if(pan.FindChildTraverse('RDAShopItemButtonLabelActive')){
			pan.FindChildTraverse('RDAShopItemButtonLabelActive').text = $.Localize('#active')
		}
	}else if(value.status == 'shop_lock'){
		if(pan.FindChildTraverse('RDAShopItemButtonGived')){
			pan.FindChildTraverse('RDAShopItemButtonGived').visible = true
		}
		if(pan.FindChildTraverse('RDAShopItemButtonLabelGived')){
			pan.FindChildTraverse('RDAShopItemButtonLabelGived').text = $.Localize('#shop_lock')
		}
	}else if(value.status == 'shop_select'){
		if(pan.FindChildTraverse('RDAShopItemButtonHas')){
			pan.FindChildTraverse('RDAShopItemButtonHas').visible = true
		}
		if(pan.FindChildTraverse('RDAShopItemButtonLabel')){
			pan.FindChildTraverse('RDAShopItemButtonLabel').text = $.Localize('#shop_select')
		}
	}
	
	if(pan.FindChildTraverse('RDAShopItemButtonHas')){
		pan.FindChildTraverse('RDAShopItemButtonHas').SetPanelEvent("onmouseactivate",give(value.categoryKey, value.productKey, pan, false))
	}
	if(pan.FindChildTraverse('shop_button_price_container_don')){
		pan.FindChildTraverse('shop_button_price_container_don').SetPanelEvent("onmouseactivate",buy(value.categoryKey, value.productKey, pan, false, false))
	}
	if(pan.FindChildTraverse('shop_button_price_container_rp')){
		pan.FindChildTraverse('shop_button_price_container_rp').SetPanelEvent("onmouseactivate",buy(value.categoryKey, value.productKey, pan, false, true))
	}
	
	if(pan.FindChildTraverse('RDAShopItemButtonLabelNotAlign1') && pan.FindChildTraverse('RDAShopItemButtonLabelNotAlign2') 
		&& pan.FindChildTraverse('shop_button_price_container_don') && pan.FindChildTraverse('shop_button_price_container_rp')){
		if(value.price && value.price.don && value.price.rp){
			pan.FindChildTraverse('RDAShopItemButtonLabelNotAlign1').text = value.price.don
			pan.FindChildTraverse('RDAShopItemButtonLabelNotAlign2').text = value.price.rp
			pan.FindChildTraverse('shop_button_price_container_don').AddClass('shop_button_2_params')
			pan.FindChildTraverse('shop_button_price_container_rp').AddClass('shop_button_2_params')
		}else if(value.price.don){
			pan.FindChildTraverse('RDAShopItemButtonLabelNotAlign1').text = value.price.don
			pan.FindChildTraverse('shop_button_price_container_don').AddClass('shop_button_1_params')
			pan.FindChildTraverse('shop_button_price_container_rp').visible = false
		}else if(value.price.rp){
			pan.FindChildTraverse('RDAShopItemButtonLabelNotAlign2').text = value.price.rp
			pan.FindChildTraverse('shop_button_price_container_rp').AddClass('shop_button_1_params')
			pan.FindChildTraverse('shop_button_price_container_don').visible = false
		}
	}

	if(pan.FindChildTraverse('RDAShopItemButtonInTreasuries')){
		if(value.type == "spray" && value.now == 0){
			pan.FindChildTraverse('RDAShopItemButtonInTreasuries').visible = true
		}
	}
	if(pan.FindChildTraverse("RDAShopItemButtonQuickUse")){
		if(value.type == "spray" && value.now > 0){
			pan.FindChildTraverse('RDAShopItemButtonQuickUse').visible = true
			pan.FindChildTraverse("RDAShopItemButtonQuickUse").SetPanelEvent("onactivate", QuickUseSpray(value))
		}
	}
	if(pan.FindChildTraverse("ShopItemCheckBox")){
		pan.FindChildTraverse("ShopItemCheckBox").SetPanelEvent("onmouseover", ()=>{
			pan.FindChildTraverse("ShopItemCheckBox").style.opacity = "1"
		})
		pan.FindChildTraverse("ShopItemCheckBox").SetPanelEvent("onmouseout", ()=>{
			pan.FindChildTraverse("ShopItemCheckBox").style.opacity = "0"
		})
		pan.FindChildTraverse("ShopItemCheckBox").SetPanelEvent("onactivate", SprayToggleActivate(value, pan))
	}	
	
	if(pan.FindChildTraverse('RDAShopItemButtonBuyCon') && pan.FindChildTraverse('RDAShopItemButtonPreview')){
		if(value.type == "treasuries"){
			pan.FindChildTraverse('RDAShopItemButtonPreview').visible = true
			pan.FindChildTraverse('RDAShopItemButtonBuyCon').visible = false
		}
	}

	if( value.image ){
		let img = pan.FindChildTraverse('RDAShopImg')
		img.SetImage('file://{resources}/' + value.image);
		
		if(value.type == "spray"){
			img.SetPanelEvent("onmouseover",SprayOnmouseover(value, pan))
			img.SetPanelEvent("onmouseout",SprayOnmouseout(value, pan))
		}else{
			img.SetPanelEvent("onmouseover",TipsOver2(value.tooltip, img))
			img.SetPanelEvent("onmouseout",TipsOut2())
		}
	}else{
		pan.FindChildTraverse('RDAShopItem').itemname = value.itemname
	}
	
	pan.FindChildTraverse('RDAShopItemLabel').style.color = 'white'
	// name 
	const itemName = value.panorama_name != undefined ? value.panorama_name : value.name
	pan.FindChildTraverse('RDAShopItemLabel').text = $.Localize("#"+itemName)
	if(value.text_color){
		pan.FindChildTraverse('RDAShopItemLabel').style.color = value.text_color;
	}


	if (value.type == "treasuries") {
		const previewPanel = $.CreatePanel("Panel", $("#TreasuresPreviewRoot"), "TreasurePreview_" + value.name);
		previewPanel.BLoadLayoutSnippet("TreasuresPreviewWrap");
		// $.CreatePanelWithProperties(
		// 	`DOTAScenePanel`,
		// 	previewPanel.FindChildTraverse(`PreviewParticleRoot`),
		// 	"",
		// 	{
		// 		style: `width:100%;height:100%;`,
		// 		camera: `camera_immortal`,
		// 		particleonly: `false`,
		// 		map: `collection/spin_glow`,
		// 		hittest: `false`,
		// 	},
		// );
		previewPanel.FindChildTraverse("TreasureName").text = $.Localize("#treasure_preview_header")
			.replace("##treasure##", $.Localize(value.name))
			.toUpperCase();
		previewPanel.FindChildTraverse("TreasureImagePreview").SetImage("file://{resources}/"+value.image);
		const openTreasureButton = previewPanel.FindChildTraverse("Preview_OpenTreasure");
		const cancelTreasureButton = previewPanel.FindChildTraverse("Preview_Cancel");
		const cancelTreasureButton2 = previewPanel.FindChildTraverse("CloseTreasuresPreviewWrap");

		openTreasureButton.SetPanelEvent("onactivate", () => {
			previewPanel.SetHasClass("show", false);
			treasuresPreviewRoot.SetHasClass("show", false);
			OpenTreasure(value.categoryKey, value.productKey);
		});
		cancelTreasureButton.SetPanelEvent("onactivate", () => {
			previewPanel.SetHasClass("show", false);
			treasuresPreviewRoot.SetHasClass("show", false);
			lastPreviewPanel = "";
		});
		cancelTreasureButton2.SetPanelEvent("onactivate", () => {
			previewPanel.SetHasClass("show", false);
			treasuresPreviewRoot.SetHasClass("show", false);
			lastPreviewPanel = "";
		});
		cancelTreasureButton2.SetPanelEvent("onmouseover", TipsOver2('close', cancelTreasureButton2));
		cancelTreasureButton2.SetPanelEvent("onmouseover", TipsOut2());
		
		pan.FindChildTraverse("RDAShopItemButtonPreview").SetPanelEvent("onactivate", () => {
			OpenTreasurePreview(value.categoryKey, value.productKey);
		});
	} else if (value.source != undefined && value.Blocked == undefined) {
		const itemInPreview = $.CreatePanel(
			"Panel",
			$("#TreasurePreview_" + value.source.treasury).FindChildTraverse("ItemsPreviewList"),
			"ItemPreview_" + value.name,
		);
		// itemInPreview.AddClass("BW");
		itemInPreview.BLoadLayoutSnippet("ItemCHC");
		const itemImagePreview = itemInPreview.FindChildTraverse("ItemImage");
		itemImagePreview.SetImage("file://{resources}/"+value.image);
		itemInPreview.FindChildTraverse("ItemActionButton").visible = false;
		itemInPreview.AddClass("immortal");
		for(let categoryKey in shopinfo){
			for(let productKey in shopinfo[categoryKey]){
				if(shopinfo[categoryKey][productKey].name == value.source.treasury){
					pan.FindChildTraverse('RDAShopItemButtonInTreasuries').SetPanelEvent("onactivate", ()=>{
						OpenTreasurePreview(categoryKey, productKey);
					})
				}
			}
		}
	}
}












function initShop(tab){
	shopinfo = tab
	// деньги
	if($('#RDAMoneyLabel')){
		$('#RDAMoneyLabel').text = shopinfo.coins
		$('#MMMRPointsLabel').text = shopinfo.mmrpoints
	}

	const CreateTabButton = (key, value)=>{
		if($("#RDAShopTabsPanel")){
			let TabPanel = $.CreatePanel("Panel", $("#RDAShopTabsPanel"), "TabPanel_" + key);
			TabPanel.AddClass("TabPanel")
			TabPanel.AddClass("TabPanelOnServ")
			TabPanel.AddClass("TabLabelOnServ")
			TabPanel.AddClass("tab-normal-style")
			TabPanel.SetPanelEvent("onmouseactivate",opn(key));
			let TabLabelImg = $.CreatePanel("Image", TabPanel, "TabLabelImg_" + key);
			TabLabelImg.AddClass("TabLabelImg")
			var TabPanelLabel = $.CreatePanel("Label", TabPanel, "TabLabel_" + key);
			TabPanelLabel.AddClass("TabLabel")
			TabPanelLabel.text = $.Localize("#"+value.name)
			if(value.name == "gems"){
				TabPanel.visible = false
			}
		}
		if($("#RDAShopContentPanel")){
			TabContent = $.CreatePanel("Panel", $("#RDAShopContentPanel"), "RDAShopContentPanel_" + key);
			TabContent.AddClass("TabContent")
			TabContent.visible = false
		}
	}

	for(let i = 1; i <= tableLength; i++){
		if(tab[i].name == "pets") continue
		CreateTabButton(i, tab[i])
	}
	const CreateProducts = (i)=>{
		if(tab[i].name == "pets") return
		for (const [key, value] of Object.entries(tab[i])) {
			if(typeof(value) != 'object') continue
			value.categoryKey = i
			value.productKey = key
			if($("#RDAShopContentPanel_" + value.categoryKey)){
				CreateItem(value, $("#RDAShopContentPanel_" + value.categoryKey), "ShopItem" + value.categoryKey + '_' + value.productKey)
			}
		}
	}

	for(var i = 1; i <= tableLength; i++){
		if(tab[i].name != "treasuries") continue
		CreateProducts(i)
		break
	}
	for(var i = 1; i <= tableLength; i++){
		if(tab[i].name == "treasuries") continue
		CreateProducts(i)
	}

	// ---------------- НЕ ЕБУ КАК ЭТО РАБОТАЕТ, НО ОНО РАБОТАЕТ
	// ---------------- Открытие первой вкладки магазина по умолчанию
	for(var i = 1; i <= tableLength; i++){
		if(typeof(shopinfo[i] == 'object')){
			if($('#TabPanel_' + i)){
				$('#TabPanel_' + i).AddClass('TabPanelOnServ')
				$('#TabLabel_' + i).AddClass('TabLabelOnServ')
				$('#TabLabel_' + i).AddClass('tab-normal-style')
			}
			if($("#RDAShopContentPanel_" + i)){
				$("#RDAShopContentPanel_" + i).visible = false
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
	// -------------------------------------------------------------
	$.Schedule(0.5, function(){
		if($('#logotext1shop'))
			$('#logotext1shop').text = rating[LocalPlayer].points
		if($('#logotext2shop'))
			$('#logotext2shop').text = rating[LocalPlayer].games
		if($('#logotext3shop'))
			$('#logotext3shop').text = rating[LocalPlayer].likes
	})
}

function UpdateStore(tab){
	const Update = (itemInfo, pan)=>{
		$.Msg(shopinfo[itemInfo.categoryKey][itemInfo.productKey].name)
		if(!pan) return
		if(pan.FindChildTraverse("RDAShopItemButtonLabelStock")){ 
			pan.FindChildTraverse("RDAShopItemButtonLabelStock").text = shopinfo[itemInfo.categoryKey][itemInfo.productKey].now
		}
		if(pan.FindChildTraverse("RDAShopItemButtonQuickUse")){
			if(shopinfo[itemInfo.categoryKey][itemInfo.productKey].type == "spray" && shopinfo[itemInfo.categoryKey][itemInfo.productKey].now > 0){
				pan.FindChildTraverse('RDAShopItemButtonQuickUse').visible = true
				pan.FindChildTraverse("RDAShopItemButtonQuickUse").SetPanelEvent("onactivate", QuickUseSpray(shopinfo[itemInfo.categoryKey][itemInfo.productKey]))
			}
		}
		if(shopinfo[itemInfo.categoryKey][itemInfo.productKey].name == "other_1" || shopinfo[itemInfo.categoryKey][itemInfo.productKey].name == "other_2" || shopinfo[itemInfo.categoryKey][itemInfo.productKey].name == "other_3" || shopinfo[itemInfo.categoryKey][itemInfo.productKey].name == "other_4" && shopinfo[itemInfo.categoryKey][itemInfo.productKey].onStart == 0 && shopinfo[itemInfo.categoryKey][itemInfo.productKey].now == 1){
			if(pan.FindChildTraverse('RDAShopItemButtonBuy')){
				pan.FindChildTraverse('RDAShopItemButtonBuy').visible = false
			}
			if(pan.FindChildTraverse('RDAShopItemButtonHas')){
				pan.FindChildTraverse('RDAShopItemButtonHas').visible = true
			}
		}
	}
	for(let i in tab){
		const itemInfo = tab[i]
		const pan = $("#ShopItem" + itemInfo.categoryKey + '_' + itemInfo.productKey)
		const inventory = $("#ShopItem_Inventory" + itemInfo.categoryKey + '_' + itemInfo.productKey)
		if(!shopinfo || !itemInfo.categoryKey || !shopinfo[itemInfo.categoryKey] || !itemInfo.productKey || !shopinfo[itemInfo.categoryKey][itemInfo.productKey]) continue
		shopinfo[itemInfo.categoryKey][itemInfo.productKey].now = Number(itemInfo.count)
		Update(itemInfo, pan)
		Update(itemInfo, inventory)
	}
}

// function SetShopItemCount(t){
// 	const categoryKey = t.categoryKey
// 	const itemKey = t.itemKey
// 	const count = t.count
// 	if(!shopinfo || categoryKey || !shopinfo[categoryKey] || itemKey || shopinfo[categoryKey][itemKey])return
// 	shopinfo[categoryKey][itemKey].now = Number(count)
// 	const pan = $("#ShopItem" + categoryKey + '_' + itemKey)
// 	if(pan){ 
// 		pan.FindChildTraverse("RDAShopItemButtonLabelStock").text = count
// 	}
// }





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


function updateRatingCouter(t){
    t.a = Number(t.a);
    if($('#rating_zar') != null && $('#rating_nadez') != null && $('#rating_doom') != null && $('#rating_your_mmr') != null && $('#rating_info_panel_img') != null){
        
            $('#rating_zar').text = t.a
            $('#rating_nadez').text = t.b
            $('#rating_doom').text = t.c

        $('#rating_your_mmr').text = rating[LocalPlayer].points
        $('#rating_info_panel_img').SetImage('file://{resources}/images/custom_game/ranks/' + rank(rating[LocalPlayer].points) + '.png')
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


function shopinfoed(table_name, key, data){
    if(key == Players.GetLocalPlayer() && shopinfo != null){
		if(shopinfo.coins)
			shopinfo.coins = data["coins"]
		if(shopinfo.mmrpoints)
			shopinfo.mmrpoints = data["mmrpoints"]
		if($('#RDAMoneyLabel'))
        	$('#RDAMoneyLabel').text = shopinfo.coins
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

function ReceivingRPAlert(t){
	Game.EmitSound("Quickbuy.Confirmation");
	const Panel = $("#ReceivingRPNotification_Panel")
	Panel.GetChild(0).text = `+${t.value}`
	Panel.visible = true
	$.Schedule(5,()=>{
		Panel.visible = false
	})
}

function ReceivingCoinsAlert(t){
	Game.EmitSound("Quickbuy.Confirmation");
	const Panel = $("#ReceivingCoinsNotification_Panel")
	Panel.GetChild(0).text = `+${t.value}`
	Panel.visible = true
	$.Schedule(5,()=>{
		Panel.visible = false
	})
}

function FindChildTraverse(name){
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(name)
}

(function(){
	GameEvents.Subscribe( "Noti", Noti)
	GameEvents.Subscribe( "UpdateStore", UpdateStore)
	// GameEvents.Subscribe( "SetShopItemCount", SetShopItemCount)
	GameEvents.Subscribe( "initRating", initRating)
	GameEvents.Subscribe( "initShop", initShop)
	GameEvents.Subscribe( "updateRatingCouter", updateRatingCouter)
	GameEvents.Subscribe( "update_gems_js", update_gems_js)
	GameEvents.Subscribe( "change_pet", change_pet)
	GameEvents.Subscribe( "ReceivingRPAlert", ReceivingRPAlert)
	GameEvents.Subscribe( "ReceivingCoinsAlert", ReceivingCoinsAlert)
	if($("#ReceivingRPNotification_Panel") && $("#ReceivingCoinsNotification_Panel")){
		$("#ReceivingRPNotification_Panel").visible = false
		$("#ReceivingCoinsNotification_Panel").visible = false
	}
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
		topBar.style.height = "55px";
	let btn1 = FindChildTraverse("DashboardButton")
	if(btn1){
		btn1.style.height = "55px";
		btn1.style.width = "55px";	
	}
	let btn2 = FindChildTraverse("SettingsButton")
	if(btn2){
		btn2.style.height = "55px";
		btn2.style.width = "55px";
		btn2.style.backgroundSize = "55px"
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

(()=>{
    $.RegisterForUnhandledEvent('Cancelled',() => {
        closeRaiting()
		closeShop()
    })
})();










var DotaHUD = GameUI.CustomUIConfig().DotaHUD;


function OnMouseEvent(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
        let ratingPanel = $("#RatingPanel")
		if(ratingPanel){
			let cursorPos = GameUI.GetCursorPosition();
			let panelPos = ratingPanel.GetPositionWithinWindow();
			let width = Number(ratingPanel.actuallayoutwidth)
			let height = Number(ratingPanel.actuallayoutheight)
			if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
			{
				closeRaiting()
			}
		}
		let shopPanel = $("#RDAShopPanel")
		if(shopPanel){
			let cursorPos = GameUI.GetCursorPosition();
			let panelPos = shopPanel.GetPositionWithinWindow();
			let width = Number(shopPanel.actuallayoutwidth)
			let height = Number(shopPanel.actuallayoutheight)
			if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
			{
				closeShop()
			}
		}
    }
}

(function() {
    // Update();
    DotaHUD.ListenToMouseEvent(OnMouseEvent);
})();