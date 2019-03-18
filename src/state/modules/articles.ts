import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import reduxReducerHelper from '@/state/reduxReducerHelper'

const nameSpace = "articles"

export class ArticlesState {
  // # e.g.
  // foo/bar
  currentCategoryPath: string = null
  listRemarks: ClientListItemRemark[]
}

class Actions {
  UPDATE_CURRENT_CATEGORY_PATH = ( state, { value: currentCategoryPath } ) => ( {
    ...state,
    currentCategoryPath
  } )
  UPDATE_LIST_REMARKS = ( state, { listRemarks } ) => ( { ...state, listRemarks } )
}

export default function articles( state: ArticlesState, action ) {
  return reduxReducerHelper( Actions, nameSpace, state, action )
}
