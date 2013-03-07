/*
 * Name:          SuperVideo
 * Description:   Great fullscreen and slideshow HTML5 background video!
 * Version:       0.0.1,
 * Author:        Alessio Della Motta 
 *
 * TODO:          - Check for video/image elements
 *                - Better saving original CSS attribute in 'data' (use lists...)
 *                - Detect zoom changes? var zoom = Math.round(document.documentElement.clientWidth / window.innerWidth);
 */               
(function( $ ) {
  
  var _v = []; // Video elements

  var methods = {

    on: function( ){

      //methods.off.apply(this, arguments);
      counter = 0;

      return this.each(function(){
        // Check if the element is a video element and we want that video
        // to take part in the background.
        filter_allowed_elements( this, function(elem) 
        {
          var $this = $(elem),
              data = $this.data('supervideo');

          // Save video initial parameters
          if (!data) {
            //_v.push(elem);
          
            // Insert a specific div for video background
            var div_id = "supervideodiv_" + counter++;
            $('body').append("<div id = '" + div_id + "'></div>")
            $vdiv = $('#' + div_id);

            // Adjust div position and dimensions
            //$vdiv.css("display", 'none');
            $vdiv.css("position", "fixed");
            $vdiv.css("z-index", "-9999");
            $vdiv.css("width", '100%');
            $vdiv.css("height", '100%');
            $vdiv.css("top", '0');
            $vdiv.css("left", '0');

            // Save original data
            $this.data('supervideo', {
              $loc: $this.prev(), // Initial location
              $parent: $this.parent(),
              $vdiv: $vdiv,
              o_width: $this.css("width"),
              o_height: $this.css("height"),
              o_top: $this.css("top"),
              o_left: $this.css("left"),
              o_position: $this.css("position"),
              o_zindex: $this.css("z-index"),
            });

            // Append video to this div and change style
            $this.detach();
            $this.appendTo($vdiv);
          }

          


          //$(window).bind('resize.fullVideo', resize(this));
        
          resize(this)();
        });


      });

    },

    off: function( ){

      return this.each(function(){
        var $this = $(this);

        filter_allowed_elements (this, function(elem)
        {
          var $this = $(elem);

          // Recover original attributes
          $this.detach();
          if (!$this.data('supervideo').$loc.empty()){
            $this.data('supervideo').$loc.after($this);
          }
          else {
            $this.data('supervideo').$parent.prepend($this);
          }
          $this.data('supervideo').$vdiv.remove();
          $this.css("position", $this.data('supervideo').o_position);
          $this.css("z-index", $this.data('supervideo').o_zindex);
          $this.css("width", $this.data('supervideo').o_width);
          $this.css("height", $this.data('supervideo').o_height);
          $this.css("top", $this.data('supervideo').o_top);
          $this.css("left", $this.data('supervideo').o_left);

          // Destroy data
          //$this.removeData('supervideo');

          //$(window).unbind('.fullVideo');

          //_v.pop(elem);
        });
        
      })

    },

  };

  // Select only certain type of elements...
  function filter_allowed_elements(elem, callback){
    if ($(elem).is("video") && $(elem).attr("data-supervideo") !== 'false') {
      callback(elem);
    }
  }





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
      return methods[ activate ].apply( this, Array.prototype.slice.call( arguments, 1 ));
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
