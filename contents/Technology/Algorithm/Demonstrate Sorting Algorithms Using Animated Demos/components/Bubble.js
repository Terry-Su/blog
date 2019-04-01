const { StyledRoot, StyledPlayButton } = sharing

class App extends React.Component {
  constructor(props) {
    this.time = 0

    this.data = [8, 9, 4, 6, 3, 2, 1, 7, 5]

    this.state = {
      data: [...this.data],
      currentI: null,
      currentJ: null,
      isRunning: false
    }
  }

  asyncUpdate(arr, i, j) {
    const tmp = [...arr]
    this.time = this.time + 500
    const currentTime = this.time
    setTimeout(() => {
      this.setState({
        data: [...tmp],
        currentI: i,
        currentJ: j
      })
      if (currentTime === this.time) {
        this.setState({ isRunning: false })
      }
    }, this.time)
  }

  bubbleSort(arr) {
    const { length } = arr
    for (let i = length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        this.asyncUpdate(arr, i, j)
        if (arr[j] > arr[j + 1]) {
          // swap
          const tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
          this.asyncUpdate(arr, i, j)
        }
      }
    }
    this.asyncUpdate(arr)
  }

  getItemStyleBackground(index) {
    if (this.state.currentJ === index) {
      return "red"
    }
    if (this.state.currentJ != null && this.state.currentJ + 1 === index) {
      return "orange"
    }
    if (this.state.currentI === index) {
      return "purple"
    }
    if (this.state.currentI != null && index > this.state.currentI) {
      return "deepSkyBlue"
    }
    return "blue"
  }

  play() {
    this.time = 0
    this.setState({ data: [...this.data], isRunning: true }, () =>
      this.bubbleSort(this.state.data)
    )
  }

  render() {
    const { data, activeI, activeJ, isRunning } = this.state

    return (
      <StyledRoot>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end"
          }}
        >
          {data.map((num, index) => (
            <span
              key={index}
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "flex-end",
                width: "50px",
                height: `${num * 20}px`,
                margin: "2px",
                color: "#ddd",
                background: this.getItemStyleBackground(index)
              }}
            >
              {num}
            </span>
          ))}
        </div>
        <br />
        <StyledPlayButton
          isRunning={isRunning}
          onClick={() => this.play()}
          onMouseOver={() => this.play()}
        >
          play
        </StyledPlayButton>
      </StyledRoot>
    )
  }
}

render(<App />)
