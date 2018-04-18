class Action {

    async execute(page) {
        throw {name: "NotImplementedError", message: "This object must be inherited for implementation."};
    }

    toString(){
      return "Action class template";
    };

    verifyData() {
        for (let i = 0; i < this.expected_data.length; i++) {

            if (this.action.data[this.expected_data[i]] === undefined) {

                throw {
                    name: "DataMissingError",
                    message: this.action.type + " couldn't find '" + this.expected_data[i] + "' from the action data. Description is: " + this.action.description
                };
            }
        }
        for (let i = 0; i < this.expected_global_data.length; i++)
            if (this.global_data[this.expected_global_data[i]] === undefined)

                throw {
                    name: "DataMissingError",
                    message: this.action.type + " couldn't find '" + this.expected_global_data[i] + "' from the global data. Description is: " + this.action.description
                };


    }
}

module.exports = Action;