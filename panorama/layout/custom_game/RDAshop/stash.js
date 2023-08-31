const ITEMS_TO_VIEW = 
[
    "item_boss_summon",
    "item_ticket",
    "item_forever_ward",
    "item_armor_aura",
    "item_base_damage_aura",
    "item_expiriance_aura",
    "item_move_aura",
    "item_attack_speed_aura",
    "item_hp_aura",
]

function FindItemInShop(tab, itemname){
    for(let categoryKey in tab){
        if(typeof(tab[categoryKey]) == "string") continue;
        for(let itemKey in tab[categoryKey]){
            if(typeof(tab[categoryKey][itemKey]) == "string") continue;
            if(tab[categoryKey][itemKey].itemname != undefined && tab[categoryKey][itemKey].itemname == itemname){
                return tab[categoryKey][itemKey]
            }
        }
    }
    return false
}

function InitStash(t){
    const ContainerPanel = $("#CustomInventoryList")
    for(let itemname of ITEMS_TO_VIEW){
        const itemPanel = $.CreatePanel("Panel", ContainerPanel, `${itemname}_Panel`)
        itemPanel.BLoadLayoutSnippet("CustomInventorySlot")
        itemPanel.FindChildTraverse("ItemImage").itemname = itemname
        const ItemInfo = FindItemInShop(t, itemname)
        itemPanel.SetPanelEvent("onactivate", TakeItem(itemname))
        if(!ItemInfo){
            itemPanel.visible = false
        }else{
            itemPanel.FindChildTraverse("ItemCount").text = ItemInfo.now
        }
    }
}

function TakeItem(itemname){
    return ()=>{
        const itemPanel = $(`#${itemname}_Panel`)
        const itemCountPanel = itemPanel.FindChildTraverse("ItemCount")
        const updatedCount = Number(itemCountPanel.text) - 1
        if(updatedCount < 0) return
        itemCountPanel.text = updatedCount
        GameEvents.SendCustomGameEventToServer ("CustomShopStash_TakeItem",{
            itemname : itemname
        })
    }
}

(function(){
    GameEvents.Subscribe( "initShop", InitStash)
})();