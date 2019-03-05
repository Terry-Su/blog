import { ClientListItemRemark } from '@/__typings__/ClientRemark'

const nameSpace = 'template'

export class InitialTemplateState {
  item
}


export default function template( state: InitialTemplateState, action  ) {
  const actions = {
    UPDATE_ITEM: ( state, { item } ) => ({ ...state, item })
  }
  const fn = actions[ `${ nameSpace }/${ action.type }` ]
  return fn ? fn( state, action ) : state
}



