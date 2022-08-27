function TipsOver(message, pos)
{
	// $.Msg('TipsOver')

	if(pos == "openRating"){
		isRatingOpen = true;
	}else if(pos == "openShop"){
		isShopOpen = true;
	}
	
    if ($("#"+pos) != undefined)
    {
       $.DispatchEvent( "DOTAShowTextTooltip", $("#"+pos), $.Localize("#"+message));
    }
}
function TipsOut()
{
    $.DispatchEvent( "DOTAHideTitleTextTooltip");
    $.DispatchEvent( "DOTAHideTextTooltip");
}