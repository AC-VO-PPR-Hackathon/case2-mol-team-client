namespace $.$$ {

	export class $my_hack extends $.$my_hack {

		constructor() {
			super()
			$mol_speech.hearing( true )
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
		}

		exit() {
			const query = '[mol_page_head] [mol_icon_cross]'
			const close = [ ... document.querySelectorAll( query ) ].slice(-1)[0] as HTMLElement
			close.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )
		}

		go( [ topic ] : [ string ] ) {

			const query = 'a, button'
			const links = [ ... document.querySelectorAll( query ) ] as HTMLElement[]
			
			console.log(JSON.stringify(topic) )
			for( const link of links ) {
				
				const text = link.textContent?.toLowerCase() ?? ''
				if( text.indexOf( topic ) === -1 ) continue
				
				console.log( link )
				link.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) )

			}			

		}
		
	}

}
