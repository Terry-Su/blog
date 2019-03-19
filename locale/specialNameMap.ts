import * as namesMap from './names'

export const CN = "cn"

const specialNameMap = ( () => {
  const base = {
    [ namesMap.ZH_CN ]: CN
  }

  const names = ( () => {
    let res = {}
    Object.values( namesMap ).forEach( name => {
      res[ name ] = name
    } )
    return res
  } )()

  return {
    ...names,
    ...base
  }
} )()

export default specialNameMap

export const specialNameToLocaleMap = ( () => {
  let res = {}

  for ( let key in specialNameMap ) {
    const value = specialNameMap[ key ]
    res[ value ] = key
  }

  return res
} )()

export function getSpeciaLocalelName( name: string ) {
  const res = specialNameMap[ name ]
  return res !== undefined ? res : name
}

// export const reversedSpecialNameMap = ( () => {
//   let res = {}
//   for ( let key in specialNameMap ) {
//     res[ specialNameMap[ key ] ] = key
//   }
//   return res
// } )()
