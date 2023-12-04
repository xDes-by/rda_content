const name_label = $("#MainLabel")
const image = $("#MainImage")
const description_label = $("#Description")
const rarity_label = $("#RarityLabel")
const movie = $("#movie")
function setupTooltip()
{
    const name = $.GetContextPanel().GetAttributeString( "name", "" );
    const image_path = $.GetContextPanel().GetAttributeString( "image_path", "" );
    const image_width = $.GetContextPanel().GetAttributeString( "image_width", "100%" );
    const image_height = $.GetContextPanel().GetAttributeString( "image_height", "" );
    const description = $.GetContextPanel().GetAttributeString( "description", "" );
    const is_video = $.GetContextPanel().GetAttributeInt( "is_video", 0 );
    const video = $.GetContextPanel().GetAttributeString( "video", "" );
    name_label.text = name
    if(is_video == 1){
        movie.SetMovie(`s2r://panorama/videos/${video}.webm`)
        movie.style.height = "300px"
    }else{
        image.SetImage(image_path)
        movie.style.height = "0px"
    }
    image.style.width = image_width.replace("perc", "%")
    image.style.height = image_height
    description_label.text = description
}