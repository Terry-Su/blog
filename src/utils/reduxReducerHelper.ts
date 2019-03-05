export default function reduxReducerHelper( actions, nameSpace: string, state: any, action: any  ) {
  const fn = actions[ `${ nameSpace }/${ action.type }` ]
  return fn ? fn( state, action ) : state
}