class ProbabilityFilter {

  constructor ( slider, value_display ) {
    this.slider = $(slider);
    this.value_display = $(value_display);
    this.minimum = 0.7;

    // Initialize Bootstrap Slider on element
    this.slider.slider();

    // Slider will always call slideStop at the end of user interaction with
    // the slider, so use this event exclusively. Because min prob is sent to
    // the database, we have to run an entirely new search on every change.
    this.slider.on( "slideStop", ( event ) => {
      this.minimum = event.value;
      this.value_display.text( this.minimum );
      GeneDive.onProbabilitySliderChange();
    });
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
    this.slider.slider('setValue', value)
  }

  reset(){
    this.setMinimumProbability(0.7);
  }
}
