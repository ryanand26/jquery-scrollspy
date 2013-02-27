/*!
 * Modified version of scrollspy
 * Author: @ryanand26
 * Version: 1.0
 *
 * Based upon jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 */
(function( $, window, undefined ) {
  /**
  * Methods accessible through $('div').mcLarenCounter();
  */
  var methods = {
    init : function (settings) {
      //loop thorugh each passed element
      this.each(function () {
        var scrollSpyInstance = new ScrollSpy(this, settings);

        if (settings.storeOnDom === true) {
          $(this).data('scrollSpy', scrollSpyInstance);
        }

        return this;
      });
      return this;
    },
    destroy : function () {
      //loop thorugh each passed element
      this.each(function () {
        var scrollSpyInstance = $(this).data('looseScrollSpy');

        if (scrollSpyInstance) {
          scrollSpyInstance.destroy();
        }

        return this;
      });
      return this;
    }
  };

  /**
  * Counter dial object definition
  */
  var ScrollSpy = function (targetElemParam, settings) {
    /**
    * PRIVATE VARIABLES
    */
    var defaults = {
      storeOnDom : true,
      min: 0,
      max: 0,
      mode: 'vertical',
      buffer: 0,
      container: window,
      onEnter: $.noop,
      onLeave: $.noop,
      onTick: $.noop
    },
    options = $.extend( {}, defaults, settings ),
    inside = false,
    //counters
    enters = 0,
    leaves = 0,
    //target element
    element = targetElemParam;
    
    /**
    * split seconds into hours, minutes, seconds
    */
    var scrollHandler = function(event){
      var containerLocalVar = $(this),
        $element = $(element),
        position = {
          top: containerLocalVar.scrollTop(),
          left: containerLocalVar.scrollLeft()
        },
        xy = (options.mode == 'vertical') ? position.top + options.buffer : position.left + options.buffer,
        max = options.max,
        min = options.min;
      
      /* fix max */
      if($.isFunction(options.max)){
        max = options.max();
      }

      /* fix max */
      if($.isFunction(options.min)){
        min = options.min();
      }

      if(max === 0){
        max = (mode == 'vertical') ? containerLocalVar.height() : containerLocalVar.outerWidth() + $element.outerWidth();
      }
      
      /* if we have reached the minimum bound but are below the max ... */
      if(xy >= options.min && xy <= max){
        /* trigger enter event */
        if(inside === false) {
          inside = true;
          enters++;
           
          /* fire enter event */
          $element.trigger('scrollEnter', {position: position});
          
          options.onEnter(element, position);
        }
         
        /* triger tick event */
        $element.trigger('scrollTick', {position: position, inside: inside, enters: enters, leaves: leaves});
        
        options.onTick(element, position, inside, enters, leaves);
      }
      else{
        
        if(inside){
          inside = false;
          leaves++;
          /* trigger leave event */
          $element.trigger('scrollLeave', {position: position, leaves:leaves});

          options.onLeave(element, position);
        }
      }
    };

    /**
    * Watch for scrolling
    */
    this.bind = function () {
      /* add listener to container */
      $(options.container).on('scroll touchmove', scrollHandler);

      return this;
    };

    /**
    * Stop watching for scrolling
    */
    this.unbind = function () {
      /* add listener to container */
      $(options.container).off('scroll touchmove', scrollHandler);

      return this;
    };

    /**
    * Remove bindings a element references
    */
    this.destroy = function () {
      this.unbind();

      options.container = null;
      element = null;

      return this;
    };

    /*
    Init
    */
    return this.bind();

  };

  /**
  * Plugin binding
  */
  $.fn.scrollspy = function ( method ) {

    // Method calling logic
    // http://docs.jquery.com/Plugins/Authoring#Namespacing
    if (methods[method]) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    }
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    }
    else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.scrollspy' );
    }
  };

    
})( jQuery, window );
