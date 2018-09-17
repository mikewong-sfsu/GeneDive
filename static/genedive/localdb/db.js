/**
 * This class will access a local database that is created by the user
 * @author Jack Cole jcole2@mail.sfsu.edu
 * @date 2018-08-15
 * @ingroup genedive
 *
 */
class LocalDB {

  /**
   *
   * @param controller {GeneDive} The genedive controller
   */
  constructor(controller) {
    this.dbName = 'localDB';

    this.db = new PouchDB(this.dbName);
    this.db.createIndex({
      index: {
        fields: ['geneids1','geneids2',],
      },
    });
    this.controller = controller;
    this.requiredHeaders = new Set();
    this.requiredHeaders.add("journal");
    this.requiredHeaders.add("article_id");
    this.requiredHeaders.add("pubmed_id");
    this.requiredHeaders.add("sentence_id");
    this.requiredHeaders.add("mention1_offset");
    this.requiredHeaders.add("mention2_offset");
    this.requiredHeaders.add("mention1");
    this.requiredHeaders.add("mention2");
    this.requiredHeaders.add("geneids1");
    this.requiredHeaders.add("geneids2");
    this.requiredHeaders.add("probability");
    this.requiredHeaders.add("context");
    this.requiredHeaders.add("section");
    this.requiredHeaders.add("reactome");
    this.requiredHeaders.add("type1");
    this.requiredHeaders.add("type2");
  }

  /**
   *
   * @param tsvString {string} A tab delimited string
   * @returns {Promise}
   */
  addTSVData(tsvString){
    try{
      let delim = "\t";
      let lines = tsvString.split("\n");

      // create headers
      let headers = lines[0].split(delim);
      let headersSet = new Set();
      for( let i in headers)
        headersSet.add(headers[i].trim());

      // Check for missing headers
      let missingHeaders = [];
      console.debug("headersSet", headersSet, "requiredHeaders", this.requiredHeaders);
      this.requiredHeaders.forEach((header)=>{
        console.log(header, headersSet.has(header));
        if(!headersSet.has(header))
          missingHeaders.push(header);
      });

      // If there are some missing, cancel the function
      if(missingHeaders.length > 0){
        this.controller.handleException(`Error: Some headers were missing from the file.`, `Missing headers:`,missingHeaders, `Found headers:`,headers );
        return;
      }

      for(let row = 1; row < lines.length; row++)
      {
        let line_arr = lines[row].split(delim);
        let line = {};
        for(let col = 0; col < line_arr.length; col++){
          line[headers[col]] = line_arr[col];
        }

        line.probability = parseFloat(line.probability);

        this.db.post(line).catch((e)=>console.error(e));
      }
    }catch(error){
      this.controller.handleException(error);
    }
  }

  /**
   *
   * @param ids {Array}
   * @param minConfidence {Number}
   * @returns {Promise}
   */
  getInteractions(ids, minConfidence){
    let filter = {
        selector: {  geneids1: {$in: ids},  geneids2: {$in: ids},  probability : {$gte : minConfidence} }
      };
    return this.db.find(filter)
  }

  /**
   *
   * @returns {Promise}
   */
  deleteAll(){
    let thisClass = this;
    return this.db.allDocs().then(function (result) {
      // Promise isn't supported by all browsers; you may want to use bluebird
      return Promise.all(result.rows.map(function (row) {
        return thisClass.db.remove(row.id, row.value.rev);
      }));
    })
  }

  /**
   *
   * @returns {Promise}
   */
  fetchAll(){
    return this.db.allDocs({include_docs:true});
  }

}