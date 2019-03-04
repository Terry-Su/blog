import { NAME_GV_CURRENT_PAGE } from '@tsblog/constants/names'

export default function getDefaultData() {
  return window[ NAME_GV_CURRENT_PAGE ].data
}