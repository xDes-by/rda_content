const DotaHUD = GameUI.CustomUIConfig().DotaHUD;
const LEVEL_MAX = 50
const talents_experience = CustomNetTables.GetTableValue( "talants" , 'talents_experience')
const second_branch = CustomNetTables.GetTableValue( "talants" , 'second_branch')
const PANEL = {
    talant_root : $("#talant_root"),
    talant_tree_images_panel : $("#talant_tree_images_panel"),
    close_panel_bg : $("#close_panel_bg"),
    talant_img_description : $("#talant_img_description"),
    talant_name_label : $("#talant_name_label"),
    talant_description_buff_label : $("#talant_description_buff_label"),
    button : $("#button"),
    InfoIcon : $("#InfoIcon"),
    talant_description_scale_label : $("#talant_description_scale_label"),
    RDA_level_label : $("#RDA_level_label"),
    normal_level_label : $("#normal_level_label"),
    blue_line_label : $("#blue_line_label"),
    red_line_label : $("#red_line_label"),
    blue_line_panel : $("#blue_line_panel"),
    red_line_panel : $("#red_line_panel"),
    button_label_count : $("#button_label_count"),
    button_label : $("#button_label"),
    talant_description_label : $("#talant_description_label"),
    players_have : $("#players_have"),
    shop : $("#talant-2nd-window"),
    description_gradient_border_out : $("#description_gradient_border_out"),
    arrow_left : $("#arrow_left"),
    arrow_right : $("#arrow_right"),
    store_container : $("#talant-shop"),
    level_info_panel : $("#level_info_panel"),
    cheat_mode_panel : $("#cheat_mode_panel"),
    button_cheat_drop : $("#button_cheat_drop"),
    talent_level_label : $("#talent_level_label"),
    blue_line_label_gain : $("#blue_line_label_gain"),
    red_line_label_gain : $("#red_line_label_gain"),
    activate_second_branch_button_don : $("#activate_second_branch_button_don"),
    activate_second_branch_button_rp : $("#activate_second_branch_button_rp"),
    activate_second_branch_panel : $("#activate_second_branch_panel"),
    activate_second_branch_button_background : $("#activate_second_branch_button_background"),
    activate_second_branch_label : $("#activate_second_branch_label"),
}
var explore = {}
const classes = {
    "int" : ["border_blue"],//border_red
    //6 9 / 7 10/ 8 11
    "int1" : ["talant_icon_6_panel","talant_icon_panel_size_3"],//6
    "int2" : ["talant_icon_5_panel","talant_icon_panel_size_2"],//5
    "int3" : ["talant_icon_11_panel","talant_icon_panel_size_1"],//11
    "int4" : ["talant_icon_10_panel","talant_icon_panel_size_1"],//10
    "int5" : ["talant_icon_9_panel","talant_icon_panel_size_1"],//9
    "int6" : ["talant_icon_2_panel","talant_icon_panel_size_1"],//2
    "int9" : ["talant_icon_1_panel","talant_icon_panel_size_1"],//1
    "int7" : ["talant_icon_8_panel","talant_icon_panel_size_1"],//8
    "int10" : ["talant_icon_7_panel","talant_icon_panel_size_1"],//7  
    "int8" : ["talant_icon_3_panel","talant_icon_panel_size_1"],//3
    "int11" : ["talant_icon_4_panel","talant_icon_panel_size_1"],//4 
    "int12" : ["talant_icon_45_panel","talant_icon_panel_size_1"],//4 
    "int13" : ["talant_icon_49_panel","talant_icon_panel_size_1"],//4 

    "str" : ["border_red"],//border_green

    "str1" : ["talant_icon_13_panel","talant_icon_panel_size_3"],//13
    "str2" : ["talant_icon_22_panel","talant_icon_panel_size_2"],//22
    "str3" : ["talant_icon_18_panel","talant_icon_panel_size_1"],//18
    "str4" : ["talant_icon_17_panel","talant_icon_panel_size_1"],//17
    "str5" : ["talant_icon_19_panel","talant_icon_panel_size_1"],//19
    "str6" : ["talant_icon_16_panel","talant_icon_panel_size_1"],//16
    "str9" : ["talant_icon_12_panel","talant_icon_panel_size_1"],//12
    "str7" : ["talant_icon_15_panel","talant_icon_panel_size_1"],//15
    "str10" : ["talant_icon_14_panel","talant_icon_panel_size_1"],//14
    "str8" : ["talant_icon_21_panel","talant_icon_panel_size_1"],//21
    "str11" : ["talant_icon_20_panel","talant_icon_panel_size_1"],//20
    "str12" : ["talant_icon_46_panel","talant_icon_panel_size_1"],//4 
    "str13" : ["talant_icon_50_panel","talant_icon_panel_size_1"],//4 

    "don" : ["border_gold"],//border_blue
    
    "don1" : ["talant_icon_33_panel","talant_icon_panel_size_3"],//33
    "don2" : ["talant_icon_32_panel","talant_icon_panel_size_2"],//32
    "don3" : ["talant_icon_31_panel","talant_icon_panel_size_1"],//31
    "don4" : ["talant_icon_30_panel","talant_icon_panel_size_1"],//30
    "don5" : ["talant_icon_29_panel","talant_icon_panel_size_1"],//29
    "don6" : ["talant_icon_23_panel","talant_icon_panel_size_1"],//23
    "don9" : ["talant_icon_26_panel","talant_icon_panel_size_1"],//26
    "don7" : ["talant_icon_28_panel","talant_icon_panel_size_1"],//28
    "don10" : ["talant_icon_27_panel","talant_icon_panel_size_1"],//27
    "don8" : ["talant_icon_25_panel","talant_icon_panel_size_1"],//25
    "don11" : ["talant_icon_24_panel","talant_icon_panel_size_1"],//24
    "don12" : ["talant_icon_47_panel","talant_icon_panel_size_1"],//4 
    "don13" : ["talant_icon_51_panel","talant_icon_panel_size_1"],//4 

    "agi" : ["border_green"],//border_gold

    "agi1" : ["talant_icon_34_panel","talant_icon_panel_size_3"],//34
    "agi2" : ["talant_icon_35_panel","talant_icon_panel_size_2"],//35
    "agi3" : ["talant_icon_39_panel","talant_icon_panel_size_1"],//39
    "agi4" : ["talant_icon_40_panel","talant_icon_panel_size_1"],//40
    "agi5" : ["talant_icon_41_panel","talant_icon_panel_size_1"],//41
    "agi6" : ["talant_icon_38_panel","talant_icon_panel_size_1"],//38
    "agi9" : ["talant_icon_44_panel","talant_icon_panel_size_1"],//44
    "agi7" : ["talant_icon_42_panel","talant_icon_panel_size_1"],//42
    "agi10" : ["talant_icon_43_panel","talant_icon_panel_size_1"],//43
    "agi8" : ["talant_icon_37_panel","talant_icon_panel_size_1"],//37
    "agi11" : ["talant_icon_36_panel","talant_icon_panel_size_1"],//36
    "agi12" : ["talant_icon_48_panel","talant_icon_panel_size_1"],//4 
    "agi13" : ["talant_icon_52_panel","talant_icon_panel_size_1"],//4 
};
const EnhancedTalentValues = {
    "int1" : [6, 8, 10, 12, 14, 16],
    "int2" : [2, 2.5, 3.0, 3.5, 4.0, 4.5],
    "int3" : [10, 15, 20, 25, 30, 35],
    "int4" : [0.75, 0.1, 0.125, 0.15, 0.175, 0.2],
    "int5" : [0.1, 0.15, 0.2, 0.25, 0.3, 0.35],

    "str1" : [150, 200, 250, 300, 350, 400],
    "str2" : [1, 2, 3, 4, 5, 6],
    "str3" : [7.5, 10.0, 12.5, 15.0, 17.5, 20.0],
    "str4" : [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
    "str5" : [0.1, 0.15, 0.2, 0.25, 0.3, 0.35],

    "agi1" : [0.1, 0.12, 0.14, 1.16, 0.18, 0.20],
    "agi2" : [6, 8, 10, 12, 14, 16],
    "agi3" : ["10%", "15%", "20%", "25%", "30%", "35%"],
    "agi4" : [0.075, 0.1, 0.125, 0.15, 0.175, 0.2],
    "agi5" : [0.1, 0.15, 0.2, 0.25, 0.3, 0.35],
}
const store = [
    {name:'talant_shop_refresh', description:'talant-shop-refresh-description', image : 'images/custom_game/talants/refresh.png', price : {don:50, rp:250}, value : 1},
    {name:'talant_shop_exp_pack_1', description:'talant-shop-exp-pack-1-description', image : 'images/custom_game/talants/normal_out.png', price : {don:5, rp:50}, value : 1000},
    {name:'talant_shop_exp_pack_2', description:'talant-shop-exp-pack-2-description', image : 'images/custom_game/talants/normal_out.png', price : {don:25, rp:250}, value : 5000},
    {name:'talant_shop_exp_pack_3', description:'talant-shop-exp-pack-3-description', image : 'images/custom_game/talants/normal_out.png', price : {don:50, rp:500}, value : 15000},
    {name:'talant_shop_don_exp_pack_1', description:'talant-shop-don-exp-pack-1-description', image : 'images/custom_game/talants/golden_out.png', price : {don:10}, value : 1000},
    {name:'talant_shop_don_exp_pack_2', description:'talant-shop-don-exp-pack-2-description', image : 'images/custom_game/talants/golden_out.png', price : {don:50}, value : 5000},
    {name:'talant_shop_don_exp_pack_3', description:'talant-shop-don-exp-pack-3-description', image : 'images/custom_game/talants/golden_out.png', price : {don:100}, value : 15000},
]