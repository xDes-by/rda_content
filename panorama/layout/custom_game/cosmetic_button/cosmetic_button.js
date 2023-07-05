var can_use_spray = true;
var can_use_highfive = true;
var can_use_pet = true;
var playerID = Players.GetLocalPlayer()

function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

var TipsOver = (function(message, pos)
{
	return function()
	{
        $.DispatchEvent( "DOTAShowTextTooltip", pos, $.Localize("#"+message));
	}
});

var TipsOut = (function()
{
	return function()
	{
        $.DispatchEvent( "DOTAHideTitleTextTooltip");
        $.DispatchEvent( "DOTAHideTextTooltip");
	}
});

function OnClickSpray(t) {
	if (t == "spray"){
		if(can_use_spray) {
			GameEvents.SendCustomGameEventToServer( "CastSpray", {} )
			timer(15)	
		}
		can_use_spray = false
	}else if(t == "highfive"){
		if(can_use_highfive) {
			GameEvents.SendCustomGameEventToServer( "HighFive", {} )
			timer2(15)	
		}
		can_use_highfive = false
	}else if(t == "pet" && Entities.IsAlive( Players.GetPlayerHeroEntityIndex( playerID ) )){
		var spray = CustomNetTables.GetTableValue( "player_pets", playerID);
		if (spray != null){
			if(can_use_pet) {
					GameEvents.SendCustomGameEventToServer( "UsePet", {} )
					timer3(2)	
				}
			can_use_pet = false
		}	
	}
}




function UpdatePetIcon(){
	// Game.CreateCustomKeyBind(keybind_courier, "UsePet");
	// var button_text = FindDotaHudElement("CosmeticAbility_text2");
	// button_text.text = keybind_courier
	
	var spray = CustomNetTables.GetTableValue( "player_pets", playerID);
	const spray_icon = FindDotaHudElement("CustomAbility_pet_custom");
	spray_icon
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/pet_buttons/"+spray.pet+".png" );
}

function timer(i) {
	var pan = FindDotaHudElement("CustomAbility_spray_custom");
	text_timer = pan.FindChildTraverse("CosmeticAbility_text")
		if (i > 0) {
			text_timer.text = (i - 1)
		}
		if (i == 0 ) {
			text_timer.text = ""
			can_use_spray = true
			return	
		}
		 i--;
    $.Schedule(1, function() {
        timer(i)
    });
}

function timer2(i) {
	var pan = FindDotaHudElement("CustomAbility_highfive_custom");
	text_timer = pan.FindChildTraverse("CosmeticAbility_text")
		if (i > 0) {
			text_timer.text = (i - 1)
		}
		if (i == 0 ) {
			text_timer.text = ""
			can_use_highfive = true
			return	
		}
		 i--;
    $.Schedule(1, function() {
        timer2(i)
    });
}

function timer3(i) {
	var pan = FindDotaHudElement("CustomAbility_pet_custom");
	text_timer = pan.FindChildTraverse("CosmeticAbility_text");
	if (i > 0) {
		text_timer.text = i
	}
	if (i == 0 ) {
		text_timer.text = ""
		can_use_pet = true
		return	
	}
    $.Schedule(0.1, function() {
        timer3((i-0.1).toFixed(1))
    });
}

function CtrlButton(){
	if(!GameUI.IsControlDown()){
		CtrlDown = false
		return
	}
	if(CtrlDown) return
	CtrlDown = true
	OnClickSpray( 'pet' )
}

function CtrlTimer(){
	CtrlButton()
	$.Schedule(0.1, CtrlTimer);
}

(function () {
	$.Msg("cosmetic_button")
	const centerBlock = FindDotaHudElement("center_block");
	let cosmetics = centerBlock.FindChildTraverse("BarOverItems");

	if (cosmetics) {
		cosmetics.DeleteAsync(0);
	}

	
	
	// const ability = $.CreatePanel("Button", FindDotaHudElement("BarOverItems"), "CustomAbility_highfive_custom");
	// ability.BLoadLayoutSnippet("CosmeticAbility2");
	
	const ability2 = $.CreatePanel("Button", FindDotaHudElement("BarOverItems"), "CustomAbility_spray_custom");
	ability2.BLoadLayoutSnippet("CosmeticAbility");

	const ability3 = $.CreatePanel("Button", FindDotaHudElement("BarOverItems"), "CustomAbility_pet_custom");
	ability3.BLoadLayoutSnippet("CosmeticAbility3");

	if (!cosmetics) {
		$("#BarOverItems").SetParent(centerBlock);
	}

	// const highfive = FindDotaHudElement("CustomAbility_highfive_custom");
	// highfive
	// 	.FindChildTraverse("CosmeticAbilityImage")
	// 	.SetImage( "file://{images}/custom_game/highfive_png.png" );
	// FindDotaHudElement("BuffContainer").style.marginBottom = "43px;";

	const spray = FindDotaHudElement("CustomAbility_spray_custom");
	spray
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/spray_no_empty_png.png" );
	FindDotaHudElement("BuffContainer").style.marginBottom = "43px;";

	const pet = FindDotaHudElement("CustomAbility_pet_custom");
	pet
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/spray_no_empty.png" );
	FindDotaHudElement("BuffContainer").style.marginBottom = "43px;";
	pet.SetPanelEvent("onmouseover", TipsOver("CustomAbility_pet_custom_tooltip", pet))
	pet.SetPanelEvent("onmouseout", TipsOut())

	const makeid = function(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		  counter += 1;
		}
		return result;
	}
	// let bind_1 = "bind1_"+makeid(10)
	// Game.CreateCustomKeyBind('Z', bind_1);
	// Game.AddCommand( bind_1, ()=>{ if(GameUI.IsControlDown())OnClickSpray( 'highfive' ) }, "", 0 );
	// let bind_2 = "bind2_"+makeid(10)
	// Game.CreateCustomKeyBind('X', bind_2);
	// Game.AddCommand( bind_2, ()=>{ if(GameUI.IsControlDown())OnClickSpray( 'spray' ) }, "", 0 );
	var keybind_courier = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT)
	let bind_3 = "bind3_"+makeid(10)
	Game.CreateCustomKeyBind(keybind_courier, bind_3);
	Game.AddCommand( bind_3, ()=>{ OnClickSpray( 'pet' ) }, "", 0 );
	var button_text = pet.FindChildTraverse("CosmeticAbility_text2");
	button_text.text = keybind_courier
	GameEvents.Subscribe('UpdatePetIcon', UpdatePetIcon);
	CtrlTimer()
})();


