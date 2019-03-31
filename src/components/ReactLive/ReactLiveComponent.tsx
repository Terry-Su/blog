import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'

export default function ReactLiveComponent(props: any = {}) {
  const { scope = {}, code, noInline = true } = props
  return (
    <LiveProvider scope={scope} noInline={noInline} code={code}>
      <LiveError />
      <LivePreview
        className="markdown-body"
        style={{
          width: "100%",
          height: "100%"
        }}
      />
    </LiveProvider>
  )
}
