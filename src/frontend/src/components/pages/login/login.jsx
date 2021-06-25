import { useState } from 'react'
import { loginUser, useUserDispatch, useUserState } from '../../../contexts/userContext'

export const LoginPage = (props) => {
  const { loading, active } = useUserState()
  const dispatch = useUserDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  console.log(props)

  const submitLogin = async (e) => {
    e.preventDefault()
    const res = await loginUser(dispatch, {user: username, password: password})
    if (res.user) {

    }
    props.history.push('/dashboard')
  }

  return (
    <div className="container my-4">
      <br/>
      <br/>
      <div className="row align-items-first">

        <div className="col-md-5">
          <h2 className="text-left mb-4 px-3">Login</h2>
          <div className="rounded-5 shadow p-3 mb-5 bg-body rounded">
            <form>
              <div className="mb-3">
                <label htmlFor="login" className="form-label">Username/ Email address</label>
                <input type="email" className="form-control" id="login" value={username}
                       onChange={e => setUsername(e.target.value)}/>

              </div>
              <div className="mb-3">
                <label htmlFor="logPassword" className="form-label">Password</label>
                <input type="password" className="form-control" id="logPassword" value={password}
                       onChange={e => setPassword(e.target.value)}/>
              </div>
              <div className="form-text"><a href="#">Forgot password?</a></div>

              <br/>
              { loading ?
                <div>loading</div>
                :
                <button type="submit" className="btn btn-outline-primary" onClick={submitLogin}>Login</button>
              }

            </form>
          </div>
        </div>
        <div className="col-md-5 offset-md-1 ">
          <h2 className="text-left mb-4 px-3">Create an account</h2>
          <div className="rounded-5 shadow p-3 mb-5 bg-body rounded">
            <form>
              <div className="mb-3">
                <label htmlFor="regUsername" className="form-label">Username</label>
                <input type="username" className="form-control" id="regUsername"/>
              </div>
              <div className="mb-3">
                <label htmlFor="regEmail" className="form-label">Email address</label>
                <input type="email" className="form-control" id="regEmail"/>
              </div>
              <div className="mb-3">
                <label htmlFor="regPassword" className="form-label">Password</label>
                <input type="password" className="form-control" id="regPassword"/>
              </div>
              <div className="mb-3">
                <label htmlFor="regRepeatPassword" className="form-label">Repeat Password</label>
                <input type="password" className="form-control" id="regRepeatPassword"/>
              </div>


              <br/>
              <button type="submit" className="btn btn-outline-primary">Register</button>

            </form>
          </div>
        </div>

      </div>

    </div>
  )
}