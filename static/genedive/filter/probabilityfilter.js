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
}
