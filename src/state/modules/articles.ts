import { ClientListItemRemark } from '@/__typings__/ClientRemark'

const nameSpace = 'articles'

export class ArticlesState {
  listRemarks: ClientListItemRemark[]
}


export default function articles( state: ArticlesState, action  ) {
  const actions = {
    UPDATE_LIST_REMARKS: (state, { listRemarks }) => ({ ...state, listRemarks })
  }

  if ( action.type && action.type.startsWith( `${ nameSpace }/` ) ) {
    const key = action.type.replace( new RegExp( `^${ nameSpace }\/` ), '' )
    const fn = actions[ key ]
    return fn ? fn( state, action ) : state
  }
  return state
}




