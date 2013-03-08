/*
 * Name:          SuperVideo
 * Description:   Great fullscreen and slideshow HTML5 background video!
 * Version:       0.0.1-alpha,
 * Author:        Alessio Della Motta 
 *
 * TODO:          - Check for video/image elements
 *                - Better saving original CSS attribute in 'data' (use lists...)
 *                - Detect zoom changes? var zoom = Math.round(document.documentElement.clientWidth / window.innerWidth);
 *                - User constants for elements' id
 */               
(function( $ ) {
  
  var _v = []; // Video elements
  var curr = 0;

  var methods = {

    on: function( ) {
      //methods.off.apply(this, arguments);
      counter = 0;

      $('body').append("<div id='supervideo'></div>");

      $wrapper_div = $('#supervideo');
      $wrapper_div.css("position", "fixed");
      $wrapper_div.css("margin", '0');
      $wrapper_div.css("padding", '0');
      $wrapper_div.css("width", '100%');
      $wrapper_div.css("height", '100%');
      $wrapper_div.css("top", '0');
      $wrapper_div.css("left", '0');

      $wrapper_div.append("<button id='btn_supervideo_next'>Next</div>");
      $wrapper_div.append("<button id='btn_supervideo_prev'>Prev</div>");

      $('#btn_supervideo_next').bind('click', slide_next);
      $('#btn_supervideo_prev').bind('click', slide_prev);

      // Prepare DOM...
      this.each(function(){
        // Check if the element is a video element and we want that video
        // to take part in the background.
        filter_allowed_elements( this, function(elem) 
        {
          if ($(elem).is("video")){ // pausing videos...
            elem.pause();
          }

          var $this = $(elem),
              data = $this.data('supervideo');

          // Save video initial parameters
          if (!data) {
            // Insert a specific div for video background
            var div_id = "supervideodiv_" + counter++;
            $wrapper_div.append("<div id = '" + div_id + "'></div>");
            $vdiv = $('#' + div_id);
            $vdiv.hide();

            _v.push($this);

            // Adjust div position and dimensions
            $vdiv.css("margin", '0');
            $vdiv.css("padding", '0');
            $vdiv.css("position", "absolute");
            $vdiv.css("width", '100%');
            $vdiv.css("height", '100%');
            $vdiv.css("top", '0');
            $vdiv.css("left", '0');
            //$vdiv.css("z-index", '99999');

            // Video ratio
            var ratio = ( elem.videoWidth && elem.videoHeight ) ? elem.videoWidth / elem.videoHeight : 1;
            
            // Save original data
            $this.data('supervideo', {
              $loc: $this.prev(),                   // Initial location
              $parent: $this.parent(),              // Parent element (just in case $loc is empty)
              $vdiv: $vdiv,
              ratio: ratio,                         // Default ratio (unless video metadata are loaded)
              o_width: $this.css("width"),
              o_height: $this.css("height"),
              o_top: $this.css("top"),
              o_left: $this.css("left"),
              o_position: $this.css("position"),
              o_zindex: $this.css("z-index"),
            });

            // Append video to this div and change style.
            $this.detach();
            //$this.appendTo($vdiv);
            $this.clone(false).appendTo($vdiv);
            $this.remove();
            
            $this.css("position", "absolute");
            $this.css("width", '100%');
            $this.css("height", '100%');
            $this.css("top", '0');
            $this.css("left", '0');
            //$this.css("z-index", '99999');

            // Change media data, change ratio...
            $this.bind("loadedmetadata", function () {
              var width = this.videoWidth;
              var height = this.videoHeight;
              $(this).data('supervideo').ratio = width / height;
              resize(elem);
            });

          }

          // Binding for window resize...
          $(window).bind('resize.fullVideo', resize(elem));
        });

      }); // filter
    
      if (_v.length > 0){
        _v[0].data('supervideo').$vdiv.css("display", "block");
        _v[0].addClass('supervideo_current');
      } 

      // Resize after DOM preparing because of window resizing...
      return this.each(function(){
        filter_allowed_elements( this, function(elem) 
        {
          resize(elem)();
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

          // Restore DOM
          if (!$this.data('supervideo').$loc.empty())
            $this.data('supervideo').$loc.after($this);
          else 
            $this.data('supervideo').$parent.prepend($this);

          _v.pop($this);
          $this.data('supervideo').$vdiv.remove();

          $this.css("position", $this.data('supervideo').o_position);
          $this.css("z-index", $this.data('supervideo').o_zindex);
          $this.css("width", $this.data('supervideo').o_width);
          $this.css("height", $this.data('supervideo').o_height);
          $this.css("top", $this.data('supervideo').o_top);
          $this.css("left", $this.data('supervideo').o_left);

          // Destroy data
          $this.removeData('supervideo');

          $('#supervideo').remove();
          $('#btn_supervideo_prev').remove();
          $('#btn_supervideo_next').remove();

          $(window).unbind('.fullVideo');
          
        });
        
      })

    },

  };

  function slide_next( ){
    if (_v.length > 1){
      var next = 0;
      if (curr < _v.length - 1) next = curr + 1;
      var div_old = _v[curr].data('supervideo').$vdiv;
      var div_new = _v[next].data('supervideo').$vdiv;
      if(_v[next].is("video")) _v[next].get(0).play();
      var old = curr;
      curr = next;

      // Custom animation logic:
      var width = $(window).width();
      $(div_new).css("left", width);
      $(div_new).show();

      $(div_old).animate({ "left": "-=" + width + "px" }, 1500, function(){
        $(this).hide();
        if(_v[curr].is("video")) _v[old].get(0).pause();
      });

      $(div_new).animate({"left": "-=" + width + "px"}, 1500);

      _v[old].removeClass('supervideo_current');
      _v[next].addClass('supervideo_current');
    }
  }

  function slide_prev( ){
    if (_v.length > 1){
      var next = _v.length - 1;
      if (curr > 0) next = curr - 1;
      var div_old = _v[curr].data('supervideo').$vdiv;
      var div_new = _v[next].data('supervideo').$vdiv;
      if(_v[next].is("video")) _v[next].get(0).play();
      var old = curr;
      curr = next;

      // Custom animation logic:
      var width = $(window).width();
      $(div_new).css("left", -width);
      $(div_new).show();

      $(div_old).animate({ "left": "+=" + width + "px" }, 1500, function(){
        $(this).hide();
        if(_v[curr].is("video")) _v[old].get(0).pause();
      });

      $(div_new).animate({"left": "+=" + width + "px"}, 1500);

      _v[old].removeClass('supervideo_current');
      _v[next].addClass('supervideo_current');
    }
  }

  /*
   * Elements valid for using in background slideshow...
   */
  function filter_allowed_elements(elem, callback){
    if ($(elem).is("video") && $(elem).attr("data-supervideo") !== 'false') {
      callback(elem);
    }
  }


  /*
   * Main procedure for resizing video element.
   */
  function resize( elem )
  {
    return function(){

      var newWidth, newHeight;
      var ww = $(window).width();
      var wh = $(window).height();
      
      var r = $(elem).data('supervideo').ratio;
      var R = ww / wh;

      var $elem = $(elem);
 
      // Adjust dimensions
      if (R >= r){
        newWidth = ww;
        newHeight = ww / r;
      }
      else {
        newWidth = wh * r;
        newHeight = wh;
      }

      $elem.css("width", newWidth);
      $elem.css("height", newHeight);
      $elem.css("top", ( - ( $elem.height() - wh ) / 2 ) + "px" );
      $elem.css("left", ( - ( $elem.width() - ww ) / 2) + "px" );
    }
  }

  /*
   * jQuery plugin dispatch method
   */
  $.fn.superVideo = function( activate ) {
    
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
