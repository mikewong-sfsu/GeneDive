/**
 *@class			Mixins
 *@breif			Custom mixin class
 *@details
 *@authors		Nayana Laxmeshwar	nlaxmeshwar@mail.sfsu.edu
 *@ingroup		mixin
 */
var Mixins = {
  // Extend an existing object with a method from another
mixin( targetClass, sourceClass ) {
      // provide specific methods
    //   console.log({target: targetClass, sour: sourceClass});
      if ( arguments.length > 2 ) {
          for ( var i = 2, len = arguments.length; i < len; i++ ) {
              targetClass.prototype[arguments[i]] = sourceClass.prototype[arguments[i]];
          }
      }
      // provide all methods
      else {
        //   console.log('====>>>', Object.getOwnPropertyNames(sourceClass.prototype));
          for (var methodName of Object.getOwnPropertyNames(sourceClass.prototype)) { //added by Vaishali
        //   for ( var methodName in sourceClass.prototype ) { //sourceClass.prototype not working 

              // check to make sure the receiving class doesn't
              // have a method of the same name as the one currently
              // being processed (avoid overloading)
              if (methodName != 'constructor' && !Object.hasOwnProperty(targetClass.prototype, methodName) ) {
                  targetClass.prototype[methodName] = sourceClass.prototype[methodName];
              }else{
                  console.error('method does not exist')
              }
        
          }
      }
  }
}

module.exports = Mixins;
