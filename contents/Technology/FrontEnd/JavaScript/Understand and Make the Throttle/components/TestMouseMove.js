class TestMouseMove extends React.Component {
  constructor(props) {
    super(props)
    this.rootRef = React.createRef()
  }

  componentDidMount() {
    const { width, height } = this.rootRef.current.getBoundingClientRect()
    const containers = Array.from(this.rootRef.current.children)

    containers.map(function(container, index) {
      const canvas = container.querySelector("canvas")
      canvas.setAttribute("width", width)
      canvas.setAttribute("height", height * 0.5)
      const ctx = canvas.getContext("2d")

      const button = container.querySelector("button")

      const funcMap = {
        "0": function() {
          ctx.fillStyle = "red"
          canvas.onmousemove = drawCircle
        },
        "1": function() {
          ctx.fillStyle = "blue"
          canvas.onmousemove = throttle(drawCircle, 300)
        }
      }

      const func = funcMap[index]

      func()

      button.onclick = function() {
        clearCanvas(canvas)
      }

      function drawCircle(event) {
        const { x, y } = event
        const { left, top } = canvas.getBoundingClientRect()

        const cx = x - left
        const cy = y - top
        ctx.fill(getCircle(cx, cy))
      }
    })

    function getCircle(x, y, r = 2) {
      const path = new Path2D()
      path.arc(x, y, r, 0, 2 * Math.PI)
      return path
    }

    function clearCanvas(canvas) {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.getContext("2d").clearRect(0, 0, width, height)
    }
  }

  render() {
    return (
      <StyledRoot ref={this.rootRef}>
        <div>
          <h2>Original</h2>
          <button>Clear</button>
          <canvas />
        </div>

        <div>
          <h2>Throttled</h2>
          <button>Clear</button>
          <canvas />
        </div>
      </StyledRoot>
    )
  }
}


function getCircle( x, y, r=2 ) {
  const path = new Path2D()
  path.arc(x, y, r, 0, 2 * Math.PI);
  return path
}

function clearCanvas( canvas ) {
  const { width, height } = canvas.getBoundingClientRect()
  canvas.getContext('2d').clearRect(
    0,
    0,
    width,
    height
  )
}


function throttle( func, wait ) {
  let timer

  function throttled( ...args ) {
    const self = this

    if ( timer == null ) {
      invokeFunc()
      addTimer()
    }

    function addTimer() {
      timer = setTimeout( () => {
        clearTimer()
      }, wait )
    }

    function invokeFunc() {
      func.apply( self, args )
    }
  }

  return throttled

  function clearTimer() {
    clearTimeout( timer )
    timer = null
  }
}

const StyledRoot = styled.div`
  width: 100%;
  height: 600px;

  div {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 50%;
    border-bottom: 1px solid #ddd;
  }

  h2 {
    position: absolute;
    left: 5px;
    top: 5px;
  }

  button {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  canvas {
    display: block;
  }
`

render(<TestMouseMove />)
