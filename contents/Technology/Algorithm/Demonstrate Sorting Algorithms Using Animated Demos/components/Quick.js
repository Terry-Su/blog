class Quick extends React.Component {
  constructor(props) {
    super( props )
    this.time = 0

    this.data = [8, 9, 4, 6, 3, 2, 1, 7, 5]

    this.state = {
      data: [...this.data],
      currentLeftIndex: null,
      currentRightIndex: null,
      currentPivotIndex: null,
      currentTmpLeftIndex: null,
      currentTmpRightIndex: null,
      isRunning: false
    }
  }

  asyncUpdate(
    arr,
    leftIndex,
    rightIndex,
    pivotIndex,
    tmpLeftIndex,
    tmpRightIndex
  ) {
    const tmp = [...arr]
    this.time = this.time + 500
    const currentTime = this.time
    setTimeout(() => {
      this.setState({
        data: [...tmp],
        currentLeftIndex: leftIndex,
        currentRightIndex: rightIndex,
        currentPivotIndex: pivotIndex,
        currentTmpLeftIndex: tmpLeftIndex,
        currentTmpRightIndex: tmpRightIndex
      })
      if (currentTime === this.time) {
        this.setState({ isRunning: false })
      }
    }, this.time)
  }

  quickSort(arr) {
    this.recurQuickSort(arr, 0, arr.length - 1)
    this.asyncUpdate(arr)
  }

  recurQuickSort(a, leftIndex, rightIndex) {
    if (leftIndex >= rightIndex) {
      return
    }

    this.asyncUpdate(a, leftIndex, rightIndex, rightIndex)
    const pivotIndex = this.partition(a, leftIndex, rightIndex, rightIndex)
    this.asyncUpdate(a, leftIndex, rightIndex, pivotIndex)
    this.asyncUpdate(a, leftIndex, rightIndex, pivotIndex)
    this.recurQuickSort(a, leftIndex, pivotIndex - 1)
    this.recurQuickSort(a, pivotIndex + 1, rightIndex)
  }

  partition(a, leftIndex, rightIndex, pivotIndex) {
    let tmpLeftIndex = leftIndex - 1
    let tmpRightIndex = rightIndex - 1 + 1
    const pivot = a[pivotIndex]

    while (true) {
      do {
        tmpLeftIndex = tmpLeftIndex + 1
      } while (tmpLeftIndex < rightIndex && a[tmpLeftIndex] <= pivot)

      do {
        tmpRightIndex = tmpRightIndex - 1
      } while (tmpRightIndex > 0 && a[tmpRightIndex] >= pivot)

      if (tmpLeftIndex >= tmpRightIndex) {
        break
      } else {
        this.asyncUpdate(
          a,
          leftIndex,
          rightIndex,
          pivotIndex,
          tmpLeftIndex,
          tmpRightIndex
        )
        this.swap(a, tmpLeftIndex, tmpRightIndex)
        this.asyncUpdate(
          a,
          leftIndex,
          rightIndex,
          pivotIndex,
          tmpLeftIndex,
          tmpRightIndex
        )
      }
    }
    this.swap(a, tmpLeftIndex, pivotIndex)
    return tmpLeftIndex
  }

  swap(arr, aIndex, bIndex) {
    const tmp = arr[aIndex]
    arr[aIndex] = arr[bIndex]
    arr[bIndex] = tmp
  }

  getItemStyleBackground (index) {
    if (this.state.currentPivotIndex === index) {
      return "grey"
    }
    if (this.state.currentTmpLeftIndex === index) {
      return "red"
    }
    if (this.state.currentTmpRightIndex === index) {
      return "red"
    }
    if (
      (this.state.currentLeftIndex < index &&
        this.state.currentRightIndex > index) ||
      this.state.currentLeftIndex === index ||
      this.state.currentRightIndex === index
    ) {
      return "deepSkyBlue"
    }
    return "blue"
  }

  play() {
    this.time = 0
    this.setState({ data: [...this.data], isRunning: true }, () =>
      this.quickSort(this.state.data)
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