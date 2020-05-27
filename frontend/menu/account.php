<div class="account dropdown">
  <button class="btn btn-lg btn-link dropdown-toggle" type="button" id="account-dropdown-button" data-toggle="dropdown"><span class="fa fa-user"></span><span class="fa fa-caret-down"></span></button>
  <div class="dropdown-menu">
    <li class="dropdown-item" ><p style="padding-left:20px"> Hello, <?= $_SESSION[ 'name' ] ?></p></li>
    <hr />
    <li class="dropdown-item"><a class="reset-password" href="/resetpassword/forgotpass.php">Reset password</a></li>
    <li class="dropdown-item"><a class="logout" href="?logout">Logout</a></li>
  </div>
</div>
