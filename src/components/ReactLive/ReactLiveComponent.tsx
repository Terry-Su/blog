import React, { Component } from 'react'
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import styled, { createGlobalStyle } from 'styled-components'

const basicScope = {
  React,
  styled
}

export default function ReactLiveComponent(props: any = {}) {
  const { code } = props
  const scope = {
    ...basicScope,
    ...props,
    ...(props.scope || {})
  }
  return (
    <LiveProvider scope={scope} noInline={true} code={code}>
      <LiveError
        style={{
          width: "100%",
          height: "100%"
        }}
      />
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
