var Pets = {}
Pets.Pages = {}

Pets.PageTitle = []
Pets.NamePage = {}
Pets.PageTier = []
function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

function Level(exp){
    let level = 10
    let value = Pets.exp[10]
    let NextLevel = 10
    let passed_exp = 0
    for(let i = 1; i<=10; i++){
        passed_exp += Pets.exp[i-1]
        if(exp >= passed_exp && exp < passed_exp + Pets.exp[i]){
            NextLevel = i
            level = i-1
            value = Pets.exp[i]
            break
        }
    }
    return [ level , value, passed_exp, NextLevel ]
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

// созданеие списка петов
var panel = {}
function CreatePetList(t){
    $.Msg("create pet list js")
    Pets.exp = t.exp
    $("#pet_showcase").RemoveAndDeleteChildren()
    Pets.pet = t.shop[1]
    Pets.all = t.shop
    var tier = {}
    for(let i in Pets.pet){
        if(typeof(Pets.pet[i]) == 'object' && Pets.pet[i].type == 'pet'){
            if(tier[Pets.pet[i].tier] == null){tier[Pets.pet[i].tier] = []}
            Pets.pet[i].i = i
            tier[Pets.pet[i].tier].push(Pets.pet[i])
        }
    }
    $("#ItemPips").RemoveAndDeleteChildren()
    var page = 0
    for(i in tier){

        for(let z = 0; z < Math.ceil(tier[i].length/6); z++){

            Pets.PageTitle.push($.Localize("#pet_title") + i)
            let pagePanel = $.CreatePanelWithProperties("Panel", $("#pet_showcase"), "", {class:"showcase"})
            
            for(let j = z*6; j < 6+6*z; j++){
                CreatePetPanel(tier, pagePanel, i, j, page)
            }
            let p = Pets.PageTitle.length - 1
            let dot = $.CreatePanelWithProperties("Button", $("#ItemPips"), "" ,{class:"PaginationButtonCustom"})
            dot.SetPanelEvent("onmouseactivate", ()=>{
                SetPage(p)
            })
            Pets.PageTier[page] = i
            page += 1
        }
    }

    CreatePetShop(1,1)
    CreatePetShop(1,30)
    CreatePetShop(1,31)

    let pan = $("#MoneyPanelContaner")
    pan.FindChildTraverse("gems_label_pet").text = Pets.all["coins"]
    pan.FindChildTraverse("rp_label_pet").text = Pets.all["mmrpoints"]
    pan.FindChildTraverse("feed_label_pet").text = Pets.all["feed"]
    
    if(t.auto_pet){
        panel[t.auto_pet].FindChildTraverse("auto_get").SetSelected(true)
        for(let i in Pets.pet){
            if(Pets.pet[i].name == t.auto_pet){
                let f = InterfaceFilling(Pets.pet[i])
                f()
                break
            }
        }
        SetPage(Pets.NamePage[t.auto_pet])
    }else{
        let f = InterfaceFilling(tier[1][0])
        f()
        SetPage(0)
    }
}

// создание панели пета
function CreatePetPanel(tier, pagePanel, i, j, pageNumber){
    let pan_id = ""
    if(tier[i][j]){
        pan_id = tier[i][j].name + "_panel"
    }
    let petPanel = $.CreatePanelWithProperties("Panel", pagePanel, pan_id, {class:"showcase_pet"})
    petPanel.BLoadLayoutSnippet("pet")
    if(tier[i][j]){
        panel[tier[i][j].name] = petPanel
    }
    
    if(tier[i][j]){
        AvailablePetFilling(tier[i][j],petPanel)
    }else{
        petPanel.FindChildTraverse("name_pet").visible = false
        petPanel.FindChildTraverse("item_pet").visible = false
        petPanel.FindChildTraverse("buy_pet_button").visible = false
        petPanel.FindChildTraverse("have_pet").visible = false
    }
    if(tier[i][j]){
        Pets.NamePage[tier[i][j].name] = pageNumber
    }
}

// заполнение пета
function AvailablePetFilling(obj,petPanel){
    petPanel.FindChildTraverse("name_pet").visible = true
    petPanel.FindChildTraverse("item_pet").visible = true
    petPanel.FindChildTraverse("buy_pet_button").visible = true
    petPanel.FindChildTraverse("have_pet").visible = true
    petPanel.FindChildTraverse("item_pet").abilityname = obj.itemname
    petPanel.FindChildTraverse("item_pet").SetPanelEvent("onmouseover", ShowAbilityTooltip(petPanel.FindChildTraverse("item_pet"), obj.itemname))
    petPanel.FindChildTraverse("item_pet").SetPanelEvent("onmouseout", HideAbilityTooltip())

    // petPanel.SetPanelEvent("onmouseactivate", InterfaceFilling(obj))
    petPanel.FindChildTraverse("item_pet").SetPanelEvent("onmouseactivate", InterfaceFilling(obj))
    petPanel.FindChildTraverse("item_pet").SetPanelEvent("ondblclick", GetPet(obj))
    petPanel.FindChildTraverse("auto_get").SetPanelEvent("onmouseactivate", AutoGet(obj))
    
    petPanel.FindChildTraverse("name_pet").text = $.Localize("#"+obj.name)
    if(obj.onStart == 0){
        petPanel.FindChildTraverse("have_pet").visible = false
        if(obj.price.don){
            petPanel.FindChildTraverse("buy_pet_label").text = obj.price.don
            petPanel.FindChildTraverse("buy_rp_img").visible = false
            petPanel.FindChildTraverse("buy_pet_button").SetPanelEvent("onmouseactivate", Pets.Buy(1, obj.i, "gems"))
        }else if(obj.price.rp){
            petPanel.FindChildTraverse("buy_pet_label").text = obj.price.rp
            petPanel.FindChildTraverse("buy_gem_img").visible = false
            petPanel.FindChildTraverse("buy_pet_button").SetPanelEvent("onmouseactivate", Pets.Buy(1, obj.i, "rp"))
        }
    }else{
        petPanel.FindChildTraverse("buy_pet_button").visible = false
        petPanel.FindChildTraverse("pet_level").text = $.Localize("#pet_level") + " " + Level(obj.now)[0]
    }
}

function AutoGet(pet){
    return ()=>{
        if(panel[pet.name].FindChildTraverse("auto_get").checked){
            for(let i in panel){
                if(i != pet.name){
                    panel[i].FindChildTraverse("auto_get").SetSelected(false)
                }
            }
            GameEvents.SendCustomGameEventToServer("AutoGetPetOprion", {pet : pet})
        }else{
            GameEvents.SendCustomGameEventToServer("AutoGetPetOprion", {})
        }
    }
}

function InterfaceFilling(petObj){
    return function(){
        Pets.TextEntry = 0
        $("#feed_entry_text").text = 0
        $("#interface_name_pet").text = $.Localize("#"+petObj.name)
        $("#item_main_pet").SetPanelEvent("onmouseactivate", ()=>{})
        $("#item_main_pet").SetPanelEvent("ondblclick", GetPet(petObj))
        $("#item_main_pet").abilityname = petObj.itemname
        $("#item_main_pet").SetPanelEvent("onmouseover", ShowAbilityTooltip($("#item_main_pet"), petObj.itemname))
        $("#item_main_pet").SetPanelEvent("onmouseout", HideAbilityTooltip())

        // ShowAbilityTooltip
        BuildExpDate(petObj.now)
        $("#interface_tier_pet").text = $.Localize("#tier")+" "+petObj.tier
        $("#interface_level_pet_1").text = $.Localize("#pet_level")+" "+Level(petObj.now)[0]
        
        if(petObj.now > 0){
            $("#pet_upgrade_container").visible = true
            $("#buy_pet_button_2").visible = false
            if(petObj == Pets.selectedPet){
                $("#change_pet_label").text = $.Localize("#pet_equip2")
            }else{
                $("#change_pet_label").text = $.Localize("#pet_equip")
            }
            $("#change_pet_button").SetPanelEvent("onmouseactivate", GetPet(petObj))
            if(Pets.can_change == 1){
                $("#change_pet_button").visible = true
            }else{
                $("#change_pet_button").visible = false
            }
        }else{
            $("#pet_upgrade_container").visible = false
            $("#buy_pet_button_2").visible = true
            if(petObj.price.don){
                $("#buy_pet_button_2").FindChildTraverse("buy_gem_img").visible = true
                $("#buy_pet_button_2").FindChildTraverse("buy_rp_img").visible = false
                $("#buy_pet_button_2").FindChildTraverse("buy_pet_label").text = petObj.price.don
                $("#buy_pet_button_2").SetPanelEvent("onmouseactivate",Pets.Buy(1, petObj.i, "gems"))
            }
            if(petObj.price.rp){
                $("#buy_pet_button_2").FindChildTraverse("buy_gem_img").visible = false
                $("#buy_pet_button_2").FindChildTraverse("buy_rp_img").visible = true
                $("#buy_pet_button_2").FindChildTraverse("buy_pet_label").visible = true
                $("#buy_pet_button_2").FindChildTraverse("buy_pet_label").text = petObj.price.rp
                $("#buy_pet_button_2").SetPanelEvent("onmouseactivate",Pets.Buy(1, petObj.i, "rp"))
            }
            $("#change_pet_button").visible = false
        }
        BuildFeedEntryButtons(petObj)

        for(let name in panel){
            panel[name].FindChildTraverse("item_pet").RemoveClass("item_pet_selected")
        }
        panel[petObj.name].FindChildTraverse("item_pet").AddClass("item_pet_selected")
    }
}

function CreateOldPet(petObj){
    $("#selected_name_pet").text = $.Localize("#"+petObj.name)
    $("#item_selected_pet").abilityname = petObj.itemname
    $("#item_selected_pet").SetPanelEvent("onmouseover", ShowAbilityTooltip($("#item_selected_pet"), petObj.itemname))
    $("#item_selected_pet").SetPanelEvent("onmouseout", HideAbilityTooltip())

    if(petObj.now == undefined){
        $("#item_selected_pet").SetPanelEvent("onmouseactivate", ()=>{})
        $("#selected_tier_pet").visible = false
        $("#selected_level_pet_1").visible = false
    }else{
        $("#item_selected_pet").SetPanelEvent("onmouseactivate", InterfaceFilling(petObj))
        $("#selected_tier_pet").text = $.Localize("#tier")+" "+petObj.tier
        $("#selected_level_pet_1").text = $.Localize("#pet_level")+" "+Level(petObj.now)[0]
        $("#selected_tier_pet").visible = true
        $("#selected_level_pet_1").visible = true
    }
}

function GetPet(pet){
    return ()=>{
        GameEvents.SendCustomGameEventToServer("GetPet", {pet : pet})
    }
}

function BuildExpDate(exp){
    let value = Level(exp)[1]
    let passed = Level(exp)[2]
    $("#interface_-1level_pet").text = $.Localize("#pet_level") + Level(exp)[0]
    $("#interface_level_pet").text = $.Localize(`#pet_level`) + Level(exp)[3]
    $("#exp_progress_bar_pet").value = (exp - passed)
    $("#exp_progress_bar_pet").max = value
    $("#exp_counter_pet").text = (exp - passed) +"/" + value
}


function BuildFeedEntryButtons(obj){
    $("#feed_entry_plus_panel").SetPanelEvent("onmouseactivate", ()=>{FeedEntry(Pets.TextEntry + 1, obj)})
    $("#feed_entry_plus_panel").SetPanelEvent("oncontextmenu", ()=>{FeedEntry(Pets.TextEntry + 10, obj)})
    $("#feed_entry_minus_panel").SetPanelEvent("onmouseactivate", ()=>{FeedEntry(Pets.TextEntry -1, obj)})
    $("#feed_entry_minus_panel").SetPanelEvent("oncontextmenu", ()=>{FeedEntry(Pets.TextEntry -10, obj)})
    $("#feed_entry_text").SetPanelEvent("oninputsubmit",()=>{
        FeedEntry($("#feed_entry_text").text, obj)
    })
    $("#pet_update_button_1").SetPanelEvent("onmouseactivate", PlusOneLevel(obj))
    $("#pet_update_button_2").SetPanelEvent("onmouseactivate", PlusMaxFeed(obj))
    $("#pet_update_button_3").SetPanelEvent("onmouseactivate", UpdateButton(obj, Pets.TextEntry))
}

Pets.TextEntry = 0


function FeedEntry(n, obj){
    let maxExp = 0
    for(let i in Pets.exp){
        maxExp += Pets.exp[i]
    }
    Pets.TextEntry = Number(n)
    if(Pets.TextEntry < 0){
        Pets.TextEntry = 0
    }
    if(obj.now + Pets.TextEntry > maxExp){
        Pets.TextEntry = maxExp - obj.now
    }
    $("#feed_entry_text").text = Pets.TextEntry
    BuildExpDate(obj.now + Pets.TextEntry)
}

function PlusOneLevel(obj){
    return ()=>{
        let level = Level(obj.now + Pets.TextEntry)[0]
        let value = Level(obj.now + Pets.TextEntry)[1]
        let passed = Level(obj.now + Pets.TextEntry)[2]
        let need = value - (obj.now - passed + Pets.TextEntry)
        FeedEntry(Pets.TextEntry + need, obj)
    }
}

function PlusMaxFeed(obj){
    return ()=>{
        let maxExp = 0
        for(let i in Pets.exp){
            maxExp += Pets.exp[i]
        }
        let myFeed = Pets.all["feed"]
        if(maxExp - obj.now > myFeed){
            if(Pets.TextEntry < myFeed ||  maxExp == obj.now + Pets.TextEntry){
                FeedEntry(myFeed, obj)
            }else{
                FeedEntry(maxExp - obj.now, obj)
            }
        }else if(maxExp - obj.now <= myFeed){
            FeedEntry(maxExp - obj.now, obj)
        }
    }
}

function UpdateButton(petObj, count){
    return ()=>{
        if(Pets.all.feed < Pets.TextEntry){return}

        petObj.now += Pets.TextEntry
        panel[petObj.name].FindChildTraverse("pet_level").text = $.Localize("#pet_level") + " " + Level(petObj.now)[0]
        GameEvents.SendCustomGameEventToServer("UpdatePetButton", {pet : petObj, count : Pets.TextEntry})
        FeedEntry(0, petObj)
        let f = InterfaceFilling(petObj)
        f()
    }
}

Pets.Page = 0


function SetPage(n){
    $("#pet_showcase").style.position = `${-1123 * n}px 0 0`
    $("#page_name_pet").text = Pets.PageTitle[n]
    $("#pages_label").text = n+1 + "/" + Pets.PageTitle.length
    for(let i = 0; i < Pets.PageTitle.length; i++){
        if(i == n){
            $("#ItemPips").GetChild(i).AddClass("slider_button_active")
        }else{
            $("#ItemPips").GetChild(i).RemoveClass("slider_button_active")
        }
    }
    // $("#interface_tier_pet").text = $.Localize("тир ")+Pets.PageTier[n]
    Pets.Page = n
}

Pets.NextPage = ()=>{
    if(Pets.Page == Pets.PageTitle.length -1){ 
        SetPage(0)
    }else{
        SetPage(Pets.Page + 1)
    }
}

Pets.PreviousPage = ()=>{
    if(Pets.Page == 0){ 
        SetPage(Pets.PageTitle.length -1)
    }else{
        SetPage(Pets.Page - 1)
    }
}


$("#arrow_left").SetPanelEvent("onmouseactivate", ()=>{
    Pets.PreviousPage()
})
$("#arrow_right").SetPanelEvent("onmouseactivate", ()=>{
    Pets.NextPage()
})
$("#arrow2_left").SetPanelEvent("onmouseactivate", ()=>{
    Pets.PreviousPage()
    $("#arrow2_left").visible = false
    $.Schedule(0.15, ()=>{
        $("#arrow2_left").visible = true
    })
})
$("#arrow2_right").SetPanelEvent("onmouseactivate", ()=>{
    Pets.NextPage()
    $("#arrow2_right").visible = false
    $.Schedule(0.15, ()=>{
        $("#arrow2_right").visible = true
    })
})

var dropdown_count = 1
Pets.Buy = (i,j, currency)=>{
    return ()=>{
        let obj = Pets.all[i][j]
        let money = CustomNetTables.GetTableValue("shopinfo", Players.GetLocalPlayer())
        if(!money){return}
        if((currency == "gems" && money.coins < obj.price.don) || (currency == "rp" && money.mmrpoints < obj.price.rp)){
            GameEvents.SendEventClientSide("dota_hud_error_message",
            {
                "splitscreenplayer": 0,
                "reason": 80,
                "message": "#dota_don_shop_error"
            })
            return
        }
        let pan = $("#buy_coufirm_bg_pet")
        pan.FindChildTraverse("buy_confirm_item_name").text = " " + $.Localize("#"+obj.name)
        let price = 0
        if(currency == "gems"){
            price = obj.price.don
            pan.FindChildTraverse("buy_confirm_price").text = obj.price.don
            pan.FindChildTraverse("rp_image_pet").visible = false
            pan.FindChildTraverse("gems_image_pet").visible = true
        }else if (currency == "rp"){
            price = obj.price.rp
            pan.FindChildTraverse("buy_confirm_price").text = obj.price.rp
            pan.FindChildTraverse("rp_image_pet").visible = true
            pan.FindChildTraverse("gems_image_pet").visible = false
        }
        dropdown_count = 1
        if(Pets.all[i][j].combinable){
            $("#confirm_drop_down").visible = true
            $("#confirm_drop_down").RemoveAllOptions()
            var opCount =  0
            if(currency == "gems"){
                opCount = money.coins / obj.price.don
                if(opCount > 10){
                    opCount = 10
                }
            }else if(currency == "rp"){
                opCount = money.mmrpoints / obj.price.rp
                if(opCount > 10){
                    opCount = 10
                }
            }
            for(let i = 1; i <= opCount; i++){
                $("#confirm_drop_down").AddOption($.CreatePanelWithProperties("Label", $("#confirm_drop_down"), i, {text:i+$.Localize("#pet_pieces")}))
            }
            $("#confirm_drop_down").SetSelected('1')

            $("#confirm_drop_down").SetPanelEvent("oninputsubmit", function(){
                if(!$("#confirm_drop_down")){return}
                if($("#confirm_drop_down").GetSelected()){
                    dropdown_count = $("#confirm_drop_down").GetSelected().id
                    $("#buy_confirm_price").text = price * dropdown_count
                }
            })
        }else{
            $("#confirm_drop_down").visible = false
        }

        $("#confirm_yes_panel").SetPanelEvent("onmouseactivate", ()=>{
            $("#buy_coufirm_bg_pet").visible = false
            let evCurrency = 1
            if(currency == 'gems'){
                evCurrency = 0   
            }
            GameEvents.SendCustomGameEventToServer("buyItem", {i:i,n:j, amountBuy:dropdown_count,currency:evCurrency})
            if(Pets.pet[j].type=='pet'){
                Pets.pet[j].onStart = 1
                Pets.pet[j].now = 1
                AvailablePetFilling(Pets.pet[j], $('#'+Pets.pet[j].name+"_panel"))
                let f = InterfaceFilling(Pets.pet[j])
                f()
            }
            if(i == 1 && j == 1){
                $("#pet_shop_container").GetChild(0).FindChildTraverse("shop_active").visible = true
                $("#pet_shop_container").GetChild(0).FindChildTraverse("shop_rp_button").visible = false
                $("#pet_shop_container").GetChild(0).FindChildTraverse("shop_gems_button").visible = false
            }
        })
        
        $("#buy_coufirm_bg_pet").visible = true
    }
}

$("#pet_shop_container").RemoveAndDeleteChildren()
function CreatePetShop(i,j){
    storePanel = $.CreatePanelWithProperties("Panel", $("#pet_shop_container"), "",{})
    storePanel.BLoadLayoutSnippet("store")
    let obj = Pets.all[i][j]
    storePanel.FindChildTraverse("shop_1_img").style.backgroundImage = "url('file://{resources}/"+obj.image+"')"
    storePanel.FindChildTraverse("shop_name_label").text = $.Localize("#"+obj.name)
    storePanel.FindChildTraverse("shop_1_img").SetPanelEvent("onmouseover", TipsOver( obj.tooltip, storePanel.FindChildTraverse("shop_1_img") ))
    storePanel.FindChildTraverse("shop_1_img").SetPanelEvent("onmouseout", TipsOut())

    if(obj.status != 'active'){
        if(!obj.price.don){
            storePanel.FindChildTraverse("shop_gems_button").visible = false
        }else{
            storePanel.FindChildTraverse("shop_gems_button_label").text = obj.price.don
            storePanel.FindChildTraverse("shop_gems_button").SetPanelEvent("onmouseactivate", Pets.Buy(i,j, "gems"))
        }
    
        if(!obj.price.rp){
            storePanel.FindChildTraverse("shop_rp_button").visible = false
        }else{
            storePanel.FindChildTraverse("shop_rp_button_label").text = obj.price.rp
            storePanel.FindChildTraverse("shop_rp_button").SetPanelEvent("onmouseactivate", Pets.Buy(i,j, "rp"))
        }
        storePanel.FindChildTraverse("shop_active").visible = false
    }else{
        storePanel.FindChildTraverse("shop_rp_button").visible = false
        storePanel.FindChildTraverse("shop_gems_button").visible = false
    }
    
    
}

CustomNetTables.SubscribeNetTableListener( "shopinfo", function(table_name, key, data){
    if(key == Players.GetLocalPlayer()){
		let pan = $("#MoneyPanelContaner")
        pan.FindChildTraverse("gems_label_pet").text = data["coins"]
        pan.FindChildTraverse("rp_label_pet").text = data["mmrpoints"]
        pan.FindChildTraverse("feed_label_pet").text = data["feed"]
        Pets.all["coins"] = data["coins"]
        Pets.all["mmrpoints"] = data["mmrpoints"]
        Pets.all["feed"] = data["feed"]
    }
} );


function ShowAbilityTooltip(panel, abilityname){
    return ()=>{
        $.DispatchEvent("DOTAShowAbilityTooltip", panel, abilityname);
    }
}
function HideAbilityTooltip(){
    return ()=>{
        $.DispatchEvent("DOTAHideAbilityTooltip");
    }
}


$("#buy_coufirm_bg_pet").SetPanelEvent("onmouseactivate", ()=>{
    $("#buy_coufirm_bg_pet").visible = false
})
$("#confirm_no_panel").SetPanelEvent("onmouseactivate", ()=>{
    $("#buy_coufirm_bg_pet").visible = false
})
var isOpen = false

var open_btn_panel = $.CreatePanelWithProperties("Panel", FindDotaHudElement("HUDElements"), "", {style:"height: 100px;width: 100px;background-image: url('file://{images}/custom_game/pet/cat.png');background-size: contain; background-position: 50%;background-repeat: no-repeat;margin-left: 325px;tooltip-position: bottom;"})
// open_btn_panel.BLoadLayout("file://{resources}/layout/custom_game/main/pets.xml", false, false)
open_btn_panel.SetPanelEvent("onmouseover",TipsOver('pets',open_btn_panel));
open_btn_panel.SetPanelEvent("onmouseout",TipsOut());
open_btn_panel.SetPanelEvent("onmouseactivate",()=>{
    if(isOpen){
        isOpen = false
        $("#PetWindowMain").style.opacity = "0";
        $("#PetWindowMain").style.transform = "translate3d(0px, 300px, 0px)";
        $("#PetWindowMain").style.preTransformScale2d = "0.8";
    }else{
        isOpen = true
        $("#PetWindowMain").style.opacity = "1";
        $("#PetWindowMain").style.transform = "translate3d(0px, 0px, 0px)";
        $("#PetWindowMain").style.preTransformScale2d = "1";
    }

    
})
$("#close_pet").SetPanelEvent("onmouseactivate",()=>{
    isOpen = false
    $("#PetWindowMain").style.opacity = "0";
    $("#PetWindowMain").style.transform = "translate3d(0px, 300px, 0px)";
    $("#PetWindowMain").style.preTransformScale2d = "1";
})
function UpdatePetIcon(t){
	var player_pets = CustomNetTables.GetTableValue( "player_pets", Players.GetLocalPlayer());
    if(player_pets.pet == "spell_item_pet"){
        Pets.selectedPet = {
            name : "dota_tooltip_ability_spell_item_pet",
            itemname : player_pets.pet,
        }
        $("#change_pet_label").text = $.Localize("#pet_equip")
        $("#item_main_pet").RemoveClass("item_pet_selected")
    }else{
        for(let i in Pets.pet){
            if(Pets.pet[i].itemname == player_pets.pet){
                Pets.selectedPet = Pets.pet[i]
                break
            }
        }
        $("#change_pet_label").text = $.Localize("#pet_equip2")
        $("#item_main_pet").AddClass("item_pet_selected")
    }
    Pets.can_change = t["can_change"]
    if(Pets.can_change == 1){
        $("#change_pet_button").visible = true
    }else{
        $("#change_pet_button").visible = false
    }
    CreateOldPet(Pets.selectedPet)
}


$("#buy_coufirm_bg_pet").visible = false
// $("#PetWindowMain").visible = false

$("#InfoIcon").SetPanelEvent("onmouseover", TipsOver( "pets_info", $("#InfoIcon") ) )
$("#InfoIcon").SetPanelEvent("onmouseout", TipsOut() )


$("#close_pet").SetPanelEvent("onmouseover", TipsOver( "close", $("#close_pet") ) )
$("#close_pet").SetPanelEvent("onmouseout", TipsOut() )

$("#gems_image_pet").SetPanelEvent("onmouseover", TipsOver( "gems", $("#gems_image_pet") ) )
$("#gems_image_pet").SetPanelEvent("onmouseout", TipsOut() )

$("#rp_image_pet").SetPanelEvent("onmouseover", TipsOver( "mmrpoints", $("#rp_image_pet") ) )
$("#rp_image_pet").SetPanelEvent("onmouseout", TipsOut() )

$("#feed_image_pet").SetPanelEvent("onmouseover", TipsOver( "feed", $("#feed_image_pet") ) )
$("#feed_image_pet").SetPanelEvent("onmouseout", TipsOut() )



$.RegisterForUnhandledEvent('Cancelled',() => {
    isOpen = false
    $("#PetWindowMain").style.opacity = "0";
    $("#PetWindowMain").style.transform = "translate3d(0px, 300px, 0px)";
    $("#PetWindowMain").style.preTransformScale2d = "1";
})

var DotaHUD = GameUI.CustomUIConfig().DotaHUD;


function OnMouseEvent(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
        let petPanel = $("#PetWindowMain")
		if(petPanel){
			let cursorPos = GameUI.GetCursorPosition();
			let panelPos = petPanel.GetPositionWithinWindow();
			let width = Number(petPanel.actuallayoutwidth)
			let height = Number(petPanel.actuallayoutheight)
			if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
			{
				isOpen = false
                $("#PetWindowMain").style.opacity = "0";
                $("#PetWindowMain").style.transform = "translate3d(0px, 300px, 0px)";
                $("#PetWindowMain").style.preTransformScale2d = "1";
			}
		}
    }
}

(function() {
    // Update();
    DotaHUD.ListenToMouseEvent(OnMouseEvent);
    GameEvents.Subscribe('UpdatePetIcon', UpdatePetIcon);
})();


GameEvents.SendCustomGameEventToServer("GetPets", {})

GameEvents.Subscribe("GetPets_Js",function(t){
    CreatePetList(t)
})