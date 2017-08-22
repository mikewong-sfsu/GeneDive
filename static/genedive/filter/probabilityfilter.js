class ProbabilityFilter {

  constructor ( slider, value_display ) {
    this.slider = $(slider);
    this.value_display = $(value_display);
    this.minimum = 0.7;

    // Initialize Bootstrap Slider on element
    this.slider.slider();

    // Update class and view when slider is moved
    this.slider.on("slide", ( event ) => {
      this.minimum = event.value;
      this.value_display.text( this.minimum);
    });

    // Because min prob is sent to the database, we have to
    // run an entirely new search on every change.
    this.slider.on("slideStop", ( event ) => {
      GeneDive.runSearch();
    });
  }

  getMinimumProbability () {
    return this.minimum;
  }
}