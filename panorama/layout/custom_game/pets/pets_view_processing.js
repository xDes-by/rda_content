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
function ShowTooltip(message, panel){
    return ()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", panel, $.Localize("#"+message));
    }
}
function HideTooltip(){
    return ()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    }
}
function CreateOpenButton(){
    const ButtonBar = DotaHUD.Get().FindChildTraverse("ButtonBar")
    let panel = ButtonBar.FindChildTraverse("button_pets")
    if(!panel){
        panel = $.CreatePanel('Panel', ButtonBar, "button_pets")
        panel.BLoadLayout("file://{resources}/layout/custom_game/pets/pets_button.xml", false, false)
    }
    panel.SetPanelEvent("onmouseactivate",()=>{
        ClickButton()
        OpenButton()
    });
    panel.SetPanelEvent("onmouseover",()=>{
        $.DispatchEvent( "DOTAShowTextTooltip", panel, $.Localize("#pets"));
    });
    panel.SetPanelEvent("onmouseout",()=>{
        $.DispatchEvent( "DOTAHideTextTooltip");
    });
    panel.style.tooltipPosition = 'bottom';
}
function SetPetPrice(panel, obj){
    if(obj.price == undefined){
        panel.SetHasClass("hidden", true)
        return
    }
    if(obj.price.rp){
        panel.FindChildTraverse("buy_gem_img").SetHasClass("hidden", true)
        panel.FindChildTraverse("buy_rp_img").SetHasClass("hidden", false)
        panel.FindChildTraverse("buy_pet_label").text = obj.price.rp
    }else if(obj.price.don){
        panel.FindChildTraverse("buy_gem_img").SetHasClass("hidden", false)
        panel.FindChildTraverse("buy_rp_img").SetHasClass("hidden", true)
        panel.FindChildTraverse("buy_pet_label").text = obj.price.don
    }else if(panel.FindChildTraverse("buy_unavailible_label")){
        panel.SetPanelEvent("onmouseover", ShowTooltip( "pets_buy_unavailible_tooltip", panel ))
        panel.SetPanelEvent("onmouseout", HideTooltip())
        for(let i = 0; i < panel.GetChild(0).GetChildCount(); i++){
            panel.GetChild(0).GetChild(i).SetHasClass("hidden", !(panel.GetChild(0).GetChild(i).id == "buy_unavailible_label"))
        }
        return
    }else{
        panel.SetHasClass("hidden", true)
        return
    }
    if(panel.FindChildTraverse("buy_unavailible_label")){
        panel.FindChildTraverse("buy_unavailible_label").SetHasClass("hidden", true)
    }
    panel.SetPanelEvent("onactivate", BuyPet(obj.name))
}
function CreateAbilityImageAndTooltip(panel, abilityname){
    panel.abilityname = abilityname
    panel.SetPanelEvent("onmouseover", ShowAbilityTooltip(panel, abilityname))
    panel.SetPanelEvent("onmouseout", HideAbilityTooltip())
}
function CreatePetPanel(panel, obj){
    const pet_panel = $.CreatePanel("Panel", panel, "")
    if(obj == undefined){
        pet_panel.BLoadLayoutSnippet("pet_empty")
        return
    }
    pet_panel.BLoadLayoutSnippet("pet")
    CreateAbilityImageAndTooltip(pet_panel.FindChildTraverse("item_pet"), obj.itemname)
    pet_panel.FindChildTraverse("item_pet").SetPanelEvent("onactivate", DisplayPetInfo_Event(obj.name))
    pet_panel.FindChildTraverse("item_pet").SetPanelEvent("oncontextmenu", EquipPet_Event(obj.name))
    pet_panel.FindChildTraverse("name_pet").text = $.Localize("#"+obj.name)
    pet_panel.FindChildTraverse("name_pet").style.color = obj.rarity
    pet_panel.FindChildTraverse("have_pet").SetHasClass("hidden", true)
    SetPetPrice(pet_panel.FindChildTraverse("buy_pet_button"), obj)
    pet_panel.FindChildTraverse("status_loading_panel").SetHasClass("hidden", true)
}
function CreatePetRowPage(){
    const panel = $.CreatePanel("Panel", PANEL.pet_showcase, "", {class:"showcase"})
    return panel
}
function CreatePageButton(tier, page_n, color){
    const panel = $.CreatePanel("Panel", PANEL.pages_pet, "")
    panel.BLoadLayoutSnippet("page_button_panel")
    panel.GetChild(0).text = tier
    panel.GetChild(0).style.color = color
    panel.SetPanelEvent("onactivate", SetPage_Event(page_n))
    return panel
}
function CreatePetListPanels(){
    PANEL.pet_showcase.RemoveAndDeleteChildren()
    PANEL.pages_pet.RemoveAndDeleteChildren()
    pages_count = 0;
    for(let i = 1; i <= TIERS; i++){
        var panel = undefined
        for(let j = 0; j < Math.ceil(Object.keys(list_tab[i]).length/6); j++){
            pages_count += 1;
            panel = CreatePetRowPage()
            CreatePageButton(i, pages_count, list_tab[i][j+1].rarity)
            for(let k = j*6; k < 6+6*j; k++){
                CreatePetPanel(panel, list_tab[i][k+1])
            }
        }
    }
}
function UpdateSelectedPageButtonShadow(){
    for(let i = 0; i < pages_count; i++){
        PANEL.pages_pet.GetChild(i).SetHasClass("selected_button_glow", (i+1 == current_page))
    }
}
function RefreshPlayerPetOwnership(name, data){
    const panel = FindPanelByName(name)
    panel.FindChildTraverse("buy_pet_button").SetHasClass("hidden", true)
    if(data.status != undefined && data.status == "loading"){
        panel.FindChildTraverse("status_loading_panel").SetHasClass("hidden", false)
        return
    }else{
        panel.FindChildTraverse("status_loading_panel").SetHasClass("hidden", true)
    }
    panel.FindChildTraverse("have_pet").SetHasClass("hidden", false)
    panel.FindChildTraverse("pet_level").text = $.Localize("#pets_level_label").replace("##count##", Level(data.value)[0])
    panel.FindChildTraverse("item_pet").SetPanelEvent("onactivate", DisplayPetInfo_Event(name))
    panel.FindChildTraverse("trial_end_date").text = ""
    if(data.remaining_games_count != undefined){
        panel.FindChildTraverse("trial_end_date").text = $.Localize("#pets_trial_game_count").replace("##count##", data.remaining_games_count)
    }
    if(data.end_date != undefined){
        panel.FindChildTraverse("trial_end_date").text = $.Localize("#pets_trial_end_date").replace("##date##", data.end_date)
    }
    panel.FindChildTraverse("auto_get").SetPanelEvent("onactivate", UpdateAutoPet_Event(name))
}
function DisplayPetInfo(name){
    current_pet_view = name
    const obj = FindPetDataByName(name)
    const data = CustomNetTables.GetTableValue( "Pets", Players.GetLocalPlayer()).pets
    CreateAbilityImageAndTooltip(PANEL.item_main_pet, obj.itemname)
    PANEL.item_main_pet.FindChildTraverse("trial_end_date").text = ""
    PANEL.interface_name_pet.text = $.Localize("#"+obj.name)
    if(!data[obj.name]){
        PANEL.buy_pet_button_2.SetHasClass("hidden", false)
        SetPetPrice(PANEL.buy_pet_button_2, obj)
        PANEL.equip_pet_button.SetHasClass("hidden", true)
        PANEL.interface_level_pet_icon_1.SetHasClass("hidden", true)
    }else{
        PANEL.buy_pet_button_2.SetHasClass("hidden", true)
        PANEL.equip_pet_button.SetPanelEvent("onactivate", EquipPet_Event(name))
        PANEL.equip_pet_button.SetHasClass("hidden", false)
        PANEL.interface_level_pet_icon_1.text = $.Localize("#pets_level_label").replace("##count##", Level(data[obj.name].value)[0])
        PANEL.interface_level_pet_icon_1.SetHasClass("hidden", false)
        if(data[obj.name].remaining_games_count != undefined){
            PANEL.item_main_pet.FindChildTraverse("trial_end_date").text = $.Localize("#pets_trial_game_count").replace("##count##", data[obj.name].remaining_games_count)
        }
    }
    PANEL.interface_tier_pet.text = $.Localize("#pets_tier_label").replace("##count##", DetermineTierByName(obj.name))
    if(!data[obj.name]){
        PANEL.exp_progress_bar_pet.max = 1
        PANEL.exp_progress_bar_pet.value = 0
        PANEL.interface_level_pet_1.text = $.Localize("#pets_level_label").replace("##count##", 0)
        PANEL.interface_level_pet_2.text = $.Localize("#pets_level_label").replace("##count##", 1)
        PANEL.exp_counter_pet.text = "0/1"
        PANEL.pet_upgrade_container.SetHasClass("hidden", true)
        return
    }
    const value = Level(data[obj.name].value)[1]
    const passed = Level(data[obj.name].value)[2]    
    PANEL.exp_progress_bar_pet.max = value
    PANEL.exp_progress_bar_pet.value = (data[obj.name].value - passed)
    PANEL.interface_level_pet_1.text = $.Localize("#pets_level_label").replace("##count##", Level(data[obj.name].value)[0]) 
    PANEL.interface_level_pet_2.text = $.Localize("#pets_level_label").replace("##count##", Level(data[obj.name].value)[3])
    PANEL.exp_counter_pet.text = (data[obj.name].value - passed) +"/" + value
    PANEL.pet_upgrade_container.SetHasClass("hidden", false)
    BuildFeedEntryButtons(obj, data[obj.name])
}
function CreateProduct(data){
    const panel = $.CreatePanel("Panel", PANEL.shop_container, "")
    panel.BLoadLayoutSnippet("store")
    panel.FindChildTraverse("shop_1_img").style.backgroundImage = "url('file://{resources}/"+data.image_path+"')"
    panel.FindChildTraverse("shop_name_label").text = $.Localize("#"+data.name)
    panel.FindChildTraverse("shop_1_img").SetPanelEvent("onmouseover", ShowTooltip( data.tooltip, panel.FindChildTraverse("shop_1_img") ))
    panel.FindChildTraverse("shop_1_img").SetPanelEvent("onmouseout", HideTooltip())
    panel.FindChildTraverse("shop_active").SetHasClass("hidden", true)
    panel.FindChildTraverse("shop_gems_button_label").text = data.price.don
    panel.FindChildTraverse("shop_gems_button").SetPanelEvent("onmouseactivate", OnPressBuyButoon(data, "don"))
    panel.FindChildTraverse("shop_gems_button").SetHasClass("hidden", data.price.don == undefined)
    panel.FindChildTraverse("shop_rp_button_label").text = data.price.rp
    panel.FindChildTraverse("shop_rp_button").SetPanelEvent("onmouseactivate", OnPressBuyButoon(data, "rp"))
    panel.FindChildTraverse("shop_rp_button").SetHasClass("hidden", data.price.rp == undefined)
}
function CreateShop(){
    PANEL.shop_container.RemoveAndDeleteChildren()
    for(let data of goods){
        CreateProduct(data)
    }
}
function UpdateCurrentPetPanel(cosmetic){
    if(cosmetic == undefined){
        cosmetic = CustomNetTables.GetTableValue( "cosmetic_buttons", "pet")
    }
    if(cosmetic == undefined){
        return
    }
    const spell = cosmetic[Players.GetLocalPlayer()]
    const obj = FindPetDataBySpell(spell)
    if(!obj){
        return
    }
    const player_data = CustomNetTables.GetTableValue( "Pets", Players.GetLocalPlayer())
    PANEL.current_pet_tier.text = $.Localize("#pets_tier_label").replace("##count##", DetermineTierByName(obj.name))
    PANEL.current_pet_name.text = $.Localize("#"+obj.name)
    PANEL.current_pet_level.text = $.Localize("#pets_level_label").replace("##count##", Level(player_data.pets[obj.name].value)[0])
    CreateAbilityImageAndTooltip(PANEL.current_pet_icon, obj.itemname)
    PANEL.current_pet_icon.SetPanelEvent("onactivate", DisplayPetInfo_Event(obj.name))
}
function BuildFeedEntryButtons(obj, data){
    PANEL.feed_entry_text.text = 0
    $("#feed_entry_plus_panel").SetPanelEvent("onmouseactivate",  ()=>{
        FeedEntry( 1, data )
    })
    $("#feed_entry_plus_panel").SetPanelEvent("oncontextmenu", ()=>{
        FeedEntry( 10, data )
    })
    $("#feed_entry_minus_panel").SetPanelEvent("onmouseactivate", ()=>{
        FeedEntry( -1, data )
    })
    $("#feed_entry_minus_panel").SetPanelEvent("oncontextmenu", ()=>{
        FeedEntry( -10, data )
    })
    PANEL.feed_entry_text.SetPanelEvent("oninputsubmit",()=>{
        FeedEntry( 0, data)
    })
    PANEL.pet_update_button_1.SetPanelEvent("onmouseactivate", PlusOneLevel(data))
    PANEL.pet_update_button_2.SetPanelEvent("onmouseactivate", PlusMaxFeed(data))
    PANEL.pet_update_button_3.SetPanelEvent("onmouseactivate", UpdateButton(obj.name, data))
}
function UpdatePetChange(data){
    const panel = PANEL.shop_container.GetChild(0)
    $.Msg('pet_change - ', data.pet_change)
    panel.FindChildTraverse("shop_buttons_container").SetHasClass("hidden", data.pet_change > 0)
    panel.FindChildTraverse("shop_active").SetHasClass("hidden", data.pet_change == 0)
}

function UpdateMoney(data){
    if(data == undefined){
        data = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer())
    }
    PANEL.gems_label_pet.text = data.coins
    PANEL.rp_label_pet.text = data.mmrpoints
    PANEL.feed_label_pet.text = data.feed
    UpdatePetChange(data)
}
function BuildExpDate(exp){
    let value = Level(exp)[1]
    let passed = Level(exp)[2]
    PANEL.interface_level_pet_1.text = $.Localize("#pets_level_label").replace("##count##", Level(exp)[0])
    PANEL.interface_level_pet_2.text = $.Localize("#pets_level_label").replace("##count##", Level(exp)[3])
    PANEL.exp_progress_bar_pet.value = (exp - passed)
    PANEL.exp_progress_bar_pet.max = value
    PANEL.exp_counter_pet.text = (exp - passed) +"/" + value
}