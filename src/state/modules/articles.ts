import { ClientListItemRemark } from '@/__typings__/ClientRemark'
import reduxReducerHelper from '@/state/reduxReducerHelper'

const nameSpace = 'articles'

export class ArticlesState {
  listRemarks: ClientListItemRemark[]
}


export default function articles( state: ArticlesState, action  ) {
  return reduxReducerHelper( {
    UPDATE_LIST_REMARKS: (state, { listRemarks }) => ({ ...state, listRemarks })
  }, nameSpace, state, action  )
}




