function FindDotaHudElement(panel) {
	return $.GetContextPanel().GetParent().GetParent().GetParent().FindChildTraverse(panel);
}

function quickstatsPos(){
    var stackable_side_panels = FindDotaHudElement("stackable_side_panels");
    //stackable_side_panels.style.horizontalAlign = "right";
    // stackable_side_panels.style.visibility = "collapse";
    var quickstats = FindDotaHudElement("quickstats");
    quickstats.style.marginTop = "230px";
    var QuickStatsContainer = FindDotaHudElement("QuickStatsContainer");
    QuickStatsContainer.style.backgroundColor = "gradient( linear, 0% 0%, 100% 0%, from( #0000 ), color-stop( .5, #42566355 ), to( #425663cc ) )";
}
function minimapPos(){
    var minimap_container = FindDotaHudElement("minimap_container");
    minimap_container.style.verticalAlign = "bottom";
    //minimap_container.style.height = "100%";
    //minimap_container.hittest = false;
    /*
    var map_bg = $.CreatePanel( "Panel", minimap_container, "" );
    map_bg.style.backgroundColor = "red";
    map_bg.style.width = "320px";
    map_bg.style.height = "320px"; 
    map_bg.style.borderRadius = "200px";
    map_bg.style.horizontalAlign = "right";
    map_bg.style.zIndex = "-100";
    map_bg.style.marginTop = "37px";
    */
    //minimap_container.style.horizontalAlign = "top";
    var minimap_block = FindDotaHudElement("minimap_block");
    minimap_block.style.horizontalAlign = "left";
    minimap_block.style.verticalAlign = "bottom";
    minimap_block.style.marginBottom = "38px";
    minimap_block.style.marginLeft = "20px";
    minimap_block.style.borderRadius = "20px";
    minimap_block.style.marginRight = "3px";
    minimap_block.style.opacity = "0.9";
    var GlyphScanContainer = FindDotaHudElement("GlyphScanContainer");
    GlyphScanContainer.style.horizontalAlign = "right";
    GlyphScanContainer.style.marginLeft = "0";
    GlyphScanContainer.style.marginRight = "170px";
    GlyphScanContainer.style.marginTop = "52px";
    GlyphScanContainer.style.verticalAlign = "top";
    GlyphScanContainer.style.zIndex = "-200";
    GlyphScanContainer.style.backgroundImage = "none";
}

function courierButton(){
    var DeliverItemsButton = FindDotaHudElement("DeliverItemsButton");
    // DeliverItemsButton.style.visibility = "collapse";
}

function TopBar(){
    var TopBarDireTeamContainer = FindDotaHudElement("TopBarDireTeamContainer");
    // TopBarDireTeamContainer.style.visibility = "collapse";
    //var TopBarRadiantTeam = FindDotaHudElement("TopBarRadiantTeam");
    //TopBarRadiantTeam.style.visibility = "collapse";
}

function agha(){
    var AghsStatusShard = FindDotaHudElement("AghsStatusShard");
    // AghsStatusShard.style.visibility = "collapse";
    var BottomSection = FindDotaHudElement("BottomSection");
    // BottomSection.style.visibility = "collapse";
}
(function() {
	$.Schedule(1.0, quickstatsPos);
    //$.Schedule(1.0, minimapPos);
    $.Schedule(1.0, courierButton);
    $.Schedule(1.0, TopBar);
    //$.Schedule(1.0, agha);
})();
