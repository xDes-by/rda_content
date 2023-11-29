function CreateShopButtons(){
    PANEL_BP.buy_buttons_panel.RemoveAndDeleteChildren()
    for(let i = 0; i < 3; i++){
        const panel = $.CreatePanel("Panel", PANEL_BP.buy_buttons_panel, "")
        panel.BLoadLayoutSnippet("buy_button")
        let text = $.Localize("#"+shop[i].localize)
        panel.FindChildTraverse("buy_button_image_rp").SetHasClass("hidden", true)
        panel.FindChildTraverse("buy_button_image_coins").SetHasClass("hidden", true)
        if(shop[i].don){
            panel.FindChildTraverse("buy_button_image_coins").SetHasClass("hidden", false)
            text = text.replace("##price##", shop[i].don)
        }
        if(shop[i].rp){
            panel.FindChildTraverse("buy_button_image_rp").SetHasClass("hidden", false)
            text = text.replace("##price##", shop[i].rp)
        }
        text = text.replace("##value##", shop[i].value)
        panel.FindChildTraverse("buy_button_label").text = text
        if(shop[i].tooltip){
            panel.SetPanelEvent("onmouseover", ShowTooltip(shop[i].tooltip, panel))
            panel.SetPanelEvent("onmouseout", HideTooltip())
        }
        panel.SetPanelEvent("onactivate", BuyButton_Event(shop[i].name, shop[i].rp ? "rp" : "don", shop[i].rp ? shop[i].rp : shop[i].don, shop[i].combinable, shop[i].value !=  undefined ? shop[i].value : 0))
    }
}
function UpdateShopButtons(data){
    PANEL_BP.buy_buttons_panel.GetChild(0).SetHasClass("hidden", (data.premium == 1))
}