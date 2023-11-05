var game_procces = true

const WIDTH = 800
const HEIGHT = 600

game_panel = $("#minigame")
game_panel.style.width = WIDTH + "px"
game_panel.style.height = HEIGHT + "px"


var platform_width = WIDTH * 0.15
var platform_height = HEIGHT * 0.03
var platform_speed = 15
var platform_move_left = false
var platform_move_right = false

var ball_diamert = HEIGHT * 0.03
var ball_speed = 6
var ball_move_x = 0
var ball_move_y = ball_speed
// var first_collide = false

var block_width = WIDTH * 0.075
var block_height = HEIGHT * 0.05
var block_count = 12
var rows = 3
var blocks = []


class CustomPanel {
	constructor(x, y, height, width, color, name) {
		this.height = height
		this.width = width
		this.color = color
		this.name = name
		
		this.panel = $.CreatePanel("Panel", game_panel, this.name)
		this.panel.AddClass(name)
		this.panel.style.height = height + "px"
		this.panel.style.width = width + "px"
		this.panel.style.backgroundColor = this.color
		this.SetPosition(x, y)
	}	
	
	SetPosition(x, y) {
		this.x = x
		this.y = y
		this.panel.style.x = x + "px"
		this.panel.style.y = y + "px"
	}
	
	CheckCollision(rect2) {
		return (
			this.x < rect2.x + rect2.width &&
			this.x + this.width > rect2.x &&
			this.y < rect2.y + rect2.height &&
			this.y + this.height > rect2.y
		);
	}
}

var platform = new CustomPanel((WIDTH - platform_width)/2, HEIGHT - platform_height * 2, platform_height, platform_width, "white", "platform")
var ball = new CustomPanel(WIDTH/2 - ball_diamert/2, HEIGHT/2 - ball_diamert/2, ball_diamert, ball_diamert, "white", "ball")

for (let row = 0; row < rows; row++) {
    for (let i = 0; i < block_count; i++) {
        let x = i * (block_width + WIDTH * 0.007) + WIDTH * 0.01
        let y = row * (block_height + HEIGHT * 0.01) + HEIGHT * 0.05
        blocks.push(new CustomPanel(x, y, block_height, block_width, "white", "block"))
    }
}
	
function MainLoop(){
	if(game_procces){
		if (platform_move_left && platform.x > 0){
			platform.SetPosition(platform.x - platform_speed, platform.y)
		}
		if (platform_move_right && platform.x < WIDTH - platform_width){
			platform.SetPosition(platform.x + platform_speed, platform.y)
		}
		
		// if (platform.CheckCollision(ball)) {
			// if (!first_collide) {
				// ball_move_x = ball_speed * Math.random() < 0.5 ? -1 : 1
				// ball_move_y *= -1
				// first_collide = true
			// }
		// } else {
			// first_collide = false
		// }
		
		if (platform.CheckCollision(ball)) {
			let relativeIntersect = (ball.x + ball.width / 2) - (platform.x + platform.width / 2)
			let increase = relativeIntersect / (platform.width / 2)
			let angle = increase * Math.PI / 4
			ball_move_x = ball_speed * Math.sin(angle);
			ball_move_y = -ball_speed * Math.cos(angle);
			Game.EmitSound("BUTTON_CLICK_MINOR")
		}

		for (let i = 0; i < blocks.length; i++) {
			let block = blocks[i]
			if (ball.CheckCollision(block)) {
				Game.EmitSound("BUTTON_CLICK_MINOR")
				block.panel.DeleteAsync(0)
				blocks.splice(i, 1)
				ball_move_y *= -1
				if (ball_speed < 12) {
					ball_speed += 0.5
				}
				break
			}
		}
		
		if (ball.x < 0 || ball.x + ball.width > WIDTH) {
			ball_move_x *= -1
		}
		if (ball.y < 0) {
			ball_move_y *= -1
		}
		
		if (ball.y + ball.height > HEIGHT){
			restart()
		}
		
		ball.SetPosition(ball.x + ball_move_x, ball.y + ball_move_y)
		
		if (blocks.length == 0){
			game_procces = false
		}
		
		$.Schedule(0.016, MainLoop)
	}else{
		GameEvents.SendCustomGameEventToServer( "EndMiniGame", {} )
	}
}

function restart() {
	ball_move_x = 0
    platform.SetPosition((WIDTH - platform_width) / 2, HEIGHT - platform_height * 2)
    ball.SetPosition(WIDTH / 2 - ball_diamert / 2, HEIGHT / 2 - ball_diamert / 2)
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].panel.DeleteAsync(0);
    }
    blocks = []
	ball_speed = 6
    for (let row = 0; row < rows; row++) {
        for (let i = 0; i < block_count; i++) {
			let x = i * (block_width + WIDTH * 0.007) + WIDTH * 0.01
			let y = row * (block_height + HEIGHT * 0.01) + HEIGHT * 0.05
			blocks.push(new CustomPanel(x, y, block_height, block_width, "white", "block"))
        }
    }
}

function MoveLeftDown(){
	platform_move_left = true
}

function MoveLeftUp(){
	platform_move_left = false
}

function MoveRightDown(){
	platform_move_right = true
}

function MoveRightUp(){
	platform_move_right = false
}


function Controls() {
	const Moving_left = "Moving_left" + Math.floor(Math.random() * 9999)
	Game.AddCommand("+" + Moving_left, MoveLeftDown, "", 0)
	Game.AddCommand("-" + Moving_left, MoveLeftUp, "", 0)
	Game.CreateCustomKeyBind("K", "+" + Moving_left)

	const Moving_right = "Moving_right" + Math.floor(Math.random() * 9999)
	Game.AddCommand("+" + Moving_right, MoveRightDown, "", 0)
	Game.AddCommand("-" + Moving_right, MoveRightUp, "", 0)
	Game.CreateCustomKeyBind("L", "+" + Moving_right)
}

(function () {
	Controls()
	MainLoop()
})()

