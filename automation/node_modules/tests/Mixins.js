class Mixins {
    
    mixin(targetClass, sourceClass) {
        if ( arguments.length > 2 ) {
            for ( var i = 2, len = arguments.length; i < len; i++ ) {
                targetClass.prototype[arguments[i]] = sourceClass.prototype[arguments[i]];
            }
        }else {
            for (var methodName of Object.getOwnPropertyNames(sourceClass.prototype)) { 
                if (methodName != 'constructor' && !Object.hasOwnProperty(targetClass.prototype, methodName)) {
                    targetClass.prototype[methodName] = sourceClass.prototype[methodName];
                } else if (methodName != 'constructor'){
                    console.error('MIXIN: Method not found');
                }
            }
        }
  }
}

module.exports = Mixins;
