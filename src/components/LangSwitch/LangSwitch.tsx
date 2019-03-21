import React, { Component } from 'react'
import styled from 'styled-components'

import DefaultComponentProps from '@/__typings__/DefaultComponentProps'
import getDefaultData from '@/helpers/getDefaultData'
import * as names from '@locale/names'
import specialNameMap, { getSpeciaLocalelName } from '@locale/specialNameMap'

class Props extends DefaultComponentProps {}

class State {}

const langMap = {
  [names.EN]: "ENGLISH",
  [names.ZH_CN]: "中文版"
}

const StyledLink = styled.a`
  font-size: 15px;
  letter-spacing: 1px;
  color: #4169e1;
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`

export default class LangSwitch extends Component<Props, State> {
  componentDidMount() {}

  get currentLocale(): string {
    const { locale } = getDefaultData()
    return locale
  }

  get showingNames(): string[] {
    const { availableOtherLocales } = getDefaultData()

    // # indicate current page isn't an markdown page
    if (availableOtherLocales === undefined) {
      return Object.values(names)
    } else {
      return Object.values(names).filter(name =>
        availableOtherLocales.includes(name)
      )
    }
  }

  getHref(name: any): string {
    if (!Object.values(names).includes(name)) {
      return "#"
    }

    const specialName = getSpeciaLocalelName(name)

    if (this.currentLocale !== name) {
      if (this.currentLocale === names.EN) {
        return `/${specialName}${location.pathname}`
      }
      if (this.currentLocale !== names.EN) {
        const pathnames = location.pathname.split("/")
        const end = pathnames.slice(2, pathnames.length).join("/")
        if (name === names.EN) {
          return `/${end}`
        } else {
          const end = pathnames.slice(2, pathnames.length).join("/")
          return `/${specialName}/${end}`
        }
      }
    }
  }

  render() {
    return (
      <div>
        <div>
          {this.showingNames
            .filter(v => v !== this.currentLocale)
            .map((v, index) => (
              <StyledLink key={index} href={this.getHref(v)}>
                {langMap[v]}
              </StyledLink>
            ))}
        </div>
      </div>
    )
  }
}
