const { StyledRoot, StyledPlayButton } = sharing

class App extends React.Component {
  constructor(props) {
    this.time = 0
    this.data = [8, 9, 4, 6, 3, 2, 1, 7, 5]

    this.state = {
      data: [...this.data],
      currentLeft: null,
      currentRight: null,
      currentMiddle: null,
      isRunning: false
    }
  }

  asyncUpdate(arr, left, right, middle) {
    const tmp = [...arr]
    this.time = this.time + 500
    const currentTime = this.time
    setTimeout(() => {
      this.setState({
        data: [...tmp],
        currentLeft: left,
        currentRight: right,
        currentMiddle: middle
      })
      if (currentTime === this.time) {
        this.setState({ isRunning: false })
      }
    }, this.time)
  }

  mergeSort(arr) {
    const left = 0
    const right = arr.length - 1
    this.recurMergeSort(arr, left, right)
    this.asyncUpdate(arr)
  }

  recurMergeSort(a, left, right) {
    if (left == right) {
      return
    } else {
      // Example: 2 / 2 = 1; 3 / 2 = 1;
      const middle = Math.floor((left + right) / 2)
      this.recurMergeSort(a, left, middle)
      this.recurMergeSort(a, middle + 1, right)
      this.merge(a, left, middle, right)
      this.asyncUpdate(a, left, right, middle)
    }
  }

  merge(aA, left, middle, right) {
    let tmpSize = right - left + 1
    // a temporary array used to re-assign value to aA
    const tmp = []
    let i = 0
    let indexA = left
    let indexB = middle + 1
    while (indexA <= middle && indexB <= right) {
      if (aA[indexA] < aA[indexB]) {
        tmp[i] = aA[indexA]
        indexA = indexA + 1
      } else {
        tmp[i] = aA[indexB]
        indexB = indexB + 1
      }
      i = i + 1
    }
    while (indexA <= middle) {
      tmp[i] = aA[indexA]
      indexA = indexA + 1
      i = i + 1
    }
    while (indexB <= right) {
      tmp[i] = aA[indexB]
      indexB = indexB + 1
      i = i + 1
    }
    for (let j = 0; j < tmp.length; j++) {
      aA[left + j] = tmp[j]
    }
  }

  play() {
    this.time = 0
    this.setState({ data: [...this.data], isRunning: true }, () =>
      this.mergeSort(this.state.data)
    )
  }

  getItemStyleBackground(index) {
    if (this.state.currentLeft === index) {
      return "deepSkyBlue"
    }
    if (this.state.currentRight === index) {
      return "deepSkyBlue"
    }
    if (this.state.currentLeft < index && this.state.currentRight > index) {
      return "deepSkyBlue"
    }
    return "blue"
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