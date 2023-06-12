var can_use = true;
var playerID = Players.GetLocalPlayer()
var keybind_courier = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT)
var CtrlDown = false
function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

///////////////////////////////////////////////

// const commandf7 = `On${"F7"}${Date.now()}`;
//     Game.CreateCustomKeyBind(Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT), `+${commandf7}`);
//     Game.AddCommand(`+${commandf7}`, () => { OnClickSpray() }, "", 0 );
	
///////////////////////////////////////////////

function OnClickSpray() {
	$.Msg('OnClickSpray')
	// Game.CreateCustomKeyBind(keybind_courier, "UsePet");
	// var button_text = FindDotaHudElement("CosmeticAbility_text2");
	// button_text.text = keybind_courier

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
	// Game.CreateCustomKeyBind(keybind_courier, "UsePet");
	// var button_text = FindDotaHudElement("CosmeticAbility_text2");
	// button_text.text = keybind_courier
	
	var spray = CustomNetTables.GetTableValue( "player_pets", playerID);
	const spray_icon = FindDotaHudElement("CustomAbility_pet_custom");
	spray_icon
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/pet_buttons/"+spray.pet+".png" );
}

function makeid(length) {
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

function CtrlButton(){
	if(!GameUI.IsControlDown()){
		CtrlDown = false
		return
	}
	if(CtrlDown) return
	CtrlDown = true
	OnClickSpray()
}

function CtrlTimer(){
	CtrlButton()
	$.Schedule(0.1, CtrlTimer);
}


(function() {
	const centerBlock = FindDotaHudElement("center_block");
	let cosmetics = centerBlock.FindChildTraverse("BarOverItems");
	
	if (cosmetics) {
		cosmetics.DeleteAsync(0);
	}

	const ability = $.CreatePanel("Button", FindDotaHudElement("BarOverItems"), "CustomAbility_pet_custom");
	ability.BLoadLayoutSnippet("CosmeticAbility");
	
	if (!cosmetics) {
		$("#BarOverItems").SetParent(centerBlock);
	}

	const spray = FindDotaHudElement("CustomAbility_pet_custom");
	spray
		.FindChildTraverse("CosmeticAbilityImage")
		.SetImage( "file://{images}/custom_game/spray_no_empty.png" );
	FindDotaHudElement("BuffContainer").style.marginBottom = "43px;";

	var button_text = FindDotaHudElement("CosmeticAbility_text2");
	button_text.text = keybind_courier
	
	const cmd_name = makeid(10)
	Game.AddCommand( cmd_name, OnClickSpray, "", 0 );
	Game.CreateCustomKeyBind(keybind_courier, cmd_name);

	GameEvents.Subscribe('UpdatePetIcon', UpdatePetIcon);
	// $.RegisterForUnhandledEvent("DOTAHudUpdate", AltButton);
	CtrlTimer()
})();
