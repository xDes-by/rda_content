const CONFIRM = {
    buy_coufirm_bg : $("#buy_coufirm_bg"),
    buy_confirm_item_name : $("#buy_confirm_item_name"),
    coufirm_gems_image_pet : $("#coufirm_gems_image_pet"),
    coufirm_rp_image_pet : $("#coufirm_rp_image_pet"),
    confirm_drop_down : $("#confirm_drop_down"),
    buy_confirm_price : $("#buy_confirm_price"),
    confirm_yes_panel : $("#confirm_yes_panel"),
}
function ThrowAnError(currency, price){
    const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer());
    if(currency == "don" && shopinfo.coins < price){
        DotaHUD.ShowError("#dota_don_shop_error");
        return true;
    }
    if(currency == "rp" && shopinfo.mmrpoints < price){
        DotaHUD.ShowError("#dota_rp_shop_error");
        return true;
    }
    return false;
}
function BuyButton_Event(name, currency, price, combinable, value){
    return  ()=>{
        Game.EmitSound("General.ButtonClick");
        if(ThrowAnError(currency, price) == false){
            BuyButton(name, currency, price, combinable, value);
        }
    }
}
function BuyButton(name, currency, price, combinable, value){
    PrepareConfirm(name, currency, price, combinable, value);
    PrepareDropDown(currency, price);
    ShowConfirmPanel();
    CONFIRM.confirm_yes_panel.SetPanelEvent("onactivate", ()=>{
        const amount = CONFIRM.confirm_drop_down.GetSelected().id;
        GameEvents.SendCustomGameEventToServer("BattlePassBuy", {name:name, amount:amount,currency:currency});
        HideConfirmPanel();
    })
}
function PrepareConfirm(name, currency, price, combinable, value){
    CONFIRM.buy_confirm_item_name.text = $.Localize("#pets_buy_confirm_itemname").replace("##item##", $.Localize("#"+name)).replace("##count##", value);
    CONFIRM.coufirm_gems_image_pet.SetHasClass("hidden", !( currency == "don" ));
    CONFIRM.coufirm_rp_image_pet.SetHasClass("hidden", !( currency == "rp" ));
    CONFIRM.confirm_drop_down.SetHasClass("hidden", !( combinable == true ));
    CONFIRM.buy_confirm_price.text = price;
}
function PrepareDropDown(currency, price){
    CONFIRM.confirm_drop_down.RemoveAllOptions();
    const shopinfo = CustomNetTables.GetTableValue( "shopinfo", Players.GetLocalPlayer());
    let options_count = currency == "don" ? shopinfo.coins / price : shopinfo.mmrpoints / price;
    if(options_count > 10){
        options_count = 10;
    }
    for(let i = 1; i <= options_count; i++){
        const option = $.CreatePanel("Label", CONFIRM.confirm_drop_down, i);
        option.text = i+$.Localize("#pet_pieces");
        CONFIRM.confirm_drop_down.AddOption(option);
    }
    CONFIRM.confirm_drop_down.SetSelected('1');
    CONFIRM.confirm_drop_down.SetPanelEvent("oninputsubmit", function(){
        if(!CONFIRM.confirm_drop_down) return;
        if(CONFIRM.confirm_drop_down.GetSelected()){
            const amount = CONFIRM.confirm_drop_down.GetSelected().id
            CONFIRM.buy_confirm_price.text = price * amount;
        }
    })
}
function ShowConfirmPanel(){
    CONFIRM.buy_coufirm_bg.SetHasClass("hidden", false);
}
function HideConfirmPanel(){
    CONFIRM.buy_coufirm_bg.SetHasClass("hidden", true);
}
(()=>{
    HideConfirmPanel();
})()