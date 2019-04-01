class App extends React.Component {
  constructor(props) {
    this.time = 0
    this.data = [8, 9, 4, 6, 3, 2, 1, 7, 5]

    this.state = {
      data: [...this.data],
      currentI: null,
      currentJ: null
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

  shellSort(arr) {
    this.insertionSortByH(arr, 3)
    this.insertionSortByH(arr, 1)
    this.asyncUpdate(arr)
  }

  insertionSortByH(a, h) {
    const length = a.length
    for (let i = 0; i < h; i++) {
      let size = Math.floor((length - i) / h)
      if (size > 0) {
        // insertion sort
        let input
        let out // out is marked item

        for (out = i; out < length; out += h) {
          const tmp = a[out] // removed marked item
          input = out

          this.asyncUpdate(a, input, out)
          while (input > 0 && input - h >= 0 && a[input - h] >= tmp) {
            a[input] = a[input - h] // shift item right
            input = input - h
          }

          // insert
          a[input] = tmp
          this.asyncUpdate(a, input, out)
        }
      }
    }
  }

  getItemStyleBackground(index) {
    if (this.state.currentJ === index) {
      return "red"
    }
    if (this.state.currentI === index) {
      return "grey"
    }

    return "blue"
  }

  play() {
    this.time = 0
    this.setState({ data: [...this.data], isRunning: true }, () =>
      this.shellSort(this.state.data)
    )
  }

  render() {
    const { data, activeI, activeJ, isRunning } = this.state
    return (
      <div>
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
        {!isRunning && (
          <button onClick={() => this.play()} onMouseOver={() => this.play()}>
            play
          </button>
        )}
      </div>
    )
  }
}
