export var DrawUtil = {
  drawGrid: function(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    dark = true
  ) {
    ctx.save();
    ctx.fillStyle = dark ? "black" : "white";
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = dark ? "#666" : "#EEE";
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 25) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (var y = 0; y < W; y += 25) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
  /// Returns a callback to execute when you need to stop drawing the loader
  drawLoader: function(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    //https://codepen.io/lobau/pen/JKNdyB

    // Lissajous figures are some of the most interesting parametrized curves.
    // A Lissajous figure has the following parametrization:
    // x = cos at
    // y = sin bt
    // where a and b are positive integers and t ranges over the interval [0, 2π).
    // Lissajous figures can be generated on an oscilloscope from two sinusoidal inputs of different frequencies.
    // When a=b, the figure is a circle.
    let t = 0; // Time
    let a = 4.3;
    let b = 3;
    let size = 256; // size of the loader in points
    // radius in points
    let r = size / 4;
    // because Tau is greater than Pi
    let tau = 2 * Math.PI;
    // sample (definition) of the curve. Higher numbers means shorter line between points, so smoother curve.
    let numberOfDots = 100;
    let anime = true;
    function stop() {
      anime = false;
    }
    function draw(timestamp) {
      if (!anime) return;
      window.requestAnimationFrame(draw);
      ctx.save();
      ctx.fillRect(x, y, w, h);
      // The Lissajous curve using the Constants defined above
      var px = Math.cos(a * t) * r + w / 2;
      var py = Math.sin(b * t) * r + h / 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // Except if it's the first point, draw a segment between the previous point and the current point
      for (let i = 0; i <= numberOfDots; i++) {
        if (i === 90) {
          ctx.fillStyle = "#CCC";
          ctx.font = "18px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Loading", w / 2, h / 2);
          ctx.fillStyle = "black";
        }

        ctx.beginPath();
        let brightness = Math.round(255 - (i / numberOfDots) * 64) + 32;
        ctx.strokeStyle =
          "rgb(" +
          0 +
          ", " +
          Math.round(255 * Math.sin((46 * i) / numberOfDots)) +
          ", " +
          0 + // 0Math.round(50 * Math.cos(brightness / t)) +
          ")";
        ctx.lineWidth = (i / numberOfDots) * (size / 64);
        ctx.moveTo(px, py);

        if (i > 0) {
          var offset = timestamp * 0.001;
          t = timestamp * 0.0008 + (i / numberOfDots) * tau;
          px = Math.cos(a * t + offset) * r + w / 2;
          py = Math.sin(b * t) * r + h / 2;
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    window.requestAnimationFrame(draw);
    return stop;
  }
};
