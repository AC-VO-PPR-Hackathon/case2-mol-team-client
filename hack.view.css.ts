namespace $ {

	const { rem, px, per } = $mol_style_unit

	$mol_style_define( $my_hack , {

		Speech_bar: {
			padding: rem(.75),
			display: 'flex',
		},

		Speech_text: {
			flex: 'none',
			padding: [ rem(.5) , 0 ],
		},

		Mirror: {
			width: px(600),
			height: px(600),
			position: 'relative',
			zoom: '.5',
			transform: 'scaleX(-1)',
		},

		Camera: {
			position: 'absolute',
			left: '0',
			right: '0',
			top: '0',
			bottom: '0',
			width: per(100),
			height: per(100),
		},

		Skeleton: {
			position: 'absolute',
			left: '0',
			right: '0',
			top: '0',
			bottom: '0',
			width: per(100),
			height: per(100),
		},

	} )

}
