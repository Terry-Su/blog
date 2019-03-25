import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import getDefaultData from '@/helpers/getDefaultData'
import reduxReducerHelper from '@/state/reduxReducerHelper'

const nameSpace = "articles"

export class ArticlesState {
  // # e.g.
  // foo/bar
  currentCategoryPath: string = null
  listRemarks: ClientListItemRemark[]

  constructor() {
    const { newestRemarks = [] } = getDefaultData()
    this.listRemarks = newestRemarks
  }
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
