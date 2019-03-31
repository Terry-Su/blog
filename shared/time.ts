export const getYear = ( date: Date ) => date.getFullYear()
export const getMonth = ( date: Date ) => date.getMonth() + 1
export const getDate = ( date: Date ) => date.getDate()
export const getHours = ( date: Date ) => date.getHours()
export const getMinutes = ( date: Date ) => date.getMinutes()
export const getSeconds = ( date: Date ) => date.getSeconds()

export const formatNormalDate = (
  theDate: Date,
  showSeconds: boolean = false
) => {
  const year = getYear( theDate )
  const month = getMonth( theDate )
  const date = getDate( theDate )
  const hours = getHours( theDate )
  const minutes = getMinutes( theDate )
  const seconds = getSeconds( theDate )

  const f = addZeroIfSmallerThanTen

  return `${year}/${f( month )}/${f( date )} ${f( hours )}:${f( minutes )}${
    showSeconds ? ":" + f( seconds ) : ""
  }`
}

export const formYearMonthDate = ( theDate: Date ) => {
  const year = getYear( theDate )
  const month = getMonth( theDate )
  const date = getDate( theDate )
  const f = addZeroIfSmallerThanTen
  return `${year}/${f( month )}/${f( date )}`
}

function addZeroIfSmallerThanTen( number: number ) {
  return number < 10 ? `0${number}` : number
}
