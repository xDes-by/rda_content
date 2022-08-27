var GridCategories = FindDotaHudElement('GridCategories');

var imbalist = {
	"axe" : false,
	"bristleback" : false,
	"centaur" : false,
	"mars" : false,
	"sand_king" : false,
	"sven" : false,
	"skeleton_king" : false,
	"wisp" : false,
	"dragon_knight" : false,
	"treant" : false,
	
	"arc_warden" : false,
	"drow_ranger" : false,
	"juggernaut" : false,
	"luna" : false,
	"phantom_assassin" : false,
	"sniper" : false,
	"terrorblade" : false,
	"spectre" : false,
	"slark" : false,
	"nevermore" : false,
	"slark" : false,
	"medusa" : false,
	"legion commander" : false,
	"skywrath mage" : false,
	
	
	"lina" : false,
	"dazzle" : false,
	"enchantress" : false,
	"lion" : false,
	"pugna" : false,
	"shadow_shaman" : false,
	"windrunner" : false,
	"zuus" : false,
	"warlock" : false,
	"tinker" : false
};
var lockedHeros = {
	"nevermore" : false,
	"SHADOW FIEND" : false,	
	"SLARK" : false,
	"tinker" : false,
	"TINKER" : false,
	"treant" : false,
	"TREANT PROTECTOR" : false
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
				//$.Msg(hero_panel.heroname)
			}
		}

		i++;
	}
}


function clickHero(){
	$.Msg(FindDotaHudElement('HeroInspectHeroName').text)
	
	for(let i = 0; i < FindDotaHudElement("HeroAbilities").GetChildCount();i++){
		if(FindDotaHudElement("HeroAbilities").GetChild(i).BHasClass("StatBranch")){
			FindDotaHudElement("HeroAbilities").GetChild(i).visible = false
		}
		if(FindDotaHudElement("HeroAbilities").GetChild(i).BHasClass("ScepterDetails")){
			FindDotaHudElement("HeroAbilities").GetChild(i).visible = false
		}
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


(function() {
	var PreGame = $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse("PreGame")
	PreGame.style.opacity = "1";
	PreGame.style.transitionDuration = "0.0s";
	GameEvents.Subscribe('dota_player_hero_selection_dirty', clickHero);
	GameEvents.Subscribe('unlock_pick_heres', unlock);
	GameEvents.Subscribe('InitHeroSelection', InitHeroSelection);
	$.Schedule(1.0, InitHeroSelection); 
	$.Schedule(1.0, hideEnemyTeamTopBar);
})();


FindDotaHudElement("RadiantTeamPlayers").GetChild(0).FindChildTraverse("LaneSelection").style.opacity = "1"


var pickInit = false

function s(){
	GameEvents.SendCustomGameEventToServer("pickInit", {})
	$.Msg("12113")
	if(pickInit == false){
		$.Schedule(1, ()=>[
			s()
		])
	}
}
GameEvents.Subscribe( "pickRating", function(t){
	pickInit = true
	for(let i in t.rating){
		$.CreatePanelWithProperties("Label", FindDotaHudElement("RadiantTeamPlayers").GetChild(i-1), "", {text:$.Localize("#pick_rating")+t.rating[i].points, style:"width:100%;text-align:center;margin-top:105px;color:white;"})
		$.CreatePanelWithProperties("Label", FindDotaHudElement("RadiantTeamPlayers").GetChild(i-1), "", {text:$.Localize("#pick_game")+t.rating[i].games, style:"width:100%;text-align:center;margin-top:125px;color:white;"})
	}
})