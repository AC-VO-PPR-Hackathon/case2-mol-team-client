namespace $.$$ {

	export class $my_hack extends $.$my_hack {

		constructor() {
			super()
			$mol_speech.hearing( true )
		}

		@ $mol_mem
		camera() {

			const getUserMedia = $mol_fiber_sync( ()=> navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					height: 600,
					width: 600,
					facingMode: "user",
				}
			}) )

			return getUserMedia()
		}

		camera_ready() {

			const video = this.Camera().dom_node() as HTMLVideoElement
			video.play()
			
			const get_model = $mol_fiber_sync( ()=> window['handpose'].load() )
			const model = get_model()
	
			let tick = async ()=> {
				const gestures = await model['estimateHands'](video)
				this.gestures(gestures)
				this.gesture_handle(gestures)
				if( tick ) requestAnimationFrame( tick )
			}

			requestAnimationFrame( tick )

		}

		@ $mol_mem
		gestures( next = [] as any[] ) {
			return next
		}

		gesture_handle( gestures : any[] ) {

			if (gestures.length == 0) {
				console.log( 'wait...' )
				return
			}
	
			for (const pred of gestures) {
	
				const index = pred.annotations.indexFinger
				const palm = pred.annotations.palmBase
				const thumb = pred.annotations.thumb
				const middle = pred.annotations.middleFinger
	
				if (isUp(index) && isUp(middle)) {console.log("peace")}
				else if (isUp(thumb)) {console.log("thumb up");this.exit()}
				else if (isRight(thumb)) {console.log("thumb right");this.forward()}
				else if (isDown(index)) {console.log("index down");this.enter()}
				else if (isLeft(index)) {console.log("index left");this.backward()}
	
	
			}

		}

		@ $mol_mem
		skeleton_draw() {

			const canvas = this.Skeleton().dom_node() as HTMLCanvasElement
			canvas.width = 600
			canvas.height = 600
			
			const gestures = this.gestures()
			
			const ctx = canvas.getContext('2d')!
			// ctx.clearRect(0,0,600,600)
			// ctx.strokeStyle = 'blue'
			// ctx.beginPath();
			// ctx.moveTo(0,0);
			// ctx.lineTo(600,600);
			// ctx.moveTo(0,600);
			// ctx.lineTo(600,0);
			// ctx.stroke();

			draw_hands(ctx, gestures)

			return null

		}

		render() {
			super.render()
			this.skeleton_draw()
		}

		speech_text() {
			const commands = $mol_speech.commands()
			return commands[ commands.length - 1 ] || ''
		}

		speech_enabled( next? : boolean ) {
			return $mol_speech.hearing( next )
		}

		exit() {
			const query = '[mol_page_head] [mol_icon_cross]'
			const close = [ ... document.querySelectorAll( query ) ].slice(-1)[0] as HTMLElement

			const links = this.links()
			const uri = document.location.href
			const link = links.find( link => link.href === uri )
			console.log( 'back focus to' , link )
			link?.focus()

			close?.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )

			return true
		}

		go( [ topic ] : [ string ] ) {

			topic = topic.replace( /(а|о|у|е|и|ь|)$/ , '' )

			const links = this.links()
			
			console.log(JSON.stringify(topic) )
			for( const link of links ) {
				
				const text = link.textContent?.toLowerCase() ?? ''
				if( text.indexOf( topic ) === -1 ) continue
				
				console.log( link )
				link.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )

				this.autofocus()

				return true
			}

		}
		
		forward() {

			const links = this.links()

			const index = links.indexOf( document.activeElement! as HTMLAnchorElement )
			const next = links[ index + 1 ] ?? links[0]
			
			console.log( next )
			next.focus()

			return true
		}
		
		backward() {

			const links = this.links()

			const index = links.indexOf( document.activeElement! as HTMLAnchorElement )
			const next = links[ index - 1 ] ?? links[ links.length - 1 ]
			
			console.log( next )
			next.focus()

			return true
		}
		
		enter() {

			document.activeElement?.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )
			this.autofocus()

			return true
		}

		links() {
			const query = 'a'
			const links = [ ... document.querySelectorAll( query ) ] as HTMLAnchorElement[]
			return links
		}

		autofocus() {
			const prev = this.links()
			requestAnimationFrame(()=> requestAnimationFrame(()=> {
				const next = this.links()
				const news = next.filter( link => !prev.includes(link))
				news[0]?.focus()
			}))
		}
		
	}




	function draw_line(ctx:any, dot_1:any, dot_2:any){
		ctx.strokeStyle = 'green'

		ctx.beginPath();
		ctx.moveTo(X(dot_1), Y(dot_1))
		ctx.lineTo(X(dot_2), Y(dot_2))

		ctx.stroke();
	}

	function draw_dot(ctx:any, dot:any){
		ctx.fillStyle = "red"

		ctx.beginPath();
		ctx.arc(X(dot), Y(dot), 3, 0, Math.PI*2, false)
		ctx.fill()
	}

	function draw_all_dot(ctx:any, dots:any[]){
		for (const dot of dots){
			draw_dot(ctx, dot)
		}
	}

	function draw_hands(ctx:any, predictions:any[]) {

		ctx.clearRect(0,0,600,600)
		ctx.lineWidth = '10'

		for (const pred of predictions) {
			const index = pred.annotations.indexFinger
			const thumb = pred.annotations.thumb
			const middle = pred.annotations.middleFinger
			const ringFinger = pred.annotations.ringFinger
			const pinky = pred.annotations.pinky

			const palm = pred.annotations.palmBase

			draw_all_dot(ctx, palm)
			draw_line(ctx, palm[0], index[0])
			draw_line(ctx, palm[0], thumb[0])
			draw_line(ctx, palm[0], middle[0])
			draw_line(ctx, palm[0], ringFinger[0])
			draw_line(ctx, palm[0], pinky[0])

			draw_all_dot(ctx, index)
			draw_line(ctx, index[0], index[1])
			draw_line(ctx, index[1], index[2])
			draw_line(ctx, index[2], index[3])

			draw_all_dot(ctx, thumb)
			draw_line(ctx, thumb[0], thumb[1])
			draw_line(ctx, thumb[1], thumb[2])
			draw_line(ctx, thumb[2], thumb[3])

			draw_all_dot(ctx, middle)
			draw_line(ctx, middle[0], middle[1])
			draw_line(ctx, middle[1], middle[2])
			draw_line(ctx, middle[2], middle[3])

			draw_all_dot(ctx, ringFinger)
			draw_line(ctx, ringFinger[0], ringFinger[1])
			draw_line(ctx, ringFinger[1], ringFinger[2])
			draw_line(ctx, ringFinger[2], ringFinger[3])

			draw_all_dot(ctx, pinky)
			draw_line(ctx, pinky[0], pinky[1])
			draw_line(ctx, pinky[1], pinky[2])
			draw_line(ctx, pinky[2], pinky[3])
		}

	}

	function X( coords:any ) {
		return coords[0]
	} 

	function Y( coords:any ) {
		return coords[1]
	} 

	function bottomX( coords:any[] ) {
		return coords[0][0]
	}
	
		function topX( coords:any[] ) {
		return coords[3][0]
	} 
	
		function bottomY( coords:any[] ) {
		return coords[0][1]
	}
	
		function topY( coords:any[] ) {
		return coords[3][1]
	}
	
	var treshold = 4
	
	function isUp(finger:any[]) {
		const d_x = topX(finger) - bottomX(finger)
		const d_y = topY(finger) - bottomY(finger)
		if (d_x != 0) {
			if (Math.abs(d_y/d_x) > treshold) {
				if(d_y < 0) {
					return true
				}
			}
		}
		return false
		}

	function isDown(finger:any[]) {
		const d_x = topX(finger) - bottomX(finger)
		const d_y = topY(finger) - bottomY(finger)
		if (d_x != 0) {
			if (Math.abs(d_y/d_x) > treshold) {
				if(d_y > 0) {
					return true
				}
			}
		}
		return false
	}

	function isRight(finger:any[]) {
		const d_x = topX(finger) - bottomX(finger)
		const d_y = topY(finger) - bottomY(finger)
		if (d_y != 0) {
				if (Math.abs(d_x/d_y) > treshold) {
					if (d_x < 0){
						return true
				}
			}
		}
		return false
	}

	function isLeft(finger:any[]) {
		const d_x = topX(finger) - bottomX(finger)
		const d_y = topY(finger) - bottomY(finger)
		if (d_y != 0) {
				if (Math.abs(d_x/d_y) > treshold) {
					if (d_x > 0){
						return true
				}
			}
		}
		return false
	}

}
