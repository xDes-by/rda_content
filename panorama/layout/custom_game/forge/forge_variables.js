"use strict"
// ---------------- CONST ------------------------
const PANEL = {
    items_list : $("#UpgradeItemPanel"),
    empty : $("#StatusPanel"),
    item_information : $("#UpgradeInfoPanel"),
    display_item_icon : $("#ItemIconNew"),
    display_item_current_level : $("#OldLevelItem"),
    display_item_next_level : $("#NewLevelItem"),
    display_item_levelup : $("#UpgradeItemCostPanel"),
    display_item_stones : $("#ExtensionsPanel"),
    button : $("#UpgradeButtonPanel"),
    button_stones : $("#GemsButtonTab"),
    button_levelup : $("#UpdateButtonTab"),
    stone_buttons_panel : $("#GemsMainContainer_Panel"),
    slider_text : $("#GemUpdateAmount"),
    slider : $("#InsertingStonesSlider"),
    display_gems_buff_text : $("#GemBuffDescription"),
};
const GEMS_AMOUNT = 5;
const MAX_LEVEL = 11;
const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
// ----------------- VAR -------------------------
var itemIndex = 0;
var playerDisplayMode = "levelup";
var gems = [];
const max_gems = {
    1 : 150,
    2 : 300,
    3 : 450,
    4 : 600,
    5 : 750,
    6 : 900,
    7 : 1050,
    8 : 1200,
    9 : 1350,
    10 : 1500,
    11 : 2000,
}