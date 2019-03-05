export default class ClientRemark {
  title: string
  text: string
  path: string
  postTime: number
  comment: number
}

export class ClientListItemRemark {
  title: string
  abstract: string
  // e.g.
  // foo/bar/zoo(foo/bar/zoo/article1/en.md)
  path: string
  route: string
  postTime: string 
}
