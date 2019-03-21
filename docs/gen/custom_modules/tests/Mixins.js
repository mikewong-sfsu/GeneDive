var Mixins = {
  // Extend an existing object with a method from another
mixin( targetClass, sourceClass ) {
      // provide specific methods
      if ( arguments.length > 2 ) {
          for ( var i = 2, len = arguments.length; i < len; i++ ) {
              targetClass.prototype[arguments[i]] = sourceClass.prototype[arguments[i]];
          }
      }
      // provide all methods
      else {
          for ( var methodName in sourceClass.prototype ) {

              // check to make sure the receiving class doesn't
              // have a method of the same name as the one currently
              // being processed (avoid overloading)
              if ( !Object.hasOwnProperty(targetClass.prototype, methodName) ) {
                  targetClass.prototype[methodName] = sourceClass.prototype[methodName];
              }
          }
      }
  }
}

module.exports = Mixins;
