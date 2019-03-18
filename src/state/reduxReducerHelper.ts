export default function reduxReducerHelper(
  Actions,
  nameSpace: string,
  state: any,
  action: any
) {
  if ( action.type && action.type.startsWith( `${nameSpace}/` ) ) {
    const key = action.type.replace( new RegExp( `^${nameSpace}\/` ), "" )
    const actions = new Actions()
    const fn = actions[ key ]
    return fn ? fn( state, action ) : state
  }
  return state
}
