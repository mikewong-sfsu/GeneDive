Setup Guide                         {#setup}
============

## Contents
 * [Running GeneDive Locally](#Running Website Locally)
 * [Document Generation](#Document Generation)

 Note: The root genedive directory will be reffered to with *GeneDiveRoot*. So the docs folder in the root directory would be  *GeneDiveRoot/docs/*

## Running GeneDive Locally

### Required Programs

1. **MAMP**: https://www.mamp.info/ Download the free version. When installed, go into preferences and set these options
   * Start/Stop
     * Start page url: /
   * Web Server
     * WebServer: Apache
     * Document Root: *GeneDiveRoot*

### Directory setup

1. Create *GeneDiveRoot/sessions/* directory, if it hasn't already been made.
2. Acquire *data.sqlite* and *users.sqlite* and put them in *GeneDiveRoot/data/*

### Execution

Simply open up MAMP, start the server, and when the Apache and Mysql server have been started it should open your browser to the main page. If it doesn't, click *Open start page*.


## Document Generation

### Required Programs

1. **Doxygen**: https://www.stack.nl/~dimitri/doxygen/  
Generates all the documentation from the source code.
2. **GraphViz**: https://www.graphviz.org/  
Creates graphs for function calls.
3. **NodeJS**: https://nodejs.org/en/  
Automated scripts we made were written in NodeJS to keep everything in Javascript

### Execution

Navigate to *GeneDiveRoot/docs/gen* and execute the command `node generate.js`. Both processes should exit with 0, and the log files generated.