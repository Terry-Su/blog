const Test = () => (
  <StyledTestRoot className="parent">
    <span className="child">Child</span>
  </StyledTestRoot>
)

const StyledTestRoot = styled.div`
  width: 100px;
  height: 80px;
  background: midnightblue;

  .child {
    color: white;
  }
`

const Flex = styled.div`
  .parent {
    display: flex;
    /* horizontally */
    justify-content: center;
    /* vertically */
    align-items: center;
  }
`

const Grid = styled.div`
  .parent {
    display: grid;
    /* horizontally */
    justify-content: center;
    /* vertically */
    align-items: center;
    /* horizontally and vertically */
    place-items: center;
  }
`

const MarginAutoInline = styled.div`
  .parent {
    display: flex;
    .child {
      /* horizontally */
      margin: 0 auto;
      /* vertically */
      margin: 0 auto;
      /* horizontally and vertically */
      margin: auto auto;
    }
  }
`

const MarginAutoBlock = styled.div`
  .child {
    display: block;
    width: 80px;
    background: orange;
    /* horizontally */
    margin: 0 auto;
  }
`

const TranslateAbsolute = styled.div`
  .parent {
    position: relative;

    .child {
      position: absolute;

      /* horizontally */
      left: 50%;
      transform: translate(-50%, 0);

      /* vertically */
      top: 50%;
      transform: translate(0, -50%);

      /* horizontally and vertically */
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
`

const AbsoluteMargin = styled.div`
  .parent {
    position: relative;

    .child {
      position: absolute;
      display: block;
      width: 80px;
      height: 40px;
      background: orange;

      /* horizontally */
      left: 50%;
      margin-left: -40px;

      /* vertically */
      top: 50%;
      margin-top: -20px;

      /* horizontally and vertically */
      left: 50%;
      top: 50%;
      margin-left: -40px;
      margin-top: -20px;
    }
  }
`

const Table = styled.div`
  .parent {
    /* vertically */
    display: table-cell;
    vertical-align: middle;
  }
`


const TextAlignLineHeight = styled.div`
  .parent {
    /* horizontally */
    text-align: center;
    /* vertically */
    line-height: 80px;
  }
`

const Wrapper = styled.div`
  margin-left: 10px;
`
const RootWrapper = styled.div`
  display: flex;
`

render(
  <RootWrapper>
    <Flex children={<Test />} />
    <Wrapper>
      <Grid children={<Test />} />
    </Wrapper>
    <Wrapper>
      <MarginAutoInline children={<Test />} />
    </Wrapper>
    <Wrapper>
      <MarginAutoBlock children={<Test />} />
    </Wrapper>
    <Wrapper>
      <TranslateAbsolute children={<Test />} />
    </Wrapper>
    <Wrapper>
      <AbsoluteMargin children={<Test />} />
    </Wrapper>
    <Wrapper>
      <Table children={<Test />} />
    </Wrapper>
    <Wrapper>
      <TextAlignLineHeight children={<Test />} />
    </Wrapper>
  </RootWrapper>
)
