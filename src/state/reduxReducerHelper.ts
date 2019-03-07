export default function reduxReducerHelper(
  actions,
  nameSpace: string,
  state: any,
  action: any
) {
  if ( action.type && action.type.startsWith( `${nameSpace}/` ) ) {
    const key = action.type.replace( new RegExp( `^${nameSpace}\/` ), "" )
    const fn = actions[ key ]
    return fn ? fn( state, action ) : state
  }
  return state
}
