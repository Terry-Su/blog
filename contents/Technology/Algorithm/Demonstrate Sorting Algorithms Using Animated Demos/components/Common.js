sharing.StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

sharing.StyledPlayButton = styled.button`
  visibility: ${ props => props.isRunning ? 'hidden' : 'visible' };
`


render(<span></span>)
