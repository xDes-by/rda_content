


var Admin = {}

Admin.UpdateView = (pid)=>{
    var shopinfo = CustomNetTables.GetAllTableValues("shopinfo")
    this.main = $("#admin_page")
    this.main.GetChild(0).FindChildTraverse("player_gold_label").text = Players.GetGold(pid)
    this.main.GetChild(1).FindChildTraverse("player_gold_label").text = Players.GetLevel(pid)
    this.main.GetChild(2).FindChildTraverse("player_gold_label").text = shopinfo[pid].value.mmrpoints
    this.main.GetChild(3).FindChildTraverse("player_gold_label").text = shopinfo[pid].value.coins
    this.main.GetChild(4).FindChildTraverse("player_gold_label").text = shopinfo[pid].value.feed
    this.main.GetChild(5).FindChildTraverse("create_entity_drop_down").RemoveAllOptions()
    for(let name of this.creeps){
        this.main.GetChild(5).FindChildTraverse("create_entity_drop_down").AddOption($.CreatePanelWithProperties("Label", this.main.GetChild(5).FindChildTraverse("create_entity_drop_down"), name, {text:$.Localize("#"+name)}))
    }
    this.main.GetChild(7).FindChildTraverse("create_entity_drop_down").RemoveAllOptions()
    for(let item of this.items){
        var pan = $.CreatePanelWithProperties("Panel", this.main.GetChild(7).FindChildTraverse("create_entity_drop_down"), item, {class:"item_option"})
        $.CreatePanelWithProperties("DOTAItemImage", pan, "", {class:"item_option_item_image", itemname : item})
        $.CreatePanelWithProperties("Label", pan, "", {class:"item_option_item_text", text : $.Localize("#"+item)})
        
        this.main.GetChild(7).FindChildTraverse("create_entity_drop_down").AddOption(pan)
        pan.SetPanelEvent("onmouseactivate", function(){
            this.main.GetChild(7).FindChildTraverse("create_entity_drop_down").SetSelected(item)
        })
    }
    // $.Msg(shopinfo)

}

Admin.SetValue = (t)=>{
    this.creeps = ["npc_forest_boss","npc_village_boss","npc_mines_boss","npc_dust_boss","npc_swamp_boss","npc_snow_boss","npc_boss_location8", "raid_boss", "raid_new_year", "raid_boss2", "npc_raid_earth", "npc_raid_storm", "npc_raid_fire", "raid_boss3", "raid_boss4"]
    this.items = ["item_forest_soul","item_village_soul","item_mines_soul","item_dust_soul","item_swamp_soul","item_snow_soul","item_divine_soul"]
}
Admin.SetValue()
Admin.UpdateView(Players.GetLocalPlayer())

$("#main_panel").visible = false