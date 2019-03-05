import React, { Component } from 'react'
import { connect } from 'react-redux'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'

class Props extends DefaultComponentProps {

}

class State {

}



export default connect() (class DisqusComment extends Component<Props, State> {
  private isUnmounting: boolean = false

  componentDidMount() {
    const self = this
    const { dispatch } = this.props
    const { remarkDisqusComment, id: PAGE_IDENTIFIER } = getDefaultData()
    const PAGE_URL = location.href

    dispatch( { type: 'article/DENY_DISQUS_COMMENT_AVAILABLE' } )

    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
    window[ 'disqus_config' ] = function() {
      this.page.url = PAGE_URL // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = PAGE_IDENTIFIER // Replace PAGE_IDENTIFIER with your page's unique identifier variable
      ! self.isUnmounting && dispatch( { type: 'article/ENSURE_DISQUS_COMMENT_AVAILABLE' } )
    }

    setTimeout(() => {
      // DON'T EDIT BELOW THIS LINE
      var d = document,
        s = d.createElement("script")
      s.src = remarkDisqusComment
      s.setAttribute("data-timestamp", (+new Date()).toString())
      ;(d.head || d.body).appendChild(s)
    }, 0)
  }

  componentWillMount() {
    this.isUnmounting = true
  }

  render() {
    return (
      <div>
        <div id="disqus_thread" />
        <noscript>
          Please enable JavaScript to view the{" "}
          <a href="https://disqus.com/?ref_noscript">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    )
  }
})