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

		}

		@ $mol_mem
		skeleton_draw() {

			const canvas = this.Skeleton().dom_node() as HTMLCanvasElement
			canvas.width = 600
			canvas.height = 600
			
			const gestures = this.gestures()
			
			const ctx = canvas.getContext('2d')!
			ctx.clearRect(0,0,600,600)
			ctx.strokeStyle = 'blue'
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(600,600);
			ctx.moveTo(0,600);
			ctx.lineTo(600,0);
			ctx.stroke();

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

		enter() {
			const focused = $mol_view_selection.focused()[0] as HTMLElement
			focused.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )
			return true
		}

		exit() {
			const query = '[mol_page_head] [mol_icon_cross]'
			const close = [ ... document.querySelectorAll( query ) ].slice(-1)[0] as HTMLElement
			close.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )
			return true
		}

		go( [ topic ] : [ string ] ) {

			topic = topic.replace( /(а|о|у|е|и|ь|)$/ , '' )

			const query = 'a, button'
			const links = [ ... document.querySelectorAll( query ) ] as HTMLElement[]
			
			console.log(JSON.stringify(topic) )
			for( const link of links ) {
				
				const text = link.textContent?.toLowerCase() ?? ''
				if( text.indexOf( topic ) === -1 ) continue
				
				console.log( link )
				link.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )

				return true
			}

		}
		
		forward() {

			const query = 'a, button'
			const links = [ ... document.querySelectorAll( query ) ] as HTMLElement[]

			const index = links.indexOf( document.activeElement as HTMLElement )
			const next = links[ index + 1 ] ?? links[0]
			
			console.log( next )
			next.focus()

			return true
		}
		
		backward() {

			const query = 'a, button'
			const links = [ ... document.querySelectorAll( query ) ] as HTMLElement[]

			const index = links.indexOf( document.activeElement as HTMLElement )
			const next = links[ index - 1 ] ?? links[ links.length - 1 ]
			
			console.log( next )
			next.focus()

			return true
		}
		
		select() {

			document.activeElement?.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )

			return true
		}
		
	}

}
