import React from 'react'

import ReactLiveComponent from '@/components/ReactLive/ReactLiveComponent'

export default function getReactLiveComponentMap(componentTextMap: any) {
  let res = {}
  let sharing = {}
  for (let key in componentTextMap) {
    const componentText =
      componentTextMap[key] != null ? componentTextMap[key] : ""
    const Component = props => (
      <ReactLiveComponent
        {...props}
        code={componentText}
        components={res}
        sharing={sharing}
      />
    )
    res[key] = Component
  }
  return res
}
