const name_label = $("#MainLabel")
const image = $("#MainImage")
const description_label = $("#Description")
const rarity_label = $("#RarityLabel")
function setupTooltip()
{
    const name = $.GetContextPanel().GetAttributeString( "name", "" );
    const image_path = $.GetContextPanel().GetAttributeString( "image_path", "" );
    const image_width = $.GetContextPanel().GetAttributeString( "image_width", "100%" );
    const image_height = $.GetContextPanel().GetAttributeString( "image_height", "" );
    const description = $.GetContextPanel().GetAttributeString( "description", "" );
    name_label.text = name
    image.SetImage(image_path)
    image.style.width = image_width.replace("perc", "%")
    image.style.height = image_height
    description_label.text = description
}