// TODO:  - Check for video/image elements
//        - Save original CSS attribute in 'data'
(function( $ ) {
  var methods = {

    on: function( ){

      methods.off.apply(this, arguments);

      return this.each(function(){
        $(window).bind('resize.fullVideo', resize(this));
        
        // Detect zoom changes...
        /*
        var zoom = Math.round(document.documentElement.clientWidth / window.innerWidth);
        setInterval(function(){
          var _zoom = Math.round(document.documentElement.clientWidth / window.innerWidth);
          if(zoom != _zoom){
            resize(this)();
          }
        }, 500);
        */
        resize(this)();
      });

    },

    off: function( ){

      return this.each(function(){
        $(window).unbind('.fullVideo');
      })

    },

  };

  function resize( elem ){

    return function(){
      
      var newWidth, newHeight;

      var r = 1114/627; // TODO: complete ratio
      var R = $(window).width() / $(window).height();

      // Adjust dimensions
      if (R >= r){
        newWidth = $(window).width();
        newHeight = $(window).width() / r;

        $(elem).css("width", $(window).width());
        $(elem).css("height", $(window).width() / r);
      }
      else {
        newWidth = $(window).height() * r;
        newHeight = $(window).height();
      }

      $(elem).css("position", "fixed");
      $(elem).css("z-index", "-9999");
      $(elem).css("width", newWidth);
      $(elem).css("height", newHeight);
      $(elem).css("top", ( $(window).height() - $(elem).height() ) / 2+$(window).scrollTop() + "px" );
      $(elem).css("left", ( $(window).width() - $(elem).width() ) / 2+$(window).scrollLeft() + "px" );

    }
  }

  function log(msg){
     console && console.log(msg);
  }

  $.fn.fullVideo = function( activate ) {
    
    if( methods[ activate ] ){
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if(activate == true){
      return methods.on.apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if(activate == false){
      return methods.off.apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if(typeof activate === 'object' || ! activate){
      return methods.on.apply( this, arguments );
    } else {
      $.error( 'Method ' + activate + ' does not exist on JQuery.fullVideo' );
    }

  };

})( jQuery );
