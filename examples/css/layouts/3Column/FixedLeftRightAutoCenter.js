const Root = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`
const Left = styled.div`
  float: left;
  width: 200px;
  height: 100%;
  margin-right: -200px;
  text-align: right;
  background: dodgerblue;
`

const Center = styled.div`
  height: 100%;
  margin: 0 200px;
  text-align: center;
  background: lightgrey;
`

const Right = styled.div`
  float: right;
  width: 200px;
  height: 100%;
  margin-left: -200px;
  text-align: left;
  background: lightcoral;
`

render(
  <Root>
    <Left>Left</Left>
    <Right>Right</Right>
    <Center>Center</Center>
  </Root>
)
