export const LoginPage = () =>
	<div class="container my-4">
	<h1 class="text-center mb-4">Login Page</h1>
   <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
    
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" />
  </div>
  <div class="form-text"><a href="#">Forgot password?</a></div>

  <br />	
  <button type="submit" class="btn btn-outline-primary">Submit</button>

</form>
</div>