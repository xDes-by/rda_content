DotaHUD.windowControllers["pets"] = {
    is_open: false,
    open: function(){
        main_panel.style.opacity = "1";
        main_panel.style.transform = "translate3d(0px, 0px, 0px)";
        main_panel.style.preTransformScale2d = "1";
    },
    close: function(){
        main_panel.style.opacity = "0";
        main_panel.style.transform = "translate3d(0px, 500px, 0px)";
        main_panel.style.preTransformScale2d = "0";
    }
}
function OpenButton(){
    DotaHUD.WindowOpen("pets")
}
function ClickButton() {
	Game.EmitSound("General.ButtonClick");
}
function CloseWindowOnOutsideClick(eventType, clickBehavior) {
	if (eventType == "pressed" && clickBehavior == CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
        let cursorPos = GameUI.GetCursorPosition();
        let panelPos = main_panel.GetPositionWithinWindow();
        let width = Number(main_panel.actuallayoutwidth)
        let height = Number(main_panel.actuallayoutheight)
        if (!(Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1]))
        {
            DotaHUD.WindowClose("pets")
        }
    }
}
const SetPage_Event = (page_n)=>{
    return ()=>{
        SetPage(page_n-1)
    }
}
function SetPage(page_n){
    if(page_n < 0){
        page_n = pages_count -1
    }
    if(page_n == pages_count){
        page_n = 0
    }
    current_page = page_n + 1
    PANEL.pet_showcase.style.position = `${-1123 * page_n}px 0 0`
    PANEL.arrow2_left.SetPanelEvent("onactivate", SetPage_Event(current_page -1))
    PANEL.arrow2_right.SetPanelEvent("onactivate", SetPage_Event(current_page +1))
    UpdateSelectedPageButtonShadow()
    PANEL.page_name_pet.text = $.Localize("#pets_tier_title").replace("##number##", DetermineTierByPage(page_n+1))
}
function DetermineTierByPage(page_n){
    for(var i = 1; i <= TIERS; i++){
        for(var j in list_tab[i]){
            if((j-1) % 6 == 0){
                page_n -= 1;
                if(page_n <= 0){
                    return i
                }
            }
        }
    }
}
function DeterminePageByName(name){
    let page_n = 0
    for(var i = 1; i <= TIERS; i++){
        for(var j in list_tab[i]){
            if((j-1) % 6 == 0){
                page_n += 1;
            }
            if(list_tab[i][j].name == name){
                return page_n
            }
        }
    }
}
function FindPanelByName(name){
    let p = 0
    let n = 0
    for(var i = 1; i <= TIERS; i++){
        for(var j in list_tab[i]){
            if((j-1) % 6 == 0){
                p += 1;
            }
            if(list_tab[i][j].name == name){
                n = j
                break
            }
        }
        if(n > 0) break;
    }
    const row_panel = PANEL.pet_showcase.GetChild(p-1)
    const pet_panel = row_panel.GetChild(((n-1)%6))
    return pet_panel
}
function FindPetDataByName(name){
    for(var i = 1; i <= TIERS; i++){
        for(var j in list_tab[i]){
            if(list_tab[i][j].name == name){
                return list_tab[i][j]
            }
        }
    }
}
function FindPetDataBySpell(spell){
    for(var i = 1; i <= TIERS; i++){
        for(var j in list_tab[i]){
            if(list_tab[i][j].itemname == spell){
                return list_tab[i][j]
            }
        }
    }
}
function DisplayPetInfo_Event(name){
    return ()=>{
        ClickButton()
        DisplayPetInfo(name)
    }
}
function Level(exp){
    let level = 10
    let value = experience_levels[10]
    let NextLevel = 10
    let passed_exp = 0
    for(let i = 1; i<=10; i++){
        passed_exp += experience_levels[i-1]
        if(exp >= passed_exp && exp < passed_exp + experience_levels[i]){
            NextLevel = i
            level = i-1
            value = experience_levels[i]
            break
        }
    }
    return [ level , value, passed_exp, NextLevel ]
}
function DetermineTierByName(name){
    for(var i = 1; i <= TIERS; i++){
        for(var j in list_tab[i]){
            if(list_tab[i][j].name == name){
                return i
            }
        }
    }
}
function UpdateUI(data){
    for(let name in data.pets){
        RefreshPlayerPetOwnership(name, data.pets[name])
        if(name == current_pet_view){
            DisplayPetInfo(name)
        }
    }
    if(data.auto_pet != ""){
        const panel = FindPanelByName(data.auto_pet)
        panel.FindChildTraverse("auto_get").SetSelected(true)
        if(first_init){
            let page_n = DeterminePageByName(data.auto_pet)
            SetPage(page_n-1)
            DisplayPetInfo(data.auto_pet)
            first_init = false
        }
    }
}
function EquipPet_Event(name){
    return ()=>{
        ClickButton()
        EquipPet(name)
    }
}
function EquipPet(name){
    GameEvents.SendCustomGameEventToServer("PetsEquip", {name : name})
}
function PlusOneLevel(data){
    return ()=>{
        let value = Level(data.value + Number(PANEL.feed_entry_text.text))[1]
        let passed = Level(data.value + Number(PANEL.feed_entry_text.text))[2]
        let need = value - (data.value - passed + Number(PANEL.feed_entry_text.text))
        FeedEntry(need, data)
    }
}
function PlusMaxFeed(data){
    return ()=>{
        let maxExp = 0
        for(let i in experience_levels){
            maxExp += experience_levels[i]
        }
        const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer())
        const myFeed = shopinfo["feed"]
        if(maxExp - data.value > myFeed){
            if(Number(PANEL.feed_entry_text.text) < myFeed ||  maxExp == data.value + Number(PANEL.feed_entry_text.text)){
                FeedEntry(myFeed-Number(PANEL.feed_entry_text.text), data)
            }else{
                FeedEntry(maxExp - data.value, data)
            }
        }else if(maxExp - data.value <= myFeed){
            FeedEntry(maxExp - data.value, data)
        }
    }
}
function FeedEntry_Event(n, data){
    return ()=>{
        FeedEntry(n, data)
    }
}
function FeedEntry(n, data){
    $.Msg(Number(PANEL.feed_entry_text.text))
    Game.EmitSound("General.ButtonClick");
    let maxExp = 0
    for(let i in experience_levels){
        maxExp += experience_levels[i]
    }
    PANEL.feed_entry_text.text = Number(PANEL.feed_entry_text.text) + n
    if(Number(PANEL.feed_entry_text.text) < 0){
        PANEL.feed_entry_text.text = 0
    }
    if(data.value + Number(PANEL.feed_entry_text.text) > maxExp){
        PANEL.feed_entry_text.text = maxExp - data.value
    }
    BuildExpDate(data.value + Number(PANEL.feed_entry_text.text))
}
function UpdateButton(name, data){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer())
        const myFeed = shopinfo["feed"]
        if(myFeed < Number(PANEL.feed_entry_text.text)){
            DotaHUD.ShowError("#dota_pets_feed_error")
            return
        }
        GameEvents.SendCustomGameEventToServer("PetsOnFeed", {
            name : name, 
            count : Number(PANEL.feed_entry_text.text),
        })
        PANEL.feed_entry_text.text = 0
    }
}
function OnPressBuyButoon(data, currency){
    return ()=>{
        const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer())
        if(currency == "don" && shopinfo.coins < data.price.don){
            DotaHUD.ShowError("#dota_don_shop_error")
            return
        }
        if(currency == "rp" && shopinfo.mmrpoints < data.price.rp){
            DotaHUD.ShowError("#dota_don_shop_error")
            return
        }
        PANEL.buy_confirm_item_name.text = $.Localize("#pets_buy_confirm_itemname").replace("##item##", $.Localize("#"+data.name))
        PANEL.coufirm_gems_image_pet.SetHasClass("hidden", !(currency == "don"))
        PANEL.coufirm_rp_image_pet.SetHasClass("hidden", !(currency == "rp"))
        PANEL.buy_confirm_price.text = currency == "rp" ? data.price.rp : data.price.don
        const price = currency == "rp" ? data.price.rp : data.price.don
        dropdown_count = 1
        if(data.combinable){
            PANEL.confirm_drop_down.RemoveAllOptions()
            var opCount =  0
            if(currency == "don"){
                opCount = shopinfo.coins / data.price.don
                if(opCount > 10){
                    opCount = 10
                }
            }else if(currency == "rp"){
                opCount = shopinfo.mmrpoints / data.price.rp
                if(opCount > 10){
                    opCount = 10
                }
            }
            for(let i = 1; i <= opCount; i++){
                const new_panel = $.CreatePanel("Label", PANEL.confirm_drop_down, i)
                new_panel.text = i+$.Localize("#pet_pieces")
                PANEL.confirm_drop_down.AddOption(new_panel)
            }
            PANEL.confirm_drop_down.SetSelected('1')

            PANEL.confirm_drop_down.SetPanelEvent("oninputsubmit", function(){
                if(!PANEL.confirm_drop_down){return}
                if(PANEL.confirm_drop_down.GetSelected()){
                    dropdown_count = PANEL.confirm_drop_down.GetSelected().id
                    PANEL.buy_confirm_price.text = price * dropdown_count
                }
            })
            PANEL.confirm_drop_down.SetHasClass("hidden", false)
        }else{
            PANEL.confirm_drop_down.SetHasClass("hidden", true)
        }
        PANEL.confirm_yes_panel.SetPanelEvent("onactivate", ()=>{
            GameEvents.SendCustomGameEventToServer("PetsShop", {name:data.name, amount:dropdown_count,currency:currency})
            HideConfirmPanel()
        })
        PANEL.confirm_drop_down.SetHasClass("hidden", data.combinable != true)
        ShowConfirmPanel()
    }
}
function ShowConfirmPanel(){
    PANEL.buy_coufirm_bg_pet.SetHasClass("hidden", false)
}
function HideConfirmPanel(){
    PANEL.buy_coufirm_bg_pet.SetHasClass("hidden", true)
}
function BuyPet(name){
    return ()=>{
        const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer())
        const obj = FindPetDataByName(name)
        PANEL.buy_confirm_item_name.text = $.Localize("#pets_buy_confirm_itemname").replace("##item##", $.Localize("#"+obj.name))
        PANEL.coufirm_gems_image_pet.SetHasClass("hidden", true)
        PANEL.coufirm_rp_image_pet.SetHasClass("hidden", true)
        PANEL.confirm_drop_down.SetHasClass("hidden", true)
        if(obj.price.rp){
            PANEL.coufirm_rp_image_pet.SetHasClass("hidden", false)
            PANEL.buy_confirm_price.text = obj.price.rp
            if(shopinfo.coins < obj.price.don){
                DotaHUD.ShowError("#dota_don_shop_error")
                return
            }
        }
        if(obj.price.don){
            PANEL.coufirm_gems_image_pet.SetHasClass("hidden", false)
            PANEL.buy_confirm_price.text = obj.price.don
            if(shopinfo.mmrpoints < obj.price.rp){
                DotaHUD.ShowError("#dota_don_shop_error")
                return
            }
        }
        PANEL.confirm_yes_panel.SetPanelEvent("onactivate", ()=>{
            GameEvents.SendCustomGameEventToServer("BuyPet", {name:obj.name})
            HideConfirmPanel()
        })
        ShowConfirmPanel()
    }
}
function ScrollList(eventType, clickBehavior){
    if (eventType == "wheeled") {
        let cursorPos = GameUI.GetCursorPosition();
        let panelPos = PANEL.pet_showcase.GetPositionWithinWindow();
        let width = Number(PANEL.pet_showcase.actuallayoutwidth)
        let height = Number(PANEL.pet_showcase.actuallayoutheight)
        if (Number(panelPos.x) < cursorPos[0] && Number(panelPos.x) + width > cursorPos[0] && Number(panelPos.y) < cursorPos[1] && Number(panelPos.y) + height > cursorPos[1])
        {
            if ( clickBehavior < 0 ){
                SetPage(current_page)
            }
            else if ( clickBehavior > 0 ){
                SetPage(current_page-2)
            }
        }
    }
}
function UpdateAutoPet_Event(name){
    return ()=>{
        Game.EmitSound("General.ButtonClick");
        UpdateAutoPet(name)
    }
}
function UpdateAutoPet(name){
    const panel = FindPanelByName(name)
    if(!panel || !panel.FindChildTraverse("auto_get")) return
    const checked = panel.FindChildTraverse("auto_get").checked
    GameEvents.SendCustomGameEventToServer("ChangeAutoPet", {
        name : name, 
        checked : checked,
    })
    for(let i = 0; i < PANEL.pet_showcase.GetChildCount(); i++){
        for(let j = 0; j < PANEL.pet_showcase.GetChild(i).GetChildCount(); j++){
            if(PANEL.pet_showcase.GetChild(i).GetChild(j) != panel){
                if(PANEL.pet_showcase.GetChild(i).GetChild(j).FindChildTraverse("auto_get")){
                    PANEL.pet_showcase.GetChild(i).GetChild(j).FindChildTraverse("auto_get").SetSelected(false)
                }
            }
        }
    }
}
(()=>{
    CreatePetListPanels();
    CreateOpenButton();
    CreateShop();
    SetPage(0);
    UpdateMoney();
    OpenButton();
    UpdateUI(CustomNetTables.GetTableValue( "Pets", Players.GetLocalPlayer()));
    UpdateCurrentPetPanel();
    HideConfirmPanel();
    CustomNetTables.SubscribeNetTableListener( "Pets", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()) UpdateUI(data)
    });
    CustomNetTables.SubscribeNetTableListener( "shopinfo", (_, key, data)=>{
        if(key == Players.GetLocalPlayer()) {
            UpdateMoney(data)
        }
    });
    CustomNetTables.SubscribeNetTableListener( "cosmetic_buttons", (_, key, data)=>{
        if(key == "pet") UpdateCurrentPetPanel(data)
    });
    DotaHUD.ListenToMouseEvent(CloseWindowOnOutsideClick);
    DotaHUD.ListenToMouseEvent(ScrollList);
})()