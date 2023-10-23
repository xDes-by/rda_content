function Init()
{
    var contextPanel = $.GetContextPanel();
    var parent = contextPanel.GetParent();
    var customRoot = parent.GetParent();
    var hudRoot = customRoot.GetParent().FindChild( 'HUDElements' );
    var menuButtons = hudRoot.FindChild( 'MenuButtons' );
	menuButtons.AddClass( "HeroDemo" );

	$.RegisterEventHandler( 'DOTAUIHeroPickerHeroSelected', $( '#SelectHeroContainer' ), SwitchToNewHero );

    var UiDefaults = CustomNetTables.GetTableValue( "game_global", "ui_defaults" );

    if( UiDefaults )
    {
		$( '#SpawnCreepsButton' ).SetSelected( UiDefaults["SpawnCreepsEnabled"] );
		$( '#TowersEnabledButton' ).SetSelected( UiDefaults["TowersEnabled"] );
    }

	$.DispatchEvent( 'FireCustomGameEvent_Str', 'RequestInitialSpawnHeroID', null );
}
Init();

function OnThink()
{
	var host_time_scale = Game.GetConvarFloat( "host_timescale" );
	//$.Msg( "HOST TIME SCALE = " + host_time_scale );

	var SpeedButton = $( '#SpeedResetButton' )    
	if ( SpeedButton )
	{
		SpeedButton.SetDialogVariable( "speed", host_time_scale );
	}	
	
	$.Schedule( 0.1, OnThink );
}
$.Schedule( 0.0, OnThink );

var bHeroPickerVisible = false;

function ToggleHeroPicker( bMainHero )
{
	Game.EmitSound( "UI.Button.Pressed" );

	$( '#SelectHeroContainer' ).SetHasClass( 'PickMainHero', bMainHero );

	SetHeroPickerVisible( !bHeroPickerVisible );
}

function EscapeHeroPickerSearch()
{
	//if ( $( "#SelectHeroContainer" ).FindChildTraverse( "HeroSearchTextEntry" ).BHasKeyFocus() )
	//{
	//	$( "#SelectHeroContainer" ).SetFocus();
	//}
	//else
	//{
		SetHeroPickerVisible( false );
	//}
}

function CloseHeroPicker()
{
	SetHeroPickerVisible( false );
}

function SetHeroPickerVisible( bVisible )
{
	if ( bHeroPickerVisible )
	{
		if ( !bVisible )
		{
			$( '#SelectHeroContainer' ).RemoveClass( 'HeroPickerVisible' );
			$( "#SelectHeroContainer" ).FindChildTraverse( "HeroSearchTextEntry" ).text = "";
		}
	}
	else
	{
		if ( bVisible )
		{
			$( '#SelectHeroContainer' ).AddClass( 'HeroPickerVisible' );
			$( "#SelectHeroContainer" ).FindChildTraverse( "HeroSearchTextEntry" ).SetFocus();
		}
	}
	bHeroPickerVisible = bVisible;
}

function SwitchToNewHero( nHeroID )
{
	Game.EmitSound( "UI.Button.Pressed" );


	if ( $( '#SelectHeroContainer' ).BHasClass( 'PickMainHero' ) )
	{
		$.DispatchEvent( 'FireCustomGameEvent_Str', 'SelectMainHeroButtonPressed', String( nHeroID ) );
	}
	else
	{
		$.DispatchEvent( 'FireCustomGameEvent_Str', 'SelectSpawnHeroButtonPressed', String( nHeroID ) );
	}

	$( '#SelectHeroContainer' ).RemoveClass( 'PickMainHero' );

	SetHeroPickerVisible( false );
}

function OnSetPlayerHeroID( event_data )
{
	var PlayerHeroImage = $( '#PlayerHeroImage' );
	if ( PlayerHeroImage != null )
	{
		PlayerHeroImage.heroid = event_data.hero_id;
	}

	var HeroDemoButton = $( '#HeroDemoHeroName' );
	if ( HeroDemoButton != null )
	{
		var heroName = Players.GetPlayerSelectedHero( 0 );
		HeroDemoButton.SetDialogVariable( "hero_name", $.Localize( '#'+heroName ) );
	}
}
GameEvents.Subscribe( "set_player_hero_id", OnSetPlayerHeroID );

function OnSetMainHeroID( event_data )
{

	$.DispatchEvent( "DOTADemoHeroEquippedItems", event_data.hero_name );
}
GameEvents.Subscribe( "set_main_hero_id", OnSetMainHeroID );

function OnSetSpawnHeroID( event_data )
{
	var HeroPickerImage = $( '#HeroPickerImage' );
	if ( HeroPickerImage != null )
	{
		HeroPickerImage.heroid = event_data.hero_id;
	}

	var SpawnHeroButton = $( '#SpawnHeroButton' );
	if ( SpawnHeroButton != null )
	{
		SpawnHeroButton.SetDialogVariable( "hero_name", $.Localize( '#'+event_data.hero_name ) );
	}
}
GameEvents.Subscribe( "set_spawn_hero_id", OnSetSpawnHeroID );

function ToggleCategoryVisibility( str )
{
    //$.Msg( "^^^ToggleCategoryVisibility() - " + str )
    $( str ).ToggleClass( 'CollapseCategory' )
}

function RemoveSelectedHeroes()
{
	var entities = Players.GetSelectedEntities( 0 );

	var numEntities = Object.keys( entities ).length;

	var bDeletionAttempted = false;
    for ( var i = 0; i < numEntities; i++ )
    {
        var entindex = entities[ i ];
        if ( entindex == -1 )
            continue;

		var PlayerOwnerID = Entities.GetPlayerOwnerID( entindex );
		var bIsRealHero = Entities.IsRealHero( entindex );
		if ( PlayerOwnerID == 0 && bIsRealHero )
		{
			$.Msg( 'Skipping ent! ' + entindex );
			continue;	// don't delete the player!
		}

		bDeletionAttempted = true;
		$.DispatchEvent( 'FireCustomGameEvent_Str', 'RemoveHeroButtonPressed', String( entindex ) );
	}

	if ( bDeletionAttempted )
	{
		Game.EmitSound( "UI.Button.Pressed" );
	}
	else
	{
		Game.EmitSound( "General.Cancel" );
	}
}

function ToggleInvulnerability()
{
	var entities = Players.GetSelectedEntities( 0 );
	$.Msg( "Entities = " + entities );

	var numEntities = Object.keys( entities ).length;
	$.Msg( "Num entities = " + numEntities );

    for ( var i = 0; i < numEntities; i++ )
    {
        var entindex = entities[ i ];
        if ( entindex == -1 )
            continue;

		$.DispatchEvent( 'FireCustomGameEvent_Str', 'ToggleInvulnerabilityHero', String( entindex ) );
	}
}

function LevelUpSelectedHeroes()
{
	var entities = Players.GetSelectedEntities( 0 );
	$.Msg( "Entities = " + entities );

	var numEntities = Object.keys( entities ).length;
	$.Msg( "Num entities = " + numEntities );

    for ( var i = 0; i < numEntities; i++ )
    {
        var entindex = entities[ i ];
        if ( entindex == -1 )
            continue;

		$.DispatchEvent( 'FireCustomGameEvent_Str', 'LevelUpHero', String( entindex ) );
	}

	if ( numEntities > 0 )
	{
		Game.EmitSound( "UI.Button.Pressed" );
	}
}

function MaxLevelUpSelectedHeroes()
{
	var entities = Players.GetSelectedEntities( 0 );
	$.Msg( "Entities = " + entities );

	var numEntities = Object.keys( entities ).length;
	$.Msg( "Num entities = " + numEntities );

    for ( var i = 0; i < numEntities; i++ )
    {
        var entindex = entities[ i ];
        if ( entindex == -1 )
            continue;

		$.DispatchEvent( 'FireCustomGameEvent_Str', 'MaxLevelUpHero', String( entindex ) );
	}

	if ( numEntities > 0 )
	{
		Game.EmitSound( "UI.Button.Pressed" );
	}
}

function ResetSelectedHeroes()
{
	var entities = Players.GetSelectedEntities( 0 );
	$.Msg( "Entities = " + entities );

	var numEntities = Object.keys( entities ).length;
	$.Msg( "Num entities = " + numEntities );

	for ( var i = 0; i < numEntities; i++ )
	{
		var entindex = entities[i];
		if ( entindex == -1 )
			continue;

		$.DispatchEvent( 'FireCustomGameEvent_Str', 'ResetHero', String( entindex ) );
	}

	if ( numEntities > 0 )
	{
		Game.EmitSound( "UI.Button.Pressed" );
	}
}

function ShardSelectedHeroes()
{
	var entities = Players.GetSelectedEntities( 0 );
	$.Msg( "Entities = " + entities );

	var numEntities = Object.keys( entities ).length;
	$.Msg( "Num entities = " + numEntities );

    for ( var i = 0; i < numEntities; i++ )
    {
        var entindex = entities[ i ];
        if ( entindex == -1 )
            continue;

		$.DispatchEvent( 'FireCustomGameEvent_Str', 'ShardHero', String( entindex ) );
	}

	if ( numEntities > 0 )
	{
		Game.EmitSound( "UI.Button.Pressed" );
	}
}

function ScepterSelectedHeroes()
{
	var entities = Players.GetSelectedEntities( 0 );
	$.Msg( "Entities = " + entities );

	var numEntities = Object.keys( entities ).length;
	$.Msg( "Num entities = " + numEntities );

    for ( var i = 0; i < numEntities; i++ )
    {
        var entindex = entities[ i ];
        if ( entindex == -1 )
            continue;

		$.DispatchEvent( 'FireCustomGameEvent_Str', 'ScepterHero', String( entindex ) );
	}

	if ( numEntities > 0 )
	{
		Game.EmitSound( "UI.Button.Pressed" );
	}
}

function MouseOverRune( strRuneID, strRuneTooltip )
{
	var runePanel = $( '#' + strRuneID );
	runePanel.StartAnimating();
	$.DispatchEvent( 'UIShowTextTooltip', runePanel, strRuneTooltip );
}

function MouseOutRune( strRuneID )
{
	var runePanel = $( '#' + strRuneID );
	runePanel.StopAnimating();
	$.DispatchEvent( 'UIHideTextTooltip', runePanel );
}

function SlideThumbActivate()
{
	var slideThumb = $.GetContextPanel();
	var bMinimized = slideThumb.BHasClass( 'Minimized' );
	if ( bMinimized )
	{
		Game.EmitSound( "ui_settings_slide_out" );
	}
	else
	{
		Game.EmitSound( "ui_settings_slide_in" );
	}

	slideThumb.ToggleClass( 'Minimized' );
}

function RemoveAllModifiers()
{
	GameEvents.SendCustomGameEventToServer( "RemoveAllModifiers", {iPlayerID:Game.GetLocalPlayerID()} );
}

function ServerCmd(string)
{
	GameEvents.SendCustomGameEventToServer( "ServerCmd", {string:string} );
}

function BattleTeleport()
{
	GameEvents.SendCustomGameEventToServer( "BattleTeleport", {iPlayerID:Game.GetLocalPlayerID()} );
}