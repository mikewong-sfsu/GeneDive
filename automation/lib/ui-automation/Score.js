/**
 * @class     Score
 * @brief     Results confidence score threshold
 * @details   Automates the confidence score threshold slider and preselect buttons
 * @authors   Mike Wong mikewong@sfsu.edu
 * @ingroup   MVC
 */

let Score = (superclass) => class extends superclass {

	// ============================================================
	constructor( page, browser, options ) {
	// ============================================================
		super( page, browser, options );
		this.confidence = { score: {
			setSlider: async ( score ) => { return this.confidenceScoreSetSlider( score ); },
			threshold: async ()        => { return this.confidenceScoreThreshold(); },
			click:     async ( conf )  => { return this.confidenceScoreClick( conf ); },
			low:       async ()        => { return this.confidenceScoreClick( 'low' ); },
			medium:    async ()        => { return this.confidenceScoreClick( 'medium' ); },
			high:      async ()        => { return this.confidenceScoreClick( 'high' ); },
		}}
	}

	async confidenceScoreSetSlider( score ) {

		await this.page.evaluate(( score ) => { 
			GeneDive.probfilter.setMinimumProbability( score ); 
			GeneDive.onProbabilitySliderChange(); 
		}, score ); 

		await this.pageToLoad(); 
		return this.confidence.score.threshold()
	}

	async confidenceScoreThreshold() {
		return await this.page.$eval( '.min-prob-slider-value', el => parseFloat( $( el ).text())); 
	}

	async confidenceScoreClick( conf ) {
		await this.click( `#${conf}-confidence` ); 
		await this.pageToLoad(); 
		return this.confidence.score.threshold();
	}
}

module.exports = Score;
