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
const BUFF_CD_MODIFIERS = 
[
    "",
    "",
    "",
    "modifier_item_armor_aura_cd",
    "modifier_item_base_damage_aura_cd",
    "modifier_item_expiriance_aura_cd",
    "modifier_item_move_aura_cd",
    "modifier_item_attack_speed_aura_cd",
    "modifier_item_hp_aura_cd",
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
        // itemPanel.SetPanelEvent("oncontextmenu", TakeItem(itemname))
        itemPanel.SetPanelEvent("onl", TakeItem(itemname))
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
        const IsControlDown = GameUI.IsControlDown()
        if(updatedCount < 0) return
        itemCountPanel.text = updatedCount
        GameEvents.SendCustomGameEventToServer ("CustomShopStash_TakeItem",{
            itemname : itemname,
            IsControlDown : IsControlDown,
        })
    }
}

function UpdateCooldowns(){
    $.Schedule(1.1, UpdateCooldowns); 
    const PlayerID = Players.GetLocalPlayer()
    const playerIndex = Players.GetPlayerHeroEntityIndex( PlayerID )
    for(let itemname of ITEMS_TO_VIEW){
        const itemPanel = $(`#${itemname}_Panel`)
        itemPanel.FindChildTraverse("ItemCD").visible = false
    }
    for(let buffIndex = 0; buffIndex < Entities.GetNumBuffs( playerIndex ); buffIndex++){
        const buff = Entities.GetBuff( playerIndex, buffIndex )
        const buffName = Buffs.GetName( playerIndex, buff )
        for(let itemname of ITEMS_TO_VIEW){
            const modifierCdName = `modifier_${itemname}_cd`
            const itemPanel = $(`#${itemname}_Panel`)
            if(buffName == modifierCdName){
                const RemainingTime = Buffs.GetRemainingTime( playerIndex, buff )
                itemPanel.FindChildTraverse("ItemCD").text = Math.floor(RemainingTime)
                itemPanel.FindChildTraverse("ItemCD").visible = true
            }
        }
    }
}

(function(){
    GameEvents.Subscribe( "initShop", InitStash)
    GameEvents.Subscribe( "SetShopItemCount", (t)=>{
        const itemname = t.itemname
        if(!itemname || !ITEMS_TO_VIEW.includes(itemname)) return
        const categoryKey = t.categoryKey
        const itemKey = t.itemKey
        const count = t.count
        const itemPanel = $(`#${itemname}_Panel`)
        itemPanel.FindChildTraverse("ItemCount").text = count
        itemPanel.visible = true
    })
    UpdateCooldowns()
})();