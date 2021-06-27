import {useEffect, useState} from 'react'
import {loginUser, registerUser, useUserDispatch, useUserState} from '../../../contexts/userContext'

export const LoginPage = (props) => {
  const { loading, active } = useUserState()
  const dispatch = useUserDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [registerUsername, setRegisterUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRepeatPassword, setRegRepeatPassword] = useState('')

  const [loginError, setLoginError] = useState(null)
  const [registerError, setRegisterError] = useState(null)

  const [regBtnDisabled, setRegBtnDisabled] = useState(true)

  // Automatic redirect to dashboard if already logged in
  if (active) {
    props.history.push('/dashboard')
  }

  const submitLogin = async (e) => {
    e.preventDefault()
    const res = await loginUser(dispatch, {username: username, password: password})
    if (res.username) {
      props.history.push('/dashboard')
    } else if (res.error) {
      setLoginError(res.error)
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault()
    const res = await registerUser(dispatch, {username: registerUsername, password: regPassword})
    if (res.username) {
      setUsername(res.username)
      setRegisterError("Registration successful")
      setRegisterUsername('')
      setRegPassword('')
      setRegRepeatPassword('')
    } else if (res.error) {
      setRegisterError(res.error)
    }
  }

  useEffect(() => {
    setRegBtnDisabled(true)
    if (regPassword.length < 6) {
      setRegisterError('password too short')
    } else if (regPassword !== regRepeatPassword) {
      setRegisterError('passwords must match')
    } else {
      setRegisterError('')
      setRegBtnDisabled(false)
    }
  }, [regPassword, regRepeatPassword])

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
                <label htmlFor="login" className="form-label">Email address</label>
                <input autoComplete="off" type="email" className="form-control" id="login" value={username}
                       onChange={e => setUsername(e.target.value)}/>

              </div>
              <div className="mb-3">
                <label htmlFor="logPassword" className="form-label">Password</label>
                <input autoComplete="off" type="password" className="form-control" id="logPassword" value={password}
                       onChange={e => setPassword(e.target.value)}/>
              </div>
              <div className="form-text"><a href="#">Forgot password?</a></div>

              <br/>
              {loginError ? <div>{loginError}</div> : null}
              {loading ?
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
            <form autoComplete="off">
              <div className="mb-3">
                <label htmlFor="regEmail" className="form-label">Email address</label>
                <input autoComplete="off" value={registerUsername} type="email" className="form-control" id="regEmail"
                       onChange={e => setRegisterUsername(e.target.value)}/>
              </div>
              <div className="mb-3">
                <label htmlFor="regPassword" className="form-label">Password</label>
                <input autoComplete="off" value={regPassword} type="password" className="form-control" id="regPassword"
                       onChange={e => setRegPassword(e.target.value)}/>
              </div>
              <div className="mb-3">
                <label htmlFor="regRepeatPassword" className="form-label">Repeat Password</label>
                <input autoComplete="off" value={regRepeatPassword} type="password" className="form-control" id="regRepeatPassword"
                       onChange={e => setRegRepeatPassword(e.target.value)}/>
              </div>


              <br/>
              {registerError ? <div>{registerError}</div> : null}

              <button disabled={regBtnDisabled} type="submit" className="btn btn-outline-primary" onClick={submitRegister}>Register</button>

            </form>
          </div>
        </div>

      </div>

    </div>
  )
}