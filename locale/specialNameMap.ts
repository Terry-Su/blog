import { ZH_CN } from './names'

export const CN = 'cn'

const specialNameMap = {
  [ZH_CN]: CN
} 

export default specialNameMap

export function getSpeciaLocalelName ( name: string ) {
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