GameEvents.Subscribe("SelectUnit",function(t){
    const entityIndex = t.entityIndex
    const bAddToGroup = t.bAddToGroup
    GameUI.SelectUnit( entityIndex, bAddToGroup )
})