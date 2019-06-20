/**
 *@class			Redraw Graph
 *@breif			redraw graph functionality
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		Redraw Graph
 */
let Test = require('./Test');
//let RegistrationMixin = require('./../mixin/Registration');
var Mixin = require('./../mixin/Mixin');
//Mixin.mixin( Test, RegistrationMixin );

class RedrawGraph extends Test{
  toString() {
    return "Redraw Graph";
  }

  get priority(){
    return 0;
  }

  get name(){
    return "Redraw Graph";
  }

 execute(){
   const DGR = ["ABI-1"];
   const EVALATE_NUMBER_OF_SETS = "$('.search-item').length";
   return new Promise(async(resolve,reject)=>{
     try{
       await this.startAtSearchPage().catch((reason)=>{reject(reason)});
       await this.searchDGRs(DGR,"1hop").catch((reason)=>{reject(reason)});

       // Check if there is 1 DGR
       var numberOfDGRs = await this.page.evaluate(EVALATE_NUMBER_OF_SETS).catch((reason)=>{reject(reason)});
       if(numberOfDGRs !== 1)
         reject(`Test failed: There should be 1 DGR being searched after adding one set. ${numberOfDGRs} were found.`);
         await this.page.click('span.button-text').catch((reason)=>{reject(reason)});
         var nodes = await this.allNodes().catch((reason)=>{reject(reason)});
         var pivot,pivotNode;
         for (let key in nodes) {
           if (key.search(DGR[0]) !== -1){
             pivot = nodes[key];
             pivotNode = key
           }
         }
         delete nodes[pivotNode];
         await this.checkNodeConsistency(nodes,pivot);
      //if successful
      resolve(this.createResponse(true," Redraw graph tested successfully ",0));
     }
     catch(e){
       reject(e);
     }
   })
 }

checkNodeConsistency(nodes,pivot){
  return new Promise(async(resolve,reject)=>{
    try{
      var maxDistance = 0,maxTheta = 0;
      var theta = [];//list of angles
      for (let key in nodes){
        var pos = nodes[key];
        //calculateDistance between nodes
        let distance = Math.floor(Math.sqrt(Math.pow(pos.y - pivot.y,2) + Math.pow(pos.x - pivot.x,2)));
        //calculate angle between two nodes
        let angle = Math.floor(Math.atan2(pos.y - pivot.y, pos.x - pivot.x) * 180 / Math.PI);
        if(angle < 0)
        angle += 360
        theta.push(angle);

        if(maxDistance == 0 && maxTheta == 0){
          maxDistance = distance;
          maxTheta = 360/(nodes.length-1);
        }
        else{
          if(Math.abs(distance  - maxDistance) > 5)
           reject("edges are inconsistent")
        }
      }
      //check the angle to be approximately equal
      theta.sort((a, b) => b - a);//sort in decending order
      let i = 1;
      while(i < theta.length){
        //toFixed(1) for values rounded to 1 decimal place
        //parseFloat as the value from toFixed() is string
        let diff = parseFloat(Math.abs(theta[i] - theta[i-1])/maxTheta).toFixed(1);
        if(diff > 1.1 || diff < 0.9)
           reject("angles are inconsistent")
        i++;
      }
      //nodes consistent
      resolve();
    }
    catch(e){
      reject(e);
    }
  })
}

 }

module.exports = RedrawGraph ;
