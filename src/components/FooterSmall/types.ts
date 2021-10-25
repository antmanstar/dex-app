import React from 'react'
import { FlexProps } from '@pancakeswap/uikit'

export type ILinksWithIcons = {
  title: string
  url: string
  icon?: any
  isTsSvg?: boolean
}

export type ISmallFooterLinks = {
  links: ILinksWithIcons[]
  audit: ILinksWithIcons[]
  socialMedia: ILinksWithIcons[]
} & FlexProps
