const { StyledRoot, StyledPlayButton } = sharing

class App extends React.Component {
  constructor(props) {
    super( props )
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

  selectionSort(arr) {
    const { length } = arr
    for (let i = 0; i < length - 1; i++) {
      let minIndex = i
      for (let j = i; j < length - 1; j++) {
        if (arr[j + 1] < arr[minIndex]) {
          minIndex = j + 1
        }
      }
      // swap
      const tmp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = tmp
      this.asyncUpdate(arr, i)
    }
    this.asyncUpdate(arr, length)
  }

  getItemStyleBackground(index){
    if (this.state.currentI != null && index > this.state.currentI) {
      return "deepSkyBlue"
    }
    if (this.state.currentI === index) {
      return "grey"
    }
    return "blue"
  }

  play() {
    this.time = 0
    this.setState({ data: [...this.data], isRunning: true }, () =>
      this.selectionSort(this.state.data)
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