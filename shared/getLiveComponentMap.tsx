import React from 'react'

import Live from '@/components/Live/Live'

export default function getLiveComponentMap(componentTextMap: any) {
  let res = {}
  let sharing = {}
  for (let key in componentTextMap) {
    const componentText =
      componentTextMap[key] != null ? componentTextMap[key] : ""

    const Component = ({ scope = {} }) => (
      <Live
        code={componentText}
        scope={{
          ...(scope || {}),
          components: {res},
          sharing,
        }}
      />
    )
    res[key] = Component
  }
  return res
}
