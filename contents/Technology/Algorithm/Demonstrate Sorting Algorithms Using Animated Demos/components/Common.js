const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledPlayButton = styled.button`
  visibility: ${ props => props.isRunning ? 'hidden' : 'visible' };
`


