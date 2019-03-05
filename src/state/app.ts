import article, { ArticleState } from './modules/article'
import articles, { ArticlesState } from './modules/articles'

export class AppState {
  articles: ArticlesState = new ArticlesState()
  article: ArticleState  = new ArticleState()
}

export default function app(
  state: any = new AppState(),
  action
) {
  return {
    ...state,
    articles: articles( state.articles, action ), 
    article: article( state.article, action ), 
  }
}