<?php 
  require_once( "session.php" );
  require_once( "datasource/proxy.php" );
  $selection_file = "/usr/local/genedive/data/sources/selection.json";
  $use_native_ds  = true; // The native datasources are selected by default
  if( file_exists( $selection_file )) {
    $selected      = json_decode( file_get_contents( $selection_file ), true );
    $ds            = $selected[ 'datasources' ];
    $use_pharmgkb  = in_array( 'pharmgkb', $ds );
    $use_deepdive  = in_array( 'plos-pmc', $ds );
    $use_native_ds = in_array( 'native', $ds ) || $use_pharmgkb || $use_deepdive;
    $sans_native   = array_filter( $ds, function ( $source ) { return $source != "native" && $source != "pharmgkb" && $source != "plos-pmc"; });
  }

  // Local datasources selected; no need for login
  if( ! $use_native_ds ) {
    $_SESSION[ 'is_auth' ] = true;
    $_SESSION[ 'name' ]    = 'Local User';
    header( 'Location: search.php' );
  }
?>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>GeneDive</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="static/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="static/genedive/index.css">
    <link rel="stylesheet" href="static/alertify/css/alertify.min.css">
    <link rel="stylesheet" href="static/alertify/css/alertify.bootstrap.min.css">
    <script src="static/jquery/jquery-3.2.1.min.js"></script>
    <script src="static/alertify/js/alertify.min.js"></script>
    <script src="static/genedive/alertify-defaults.js"></script>
</head>
<body>

<?php if( ! preg_match( '/\bchrome\b/i', $_SERVER[ 'HTTP_USER_AGENT' ] )): ?>
<script>
  alertify.error( 'GeneDive is developed and tested on <b>Google Chrome</b> and might not work with your browser. <a class="btn btn-primary" href="https://google.com/chrome/" style="margin-top: 12px" target="_blank">Get Google Chrome</a>', 90 );
</script>
<?php endif; ?>
<div class="landing">

  <div class="strip">
    <div class="about">
      <h2>GeneDive</h2>
      <h4>Gene, Drug, and Disease Interaction Search and Visualization Tool</h4>
      <p>GeneDive is a powerful but easy-to-use application that can search, sort, group, filter, highlight, and visualize interactions between drugs, genes, and diseases (DGR).  GeneDive also facilitates topology discovery through the various search modes that reveal direct and indirect interactions between DGR.  The search results, in textual and graphical form, can be downloaded along with the search settings to easily restart the session at later time.
         Refer to <a target="_blank" href="//www.ncbi.nlm.nih.gov/pubmed/29218917">Previde et al., 2018</a> for more details.</p>
      <p>GeneDive is a joint project between the Computer Science Department at San Francisco State University, and the Bioengineering Department at Stanford University.</p>
      <p id="citation">To cite this work, please use the following publication:
         Previde P., Thomas B., Wong M., Mallory E., Petkovic D., Altman R., and Kulkarni A. (2018) <a target="_blank" href="//www.ncbi.nlm.nih.gov/pubmed/29218917">GeneDive: A Gene Interaction Search and Visualization Tool to Facilitate Precision Medicine.</a> In the Proceedings of Pacific Symposium on Biocomputing, Vol 23, pp. 590-601. January 2018.</p>
    </div>


    <div class="login">
      <form>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Email Address" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
          <a class="forgot-password" href="resetpassword/forgotpass.php">Forgot your password?</a>
        </div>
        <button id="login-submit" name="login-submit" class="btn btn-primary">Login</button> or <a class="register" href="registration.php">Register</a>
      </form>
      <script>
        $( '#login-submit' ).off( 'click' ).click(( ev ) => {
          ev.preventDefault();

          let data = { email : $( '#email' ).val(), password: $( '#password' ).val(), proxy: <?php echo $use_native_ds ? 'true' : 'false' ?>, 'login-submit' : true };
          console.log( 'SENDING', data );
          $.post({
            url: <?php if( $use_native_ds ) { echo "\"$server/login.php\""; } else { echo "\"login.php\""; } ?>,
            data: data,
            timeout: 3000,
            cache: false
          })

          // Receive response from server
          .done(( response ) => {
            response = JSON.parse( response );
            console.log( 'RESPONSE', response );
            if( response.error ) { alertify.error( response.error, 30 ); return; }
            if( response.is_auth ) { 
              response[ 'login-submit' ] = true;
              // Propogate session token to proxy
              $.post( 'login.php', response )
              .done(( response ) => { console.log( response ); window.location = 'search.php';})
              .fail(( error ) => { console.log( error ); })
            }
          })

          // No response from server
          .fail(( error ) => {
            console.log( 'ERROR', error );
            if( error.readyState == 0 ) { // Request not sent; network error

              alertify.error( 'Server not available<br><?php if( $use_native_ds ): ?>PharmGKB and DeepDive/PLoS-PMC are<?php elseif( $use_pharmgkb ): ?>PharmGKB is<?php elseif( $use_deepdive ): ?>DeepDive on PLoS-PMC is<?php endif ?> not available and will be removed from selected datasources', 30 );

              let dsl = '<?=base64_encode( json_encode( $sans_native ))?>';
              $.get({ url:  `datasource/change.php?value=${dsl}` })
              .done(( message ) => {
                console.log( 'CHANGE DS', message );
                setTimeout(() => { window.location = 'search.php';}, 3000 );
              })
              .fail(( error ) => {
              });
            }
          });
        });
      </script>

      <!--  Display Success Message -->
      <?php 
        if ( isset($_SESSION[ 'message' ] ) ) {

          $message = $_SESSION[ 'message' ];

          echo '<div class="alert alert-success" role="alert">';
          echo "<strong>$message</strong>";
          echo '</div>';

          $_SESSION['message'] = NULL;
        }
      ?>

      <!--  If registration throws an alert back, display it. -->
      <?php 
        if ( isset($_SESSION[ 'error' ] ) ) {

          $error = $_SESSION[ 'error' ];

          echo '<div class="alert alert-danger" role="alert">';
          echo "<strong>$error</strong>";
          echo '</div>';

          $_SESSION['error'] = NULL;
        }
      ?>
    </div>
  </div>

  <div class="footer">
    <a href="privacy.html" target="_blank">Privacy / T&C</a>
  </div>

</div>

</body>
</html>
