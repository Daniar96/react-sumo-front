import { RouterContext } from '../contexts/routerContext'

export const Link = ({}) => {
  return (
    <RouterContext.Consumer>
      {({path}) => <div></div>}
    </RouterContext.Consumer>
  )
}

export default { Link }
