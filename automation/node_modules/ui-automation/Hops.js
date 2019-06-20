/**
 *@class Hops
 *@brief Search modes - 1Hop, 2Hop, 3Hop, Clique
 *@details
 *@authors Mike Wong mikewong@sfsu.edu, Nayana Laxmeshwar nlaxmeshwar@mail.sfsu.edu
 *@ingroup Features
 */
const TABLE_COL = [ "DGR1", "DGR2" ];
class Interactions {
  toString() {
    return "Interactions";
  }

  get priority() {
    return 0;
  }

  get name(){
  return "Interactions";
  }
//OneHop test
  checkOneHop( DGR, tableContents ) {
  return new Promise(( resolve, reject ) => {
  try {
  for( let row in tableContents ) {
    let foundFlag = false;
    for(let i in DGR){
      //test direct interaction with DGR
      //check if the gene is present in either 1st or 2nd column
      if( tableContents[row][TABLE_COL[0]].indexOf(DGR[i])!== -1 || tableContents[row][TABLE_COL[1]].indexOf(DGR[i])!== -1 ) {
        foundFlag = true;
        break;
      }
    }
      if( !foundFlag )
      reject( `direct interaction of ${DGR} is not present` );
  }
    //test passed successfully
    resolve();
  }catch(e){
    console.log(e);
    reject(e);
  }
});
  }

  //NHop test
	checkNHop(DGR,tableContents,N){
	return new Promise((resolve,reject)=>{
		try{
			if(DGR.length < 2)
				reject("Minimum 2 DGR required");
			var DGRset = new Set();

			//add the DGR in the DGR list
			for(let row in DGR){
				DGRset.add(DGR[row])
			}
			//find intermediate gene
			var direct = false;
			for(let row in tableContents){
				//check with 1st DGR
				if(DGRset.has(tableContents[row][TABLE_COL[0]])){
					if(DGRset.has(tableContents[row][TABLE_COL[1]]))
						direct = true;
					else
						DGRset.add(tableContents[row][TABLE_COL[1]]);
				}
				//check with 2nd DGR
				else if(DGRset.has(tableContents[row][TABLE_COL[1]])){
					if(DGRset.has(tableContents[row][TABLE_COL[0]]))
						direct = true;
					else
						DGRset.add(tableContents[row][TABLE_COL[0]]);
				}
			}
			if(DGRset.length > N+1)
				reject(`More than ${N} Hop present`);
			//test passed successfully
			resolve();
		}catch(e){
			console.log(e);
			reject(e);
		}
	});
	}

  //clique test
  checkClique(DGR,tableContents){
    return new Promise((resolve,reject)=>{
      try{
        if(DGR.length > 1)
          reject("Clique mode limited to 1 gene");
        var foundFlag = false;
        var directInteraction = new Set();
        directInteraction.add(DGR[0]);
        //find all the direct interactions with the given Gene
        for(let row in tableContents){
          //check if the given gene is in DGR1
          if(tableContents[row][TABLE_COL[0]].indexOf(DGR[0])!== -1){
            directInteraction.add(tableContents[row][TABLE_COL[1]]);
            tableContents[row][TABLE_COL[0]] = DGR[0];
          }
          //check if the given gene is in DGR2
          else if(tableContents[row][TABLE_COL[1]].indexOf(DGR[0])!== -1){
            directInteraction.add(tableContents[row][TABLE_COL[0]]);
            tableContents[row][TABLE_COL[1]] = DGR[0];
          }
        }
        //find all the interactions of the interactants
        for(let row in tableContents){
        //check if any of the genes are other than the DGR or its interactants
        if(!(directInteraction.has(tableContents[row][TABLE_COL[1]]) ||
              directInteraction.has(tableContents[row][TABLE_COL[0]]))){
          reject("Invalid interactions found");
        }
        }
        //test passed successfully
        resolve();
      }catch(e){
        console.log(e);
        reject(e);
      }
    });
  }
}
module.exports = Interactions;
