var can_use = true;
var playerID = Players.GetLocalPlayer()

function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

///////////////////////////////////////////////

const commandf7 = `On${"F7"}${Date.now()}`;
    Game.CreateCustomKeyBind(Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT), `+${commandf7}`);
    Game.AddCommand(`+${commandf7}`, () => { OnClickSpray() }, "", 0 );
	
///////////////////////////////////////////////

function OnClickSpray() {
	$.Msg('OnClickSpray')
	Game.CreateCustomKeyBind(Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT), "UsePet");
	var button_text = FindDotaHudElement("CosmeticAbility_text2");
	button_text.text = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT)

	var spray = CustomNetTables.GetTableValue( "player_pets", playerID);
	if (spray != null){
		if(can_use) {
				GameEvents.SendCustomGameEventToServer( "UsePet", {} )
				timer(2)	
			}
		can_use = false
	}	
}	

function timer(i) {
	var text_timer = FindDotaHudElement("CosmeticAbility_text");
		if (i > 0) {
			text_timer.text = (i - 1)
		}
		if (i == 0 ) {
			text_timer.text = ""
			can_use = true
			return	
		}
		 i--;
    $.Schedule(1, function() {
        timer(i)
    });
}


function UpdatePetIcon(){
	Game.CreateCustomKeyBind(Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT), "UsePet");
	var button_text = FindDotaHudElement("CosmeticAbility_text2");
	button_text.text = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT)
	
	var spray = CustomNetTables.GetTableValue( "player_pets", playerID);
	const spray_icon = FindDotaHudElement("CustomAbility_spray_custom");
	spray_icon
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/pet_buttons/"+spray.pet+".png" );
}

(function () {
	Game.AddCommand( "UsePet", OnClickSpray, "", 0 );
	
	const centerBlock = FindDotaHudElement("center_block");
	let cosmetics = centerBlock.FindChildTraverse("BarOverItems");

	if (cosmetics) {
		cosmetics.DeleteAsync(0);
	}

	const ability = $.CreatePanel("Button", FindDotaHudElement("BarOverItems"), "CustomAbility_spray_custom");
	ability.BLoadLayoutSnippet("CosmeticAbility");
	
	if (!cosmetics) {
		$("#BarOverItems").SetParent(centerBlock);
	}

	const spray = FindDotaHudElement("CustomAbility_spray_custom");
	spray
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/spray_no_empty.png" );
	FindDotaHudElement("BuffContainer").style.marginBottom = "43px;";
})();


(function() {
	$.Msg('GetKeybindForCommand')
	$.Msg(Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT))
	// $.RegisterForUnhandledEvent('F1',() => {
    //     $.Msg("123")
    // })
	GameEvents.Subscribe('UpdatePetIcon', UpdatePetIcon);
	Game.CreateCustomKeyBind(Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT), "UsePet");
	var button_text = FindDotaHudElement("CosmeticAbility_text2");
	button_text.text = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT)
})();


