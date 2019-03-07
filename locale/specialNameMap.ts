import { ZH_CN } from './names'

export const CN = 'cn'

const specialNameMap = {
  [ZH_CN]: CN
} 

export default specialNameMap

// export const reversedSpecialNameMap = ( () => {
//   let res = {}
//   for ( let key in specialNameMap ) {
//     res[ specialNameMap[ key ] ] = key
//   }
//   return res
// } )()