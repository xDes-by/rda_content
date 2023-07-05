var heroes = {}

function UpdateChangeHeresInfo(t){
	heroes = t
}

function ActivateAura(t){
	open_quest_window(t)
}
function DeactivateAura(){
	hide_change()
}

var ChangeHeroEventButton = (function(heroData){
	return function(){
		if(heroData.available[playerID]){
			hide_change()
			GameEvents.SendCustomGameEventToServer("ChangeHeroLua", {heroName : heroData['heroName']})
		}
	}
})
function hide_change(){
	if($("#ChangeHeroMainPanel")){
		$('#ChangeHeroMainPanel').RemoveClass('show_change')
		$('#ChangeHeroMainPanel').AddClass('hide_change')
		Game.EmitSound("ui_team_select_shuffle")
		$.Schedule(0.3, function(){
			$('#ChangeHeroMainPanel').RemoveClass('hide_change')
			$("#ChangeHeroMainPanel").visible = false
		})
	}
}
function ShowPanel(heroData){
    if($("#ChangeHero_Text_2")){
        $("#ChangeHero_Text_2").text = $.Localize("#"+heroData['heroName'])
    }
    $("#ChangeHero_Text_6").text = $.Localize("#character_change_condition_1").replace("##count##", heroData['minimumTotal']).replace("##countmonth##",heroData['minimumOneTimeDon'])
    if(heroData['trialCount'][playerID] < 0){
        $("#ChangeHero_Text_10").visible = false
    }else{
        $("#ChangeHero_Text_10").text = $.Localize("#quest_trial_period").replace("##count##", heroData['trialCount'][playerID])
        $("#ChangeHero_Text_10").visible = true
    }
    
    
    if($("#ChangeHeroButtonText")){
        if(heroData['selected'][playerID]){
            $("#ChangeHeroButtonText").text = $.Localize("#character_change_selected")
        }else if(heroData['available'][playerID]){
            $("#ChangeHeroButtonText").text = $.Localize("#character_change_can_select")
        }else{
            $("#ChangeHeroButtonText").text = $.Localize("#character_change_not_available")
        }
        if($("#ChangeHeroButtonPanel")){
            $("#ChangeHeroButtonPanel").SetPanelEvent("onmouseactivate",ChangeHeroEventButton(heroData));
        }
    }
    if($("#ChangeHeroMainPanel")){
        $('#ChangeHeroMainPanel').RemoveClass('hide_change');
        $('#ChangeHeroMainPanel').AddClass('show_change');
        $("#ChangeHeroMainPanel").visible = true
    }
}

function open_quest_window(index){
    var unit = Players.GetLocalPlayerPortraitUnit(),
		vecunit = Entities.GetAbsOrigin(unit),
		hero = Players.GetPlayerHeroEntityIndex(playerID),
		vechero = Entities.GetAbsOrigin(hero),
		length = Game.Length2D(vecunit,vechero)

	if(index.index){
		unit = Number(index.index)
		vecunit = Entities.GetAbsOrigin(unit)
	}
	if(unit != hero){
        for (var key in heroes) {
            if(heroes[key]['unitIndex'] == unit){
                GameUI.SelectUnit(unit, false)
                if(length < 350){
                    ShowPanel(heroes[key])
                }
            }
        }
	}
}

(()=>{
    GameEvents.Subscribe( "UpdateChangeHeresInfo", UpdateChangeHeresInfo)
    GameEvents.Subscribe("dota_player_update_query_unit", open_quest_window);
	GameEvents.Subscribe("ActivateQuestAura",ActivateAura)
	GameEvents.Subscribe("DeactivateQuestAura",DeactivateAura)
	GameEvents.Subscribe('open_quest_window', open_quest_window);
})();