import articles, { ArticlesState } from './modules/articles'

export class AppState {
  articles: ArticlesState = new ArticlesState()
}

export default function app(
  state: any = new AppState(),
  action
) {
  return {
    ...state,
    articles: articles( state.articles, action ), 
  }
}