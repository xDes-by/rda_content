function CreateInventoryItem(data, checked){
    const panel = $.CreatePanel("Panel", PANEL_INVENTORY.inventory_container, "")
    panel.BLoadLayoutSnippet("inventory_particle_item")
    panel.SetPanelEvent("onmouseover", ShowTooltip(data.name, panel))
    panel.SetPanelEvent("onmouseout", HideTooltip())
    panel.FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", true)
    if(checked){
        panel.FindChildTraverse("inventory_particle_toggle").SetSelected(true)
        panel.FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", false)
    }
    if(data.image){
        panel.FindChildTraverse("inventory_particle_image").SetImage(`file://{images}/custom_game/bp/items/${data.image}`)
    }
    return panel
}
function CreateInventory(data){
    projectile_particles_panels = [];
    following_particles_panels = [];
    model_panels = [];
    PANEL_INVENTORY.inventory_container.RemoveAndDeleteChildren()
    for(let i in data['projectile_particles']){
        const particle = data['projectile_particles'][i]
        const panel = CreateInventoryItem(particle, data['auto_projectile_particle'] == particle.name)
        projectile_particles_panels.push(panel)
        panel.SetPanelEvent("onactivate", ClickOnInventoryItem(particle, panel, "projectile"))
        panel.FindChildTraverse("inventory_particle_toggle").SetPanelEvent("onactivate", ClickOnInventoryToggleButton(particle, panel, "projectile"))
    }
    for(let i in data['following_particles']){
        const particle = data['following_particles'][i]
        const panel = CreateInventoryItem(particle, data['auto_following_particle'] == particle.name)
        following_particles_panels.push(panel)
        panel.SetPanelEvent("onactivate", ClickOnInventoryItem(particle, panel, "following"))
        panel.FindChildTraverse("inventory_particle_toggle").SetPanelEvent("onactivate", ClickOnInventoryToggleButton(data, panel, "following"))
    }
    for(let i in data['models']){
        const model = data['models'][i]
        const panel = CreateInventoryItem(model, data['auto_models'][model.hero_name])
        model_panels.push(panel)
        panel.SetPanelEvent("onactivate", ClickOnInventoryItem(model, panel, "model"))
        panel.FindChildTraverse("inventory_particle_toggle").SetPanelEvent("onactivate", ClickOnInventoryToggleButton(data, panel, "model"))
    }
}
function UpdateInventory(data){
    for(let i = 0; i < projectile_particles_panels.length; i++){
        if(data['projectile_particles'][i+1] == undefined) break
        const checked = data['auto_projectile_particle'] == data['projectile_particles'][i+1]['name'] ? true : false
        projectile_particles_panels[i].FindChildTraverse("inventory_particle_toggle").SetSelected(checked)
        projectile_particles_panels[i].FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", !checked)
    }
    for(let i = 0; i < following_particles_panels.length; i++){
        if(data['following_particles'][i+1] == undefined) break
        const checked = data['auto_following_particle'] == data['following_particles'][i+1]['name'] ? true : false
        following_particles_panels[i].FindChildTraverse("inventory_particle_toggle").SetSelected(checked)
        following_particles_panels[i].FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", !checked)
    }
    for(let i = 0; i < following_particles_panels.length; i++){
        if(data['models'][i+1] == undefined) break
        const checked = data['auto_models'][data['models'][i+1]['hero_name']] == true ? true : false
        following_particles_panels[i].FindChildTraverse("inventory_particle_toggle").SetSelected(checked)
        following_particles_panels[i].FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", !checked)
    }
}
function DisableToggle(panel, type){
    if(type == "projectile"){
        for(let item of projectile_particles_panels){
            if(item != panel){
                item.FindChildTraverse("inventory_particle_toggle").SetSelected(false)
                item.FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", true)
            }
        }
    }
    if(type == "following"){
        for(let item of following_particles_panels){
            if(item != panel){
                item.FindChildTraverse("inventory_particle_toggle").SetSelected(false)
                item.FindChildTraverse("inventory_particle_toggle").SetHasClass("hidden", true)
            }
        }
    }
}
function ClickOnInventoryItem(data, panel, type){
    return ()=>{
        ClickButton()
        DisableToggle(panel, type)
        const toggle_panel = panel.FindChildTraverse("inventory_particle_toggle")
        toggle_panel.SetSelected(!toggle_panel.checked)
        toggle_panel.SetHasClass("hidden", !(toggle_panel.checked))
        InventoryItemButton(data, toggle_panel.checked)
    }
}
function ClickOnInventoryToggleButton(data, panel, type){
    return ()=>{
        ClickButton()
        DisableToggle(panel, type)
        const toggle_panel = panel.FindChildTraverse("inventory_particle_toggle")
        toggle_panel.SetHasClass("hidden", !(toggle_panel.checked))
        InventoryItemButton(data, toggle_panel.checked)
    }
}
function InventoryItemButton(data, checked){
    GameEvents.SendCustomGameEventToServer("BattlePassInventoryItemSelect", {name : data.name, checked : checked})
}