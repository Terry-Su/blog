export default class AbstractCategory {
  name: string
  expanded?: boolean
  categories?: AbstractCategory[]


  // has remarks directly under current category folder
  // # example
  // Root
  // HasContent
  //     content.md
  //     Foo
  //       example.md
  // NoContent
  //   Foo
  //     example.md 
  hasRemarks?: boolean
  remarks?: any
}