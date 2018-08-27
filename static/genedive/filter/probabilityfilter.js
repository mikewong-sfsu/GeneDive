class ProbabilityFilter {

    constructor ( slider, value_display, button_group ) {
        this.slider        = $(slider);

        this.value_display = $(value_display);
        this.minimum       = 0.7;
        this.confidence    = {
            low:    { button: $( button_group + '>#low-confidence' ),    cutoff: 0.70 },
            medium: { button: $( button_group + '>#medium-confidence' ), cutoff: 0.85 },
            high:   { button: $( button_group + '>#high-confidence' ),   cutoff: 0.95 }
        };

        // Initialize Bootstrap Slider on element
        this.slider.slider(this.minimum);

        // Use closure to initialize button click behavior
        for( var key in this.confidence ) {
            (( key ) => {
                var button = this.confidence[ key ].button;
            var cutoff = this.confidence[ key ].cutoff;

            button.off( 'click' ).on("click", ( event ) => {
                this.setMinimumProbability( cutoff );
            GeneDive.onProbabilitySliderChange();
        });
        })( key );
        }

        // Slider will always call slideStop at the end of user interaction with
        // the slider, so use this event exclusively. Because min prob is sent to
        // the database, we have to run an entirely new search on every change.
        this.slider.on( "slideStop", ( event ) => {
            this.setMinimumProbability(event.value);
        this.value_display.text( this.minimum );
        GeneDive.onProbabilitySliderChange();
    });

        // Initialize Bootstrap Slider
        this.setColor(this.minimum);
    }

    getMinimumProbability () {
        return this.minimum;
    }
    /**
     @fn       ProbabilityFilter.setMinimumProbability
     @brief    Sets the probability of the slider
     @details  This sets the probability and the display. Primarily used for state setting.
     @param    value Min 0.0, Max 1.0. The amount to set.
     @callergraph
     */
    setMinimumProbability(value){
        // Checks if the value is valid
        if(typeof(value) !== typeof(0.0) || value < 0.0 || value > 1.0)
            throw "ValueError: value must be from 0.0 to 1.0";
        this.minimum = value;
        this.value_display.text( this.minimum );
        this.slider.slider('setValue', value);
        this.setColor(value);
    }

  /**
   * Changes the color of the slider as different values are set.
   * @param value
   */
  setColor(value) {
      // Looks ugly so disabled for now
    return;
      let element = $(".slider-handle");
        if(value < this.confidence["medium"].cutoff)
          element.css('background', '#ac2925');
        else if (value < this.confidence["high"].cutoff)
          element.css('background','#f0ad4e');
        else
          element.css('background','#5cb85c');
    }

    reset(){
        this.setMinimumProbability(0.7);
    }

    hideProbabilityFilter(){
      $('.module.probability-module').hide();
    }

    showProbabilityFilter(){
      $('.module.probability-module').show();
    }
}
