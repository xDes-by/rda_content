var index = {}
function UpdateIcons(data){
    for(let i = 0; i < Object.keys(index).length; i++){
        Entities.SetMinimapIcon( index[Object.keys(index)[i]], 'minimap_empty' )
    }
    for(let i = 0; i < Object.keys(data).length; i++){
        Entities.SetMinimapIcon( data[Object.keys(data)[i]], 'minimap_death' )
    }
    index = data
    $.Msg(index)
}

CustomNetTables.SubscribeNetTableListener( "GameInfo", (table_name, key, data)=>{
    if(key != 'bosses') return
    UpdateIcons(data)
});