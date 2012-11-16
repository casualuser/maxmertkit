;(function ( $, window, document, undefined ) {

	var _name = 'scrollspy'
	,	_defaults = {
			itemSelector: 'li',
			offset: 2,
			animation: true
		}

	Scrollspy = function(element, options) {
		this.name = _name;
		
		this.element = element;
		this.options = $.extend({}, _defaults, options);

		var process = $.proxy( this.process, this );
		this.$scrollable = $(this.element).is('body') ? $(window) : $(this.element);
		$(window).on( 'scroll.' + this.name, process );

		this.init();
		process();
	}

	Scrollspy.prototype._setOptions = function( options_ ) {
		var me  = this;
		var $me = $(me.element);

		$.each( options_, function( key_, value_ ) {
			me._setOption( key_, value_ );
			me.__setOption( key_, value_ );

			var currentOption = { };
				currentOption[ key_ ] = value_;

			if( $.isFunction( value_ ) ) {
				me._on( $me, currentOption );
			}

		});
	}

	Scrollspy.prototype._setOption = function( key_, value_ ) {
		var me  = this;
		var $me = $(me.element);

		switch( key_ ) {
			case 'theme':
				me.El.removeClass( '-' + me.options.theme + '-' );
				me.El.addClass( '-' + value_ + '-' )
			break;

			case 'enabled':
				value_ === true ? me.El.removeClass( '-disabled-' ) : me.El.addClass( '-disabled-' );
			break;
		}
	}

	Scrollspy.prototype._on = function( element_, handlers_ ) {
		var me = this;

		$.each( handlers_, function( event, handler ) {
			element_.bind( event + '.' + me.name, handler );
		});
	}
	
	Scrollspy.prototype.enable = function() {
		var me = this;

		me._setOption( 'enabled', true )
	}

	Scrollspy.prototype.disable = function() {
		var me = this;

		me._setOption( 'enabled', false )
	}

	Scrollspy.prototype.getState = function() {
		return this.state;
	}

	Scrollspy.prototype.init = function() {
		var me = this,
			$me = $(me.element);
		
		me.refresh();
	}

	Scrollspy.prototype.refresh = function() {
		var me = this
		,	$me = $(me.element)
		,	$targets;

		me.targets = $([]);
		me.offsets = $([]);

		$targets = me.$scrollable
			.find( me.options.itemSelector )
			.map( function() {
				var $el = $(this)
				,	href = $el.data('target') || $el.attr('href')
				,	$href = /^#\w/.test(href) && $(href);

				return ( $href
							&& $href.length
							&& [[ $href.position().top, href ]] ) || null 
			})
			.sort( function( a, b ) { return a[0] - b[0] } )
			.each( function() {
				me.offsets.push(this[0]);
				me.targets.push(this[1]);
			});

			console.log(me.offsets, me.targets);
	}

	Scrollspy.prototype.process = function() {
		var me = this
		,	$me = $(me.element)
		,	scrollTop = $(window).scrollTop() + me.options.offset
		,	i;

		for( i = 0; i < me.offsets.length - 1; i++ ) {
			if( me.offsets[i] < scrollTop && scrollTop <= me.offsets[i+1] )
				me.activate( me.targets[i] );
			if( scrollTop > me.offsets[i+1] )
				me.activate( me.targets[i+1] );
		}
	}

	Scrollspy.prototype.activate = function( target_ ) {
		var me = this
		,	$me = $(me.element)
		,	selector
		,	active,
			classes = me.options.animation ? '_active_ -mx-start' : '_active_';

		me.active = target_;
		
		$me
			.find( '._active_' )
				.removeClass( classes );
		
		
		
		// selector = $(target_).data('target') || $(target_).attr('href');

		$( '[data-target="'+ target_ +'"]' )
					.addClass( classes );
		
		active = $('body').find( target_ ).trigger( 'activate' );
	}

	Scrollspy.prototype._getOtherInstanses = function( instanses_ ) {
		var me = this;
		
		return $.grep( instanses_ , function( el ) {
			return $.data($(el[0]), 'kit-' + me.name) !== me;
		});
		
	}

	Scrollspy.prototype._removeInstanse = function( instanses_ ) {
		var me = this;
		
		var what
		,	a = arguments.splice(0,1)
		,	L = a.length
		,	ax;

		while( L && instanses_.length ) {
			what = a[ --L ];
			
			while( (ax = instanses_.indexOf( what ) ) != -1 ){
				instanses_.splice( ax, 1 );
			}
		}

		return me;
	}

	$.fn[_name] = function( options_ ) {
		return this.each(function() {
			if( ! $.data( this, 'kit-' + _name ) ) {
				$.data( this, 'kit-' + _name, new Scrollspy( this, options_ ) );
			}
			else {
				typeof options_ === 'object' ? $.data( this, 'kit-' + _name )._setOptions( options_ ) :
					typeof options_ === 'string' && options_.charAt(0) !== '_' ? $.data( this, 'kit-' + _name )[ options_ ] : $.error( 'What do you want to do?' );
			}
		});
	}

})( jQuery, window, document );