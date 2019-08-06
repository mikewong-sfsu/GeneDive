<div class="account dropdown">
  <button class="btn btn-lg btn-link dropdown-toggle" type="button" id="account-dropdown-button" data-toggle="dropdown"><span class="fa fa-user"></span><span class="fa fa-caret-down"></span></button>
  <div class="dropdown-menu">
    <div class="dropdown-item">Hello, <?= $_SESSION[ 'name' ] ?></div>
    <hr />
    <div class="dropdown-item"><a href="/resetpassword/forgotpass.php">Reset password</a></div>
    <div class="dropdown-item"><a href="?logout">Logout</a></div>
  </div>
</div>
