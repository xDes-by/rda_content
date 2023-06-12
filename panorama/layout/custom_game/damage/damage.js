function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}


function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

function dmgtable(t) {
    $("#heroinfo").RemoveAndDeleteChildren()
    for(var k in t){
        var pan=$.CreatePanel("Panel",$("#heroinfo"),'hero_'+k)
        pan.BLoadLayoutSnippet('heroinfo')
        if(t[k].heal)
            pan.FindChildTraverse('heal').text =  numberWithSpaces(t[k].heal.toFixed(0))
        if(t[k].dmg)
            pan.FindChildTraverse('dmg').text = numberWithSpaces(t[k].dmg.toFixed(0))
		if(t[k].mag)
            pan.FindChildTraverse('mag').text = numberWithSpaces(t[k].mag.toFixed(0))
		if(t[k].pure)
            pan.FindChildTraverse('pure').text = numberWithSpaces(t[k].pure.toFixed(0))
        if(t[k].tank)
            pan.FindChildTraverse('tank').text = numberWithSpaces(t[k].tank.toFixed(0))
        pan.FindChildTraverse('heroname').text =  $.Localize("#"+Entities.GetUnitName(parseInt(k)))
		
    }
    Game.myDmgTable = t	

}

function showEndScreen(get) {
    if(Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME){
        $("#victoryText").text = Game.GetGameWinner()==Players.GetTeam(Game.GetLocalPlayerID())?"VICTORY":"DEFEAT"
    }else{
        $("#victoryText").text = get.game_reuslt == "win"?"VICTORY":"DEFEAT"
    }
    $("#victoryText").SetHasClass("red", Game.GetGameWinner()!=Players.GetTeam(Game.GetLocalPlayerID()))
    let t = Game.myDmgTable;
    for (var k in t) {
        var pan=$.CreatePanel("Panel",$("#players"),'hero_'+k)
        let ply = Entities.GetPlayerOwnerID(parseInt(k))
        pan.BLoadLayoutSnippet('playerrow')
        pan.FindChildTraverse("playerAvatar").steamid = Game.GetPlayerInfo(ply).player_steamid
        pan.FindChildTraverse("heronameboard").text = `${$.Localize("#"+Entities.GetUnitName(parseInt(k)))} ${Entities.GetLevel(parseInt(k))} lvl`
        if(t[k].heal)
            pan.FindChildTraverse('healboard').text =  numberWithSpaces(t[k].heal.toFixed(0))
        if(t[k].dmg)
            pan.FindChildTraverse('dmgboard').text = numberWithSpaces(t[k].dmg.toFixed(0))
        if(t[k].mag)
            pan.FindChildTraverse('magboard').text = numberWithSpaces(t[k].mag.toFixed(0))
        if(t[k].pure)
            pan.FindChildTraverse('pureboard').text = numberWithSpaces(t[k].pure.toFixed(0))
        if(t[k].tank)
            pan.FindChildTraverse('takenboard').text = numberWithSpaces(t[k].tank.toFixed(0))
        if(t[k].invo)
            pan.FindChildTraverse('invokerdamageboard').text = numberWithSpaces(t[k].invo.toFixed(0))
        for (var i = 0; 6>i; i++) {
            pan.FindChildTraverse(`slot${i}`).itemname = Abilities.GetAbilityName(Entities.GetItemInSlot(parseInt(k), i))
        }
    }
    $("#endboardContainer").visible = true
}

var open = false;
var state = false;

function ShowDamage()
{
	state = true
	if(open == true){
		close2()
		return
	}else{
		open1()
	}
}

function open1()
{
	$.Msg("open")
	Game.EmitSound('ui_team_select_shuffle')
	open = true;
	$("#heroinfo").style['position'] = "0% 0px 0px";
	$("#heroinfo").visible = true
}

function close2()
{
	$.Msg("close")
	Game.EmitSound('ui_team_select_shuffle')
	open = false;
	$("#heroinfo").style['position'] = "140px 0px 0px";
	$.Schedule(0.2, function(){
		$("#heroinfo").visible = false
	})	
}

function ContinueButton(){
    $("#endboardContainer").visible = false
}

function ExitButton(){
    GameEvents.SendCustomGameEventToServer ("EndScreenExit",{})
}


function ban()
{
	$.Msg("BAN")
	$("#ban").visible = true
}

(function() {
    if(Game.GetState() == DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME)
        return;
    if($("#ban"))
        $("#ban").visible = false
    if($("#endboardContainer"))
        $("#endboardContainer").visible = false
    GameEvents.Subscribe("dmgtable",dmgtable)
    GameEvents.SendCustomGameEventToServer ("startreq",{})
	GameEvents.Subscribe("ban",ban)
	GameEvents.Subscribe("showEndScreen",showEndScreen)
    $("#hpbarroot").visible = false
    $("#heroinfo").visible = false
})()

