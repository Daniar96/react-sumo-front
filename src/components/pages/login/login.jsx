export const LoginPage = () =>
	<div class="container my-4">
	<br />
	<br />
	<div class="row align-items-first">
	
	<div class="col-md-5">
		<h2 class="text-left mb-4 px-3">Login</h2>
		<div class="rounded-5 shadow p-3 mb-5 bg-body rounded">
	   <form>
	  <div class="mb-3">
	    <label for="login" class="form-label">Username/ Email address</label>
	    <input type="email" class="form-control" id="login"  />
	    
	  </div>
	  <div class="mb-3">
	    <label for="logPassword" class="form-label">Password</label>
	    <input type="password" class="form-control" id="logPassword" />
	  </div>
	  <div class="form-text"><a href="#">Forgot password?</a></div>

	  <br />	
	  <button type="submit" class="btn btn-outline-primary">Login</button>

	</form>
	</div>
	</div>
	<div class="col-md-5 offset-md-1 ">
		<h2 class="text-left mb-4 px-3">Create an account</h2>
		<div class="rounded-5 shadow p-3 mb-5 bg-body rounded">
	   <form>
	   <div class="mb-3">
	    <label for="regUsername" class="form-label">Username</label>
	    <input type="username" class="form-control" id="regUsername" />
	  </div>
	  <div class="mb-3">
	    <label for="regEmail" class="form-label">Email address</label>
	    <input type="email" class="form-control" id="regEmail" />
	  </div>
	  <div class="mb-3">
	    <label for="regPassword" class="form-label">Password</label>
	    <input type="password" class="form-control" id="regPassword" />
	  </div>
	  <div class="mb-3">
	    <label for="regRepeatPassword" class="form-label">Repeat Password</label>
	    <input type="password" class="form-control" id="regRepeatPassword" />
	  </div>
	  

	  <br />	
	  <button type="submit" class="btn btn-outline-primary">Register</button>

	</form>
	</div>
	</div>
	
	</div>
	
</div>