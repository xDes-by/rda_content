/*
var GridCategories = FindDotaHudElement('GridCategories');

var imbalist = {
	"alchemist" : false,
	"axe" : true,
	"bristleback" : false,
	"centaur" : true,
	"legion_commander" : true,
	"mars" : true,
	"sand_king" : true,
	"slardar" : false,
	"sven" : true,
	"tidehunter" : false,
	"tiny" : false,
	"skeleton_king" : true,
	"wisp" : true,
	
	"arc_warden" : true,
	"drow_ranger" : true,
	"gyrocopter" : false,
	"juggernaut" : true,
	"luna" : false,
	"medusa" : false,
	"naga_siren" : true,
	"phantom_assassin" : true,
	"riki" : true,
	"sniper" : true,
	"troll_warlord" : false,
	"viper" : false,
	
	"lina" : true,
	"dazzle" : true,
	"disruptor" : false,
	"enchantress" : true,
	"jakiro" : true,
	"leshrac" : false,
	"lion" : true,
	"ogre_magi" : false,
	"pugna" : true,
	"shadow_shaman" : false,
	"windrunner" : false,
	"zuus" : true,
	"nevermore" : true,
	"tinker" : true
};
var lockedHeros = {
	"nevermore" : true,
	"SHADOW FIEND" : true,
	"slark" : true,
	"SLARK" : true,
	"tinker" : true,
	"TINKER" : true,
	"treant" : true,
	"TREANT PROTECTOR" : true
}

//	$.Msg(herolist.customlist)
//	$.Msg(GridCategories)

function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

function InitHeroSelection()  {
//	$.Msg(GridCategories.GetChildCount())
	

	var i = 0;

	while (i < GridCategories.GetChildCount()) {
//		$.Msg(GridCategories.GetChild(i))
//		$.Msg(GridCategories.GetChild(i).FindChildTraverse("HeroList"))
//		$.Msg(GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChildCount())

		for (var j = 0; j < GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChildCount(); j++) {
			if (GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChild(j)) {
				var hero_panel = GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChild(j).GetChild(0).GetChild(0);
				if (imbalist[hero_panel.heroname]) {
					//hero_panel.GetParent().AddClass("IMBA_HeroCard");
					hero_panel.GetParent().style.boxShadow = "gold 0px 0px 3px 0px";
				}
				if(lockedHeros[hero_panel.heroname]){
					var iconbg = $.CreatePanel("Panel", hero_panel,"lockbg")
					iconbg.style.width = "100%";
					iconbg.style.height = "100%";
					iconbg.style.backgroundColor = "rgba(0, 0, 0, .5)";
					

					
					var lockicon = $.CreatePanel("Panel", hero_panel.GetParent(),"lockicon")
					lockicon.style.width = "100px";
					lockicon.style.height = "50px";
					lockicon.style.verticalAlign = "center";
					lockicon.style.horizontalAlign = "center";
					lockicon.style.backgroundImage = "url('file://{resources}/images/custom_game/lock.png')";
					lockicon.style.backgroundSize = "100% 100%";
				}
				//$.Msg(hero_panel.heroname)
			}
		}

		i++;
	}
	for (var i = 0; i < FindDotaHudElement('BattlePassHeroData').GetChildCount(); i++) {
		FindDotaHudElement('BattlePassHeroData').GetChild(i).visible = false;
	}
	FindDotaHudElement('RandomButton').visible = false;
	FindDotaHudElement('BattlePassHeroData').style.backgroundColor = "gradient( linear, 0% 0%, 0% 100%, from( #6d72a8 ), color-stop( 0.5, #141b21), to( #141b21) )";
	FindDotaHudElement('BattlePassHeroData').style.borderTop = "2px solid #502b6e";

	var text_1 = $.CreatePanel("Label", FindDotaHudElement('BattlePassHeroData'),"");
	text_1.text = "Этого героя можно купить за донат или внутри игровую валюту";
	text_1.style.color = "red";
	text_1.style.fontSize = "21px";
	text_1.style.padding = "5px";
	text_1.style.textShadow = "2px 2px 8px 3.0 #000000";
}


function clickHero(){
	$.Msg(FindDotaHudElement('HeroInspectHeroName').text)
	
	FindDotaHudElement('RandomButton').visible = false;
	if(lockedHeros[FindDotaHudElement('HeroInspectHeroName').text]){
		FindDotaHudElement('LockInButton').hittest = false;
		FindDotaHudElement('LockInButton').hittestchildren = false;
		FindDotaHudElement('FriendsAndFoes').style.visibility = "visible";
		
	}else{
		FindDotaHudElement('LockInButton').hittest = true;
		FindDotaHudElement('LockInButton').hittestchildren = true;
		FindDotaHudElement('FriendsAndFoes').style.visibility = "collapse";
	}
}

function stop(){
		FindDotaHudElement('LockInButton').hittest = false;
		FindDotaHudElement('LockInButton').hittestchildren = false;
		FindDotaHudElement('FriendsAndFoes').style.visibility = "visible";
}

function hideEnemyTeamTopBar(){
	DireTeamPlayers = FindDotaHudElement("DireTeamPlayers")
	RadiantTeamPlayers = FindDotaHudElement("RadiantTeamPlayers")
	//DireTeamPlayers.style.visibility = "collapse";
	
	DireTeamPlayers.visible = true;
	//RadiantTeamPlayers.style.position = "200px 0 0";
	//RadiantTeamPlayers.style.position = "200px 0 0";
}
function unlock(t){
	if(t['other_5']['now'] > 0){
		lockedHeros['nevermore'] = false;
		lockedHeros['SHADOW FIEND'] = false;
	}
	if(t['other_6']['now'] > 0){
		lockedHeros['tinker'] = false;
		lockedHeros['TINKER'] = false;
	}
	if(t['other_7']['now'] > 0){
		lockedHeros['treant'] = false;
		lockedHeros['TREANT PROTECTOR'] = false;
	}
}
*/
const GridCategories = FindDotaHudElement('GridCategories');
var HeroPanels = {};


function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}


function HideAll(){
	var i = 0;
	while (i < GridCategories.GetChildCount()) {
		for (var j = 0; j < GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChildCount(); j++) {
			if (GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChild(j)) {
				var hero_panel = GridCategories.GetChild(i).FindChildTraverse("HeroList").GetChild(j);
				var hero_name = "npc_dota_hero_" + hero_panel.GetChild(0).GetChild(0).heroname;
				HeroPanels[hero_name] = hero_panel;
				hero_panel.visible = false;
			}
		}
		i++;
	}
	$.Msg(HeroPanels);
	GameEvents.SendCustomGameEventToServer("LoadHeroListReady", {})
}

function LoadHeroList(tab){
	$.Msg("LoadHeroList");
	$.Msg(tab);
	for (const [key, value] of Object.entries(tab)) {
		if(value == 1){
			HeroPanels[key].visible = true;
		}
	}
}


(function() {
	var PreGame = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("PreGame")
	PreGame.style.opacity = "1";
	PreGame.style.transitionDuration = "0.0s";
	$.Schedule(0.5,HideAll);
	
	GameEvents.Subscribe('LoadHeroList', LoadHeroList);
})();
/*
(function() {
	
	
	
	GameEvents.Subscribe('unlock_pick_heres', unlock);
	GameEvents.Subscribe('InitHeroSelection', InitHeroSelection);
	FindDotaHudElement('DireTeamPlayers').visible = false
	$.Schedule(0, stop); 
	$.Schedule(1.0, InitHeroSelection); 
	$.Schedule(1.0, hideEnemyTeamTopBar);
})();
*/