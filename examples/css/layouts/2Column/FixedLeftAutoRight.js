const Root = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`
const Left = styled.div`
  float: left;
  width: 200px;
  height: 100%;
  text-align: right;
  background: dodgerblue;
`
const Right = styled.div`
  height: 100%;
  margin-left: 200px;
  text-align: left;
  background: lightcoral;
`

render(
  <Root>
    <Left>Left</Left>
    <Right>Right</Right>
  </Root>
)
