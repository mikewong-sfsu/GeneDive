/**
 * @class   ScoreTest
 * @brief   check varying confidence score
 * @details
 * @authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 * @ingroup SearchTools
 */
const Test    = require( 'Test' );
const Table   = require( '../automation/view/Table' );
const Score   = require( '../automation/Score' );
const mixwith = require( 'mixwith' );
const mix     = mixwith.mix;

class ScoreTest extends mix( Test ). with( Score, Table ) {
	get name() { return "Confidence Score"; }

	execute(){
		return new Promise( async ( resolve, reject ) => {
			try {
				let dgr = 'SFTPA1'; // MW NEED TO PARAMETERIZE THIS LATER

				await this.login();
				await this.oneHop();
				await this.search( dgr );

				// Exercise Confidence Score Threshold Module preset buttons (Low, Medium, High)
				for( let button of [ 'low', 'medium', 'high' ]) {
					let threshold = await this.confidence.score.click( button );
					let results   = await this.table.details();
					let scores    = results.reduce(( scores, cur ) => { scores.push( parseFloat( cur[ 'Max Conf.Score' ])); return scores.concat( cur.details.map( row => parseFloat( row[ 'C. Score' ]))); }, []);
					let pass      = scores.every( score => score >= threshold );
					if( ! pass ) { reject( `Some confidence scores are lower than ${button} threshold (${threshold})` )}
				}

				// Exercise Confidence Score Sliders to arbitrary thresholds
				for( let confidence of [ 0.66, 0.77, 0.88 ]) {
					let threshold = await this.confidence.score.setSlider( confidence );
					let results   = await this.table.details();
					let scores    = results.reduce(( scores, cur ) => { scores.push( parseFloat( cur[ 'Max Conf.Score' ])); return scores.concat( cur.details.map( row => parseFloat( row[ 'C. Score' ]))); }, []);
					let pass      = scores.every( score => score >= threshold );
					if( ! pass ) { reject( `Some confidence scores are lower than ${confidence} threshold (${threshold})` )}
				}

				resolve( this.result( true, 'Confidence score thresholding feature works as tested' ));
			} catch( e ) {
				reject( e );
			}
		});
	}

}

module.exports = ScoreTest;
