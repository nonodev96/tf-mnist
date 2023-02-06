console.clear();

import "./style.css";
import { ElementUtil } from "./ElementUtil";
import Screenfull from "screenfull";
import { DrawUtil } from "./DrawUtil";

// https://stackoverflow.com/a/49260520/2496170
import * as jQuery from "jquery";
const $ = (jQuery as JQueryStatic)["default"] as (selector, context?) => JQuery;
// console.log( jQuery, $, $('body') );

import { DrawCanvas } from "./DrawCanvas";
var canvas = new DrawCanvas("draw");

function btnClick(elementID, callBack) {
  // https://stackoverflow.com/a/11398089/2496170
  // https://stackoverflow.com/a/44060724/2496170
  $("#" + elementID).on(
    "click touchend",
    ElementUtil.cancelDuplicateEvent(callBack)
  );
}
btnClick("btnClearCanvas", () => {
  canvas.clear();
});
// btnClick("btnHideGrid", () => {
//   canvas.toogleGrid();
// });
// TODO: show button on mobile only
btnClick("btnFullScreen", () => {
  if (Screenfull.enabled) Screenfull.toggle(document.documentElement);
});
btnClick("btnPredict", () => {
  var result = predict();

  canvas.clearOnDown = true;

  document.getElementById("output").innerText = `Prediction score: ${(
    result.score * 100
  ).toFixed(1)}%, index: ${result.prediction}`;

  if (result.prediction > -1)
    document.getElementById("title").innerText =
      result.score > 0.7
        ? "Predicted: " + result.prediction
        : "Tensorflow MNIST";
});

import { loadModel } from "./ModelLoader";
import * as tf from "@tensorflow/tfjs";

var tf_model = null;
$("#btnPredict").hide();
$("#output").text("Loading AI Model...");

var stopLoader = DrawUtil.drawLoader(canvas.canvas, 0, 0, canvas.W, canvas.H);

loadModel(M => {
  tf_model = M;
  $("#output").text(" Draw a digit on the canvas above");
  $("#btnPredict").show();
  stopLoader();
  canvas.draw();
});

function predict() {
  var tfImg = tf.fromPixels(canvas.getImageData(), 1);
  var smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
  smalImg = tf.cast(smalImg, "float32");
  var tensor = smalImg.expandDims(0).div(tf.scalar(255));
  const predictedValues = tf_model.predict(tensor).dataSync();

  var maxPrediction = 0;
  var predictionIndex = -1;

  for (let index = 0; index < predictedValues.length; index++) {
    if (predictedValues[index] > maxPrediction) {
      maxPrediction = predictedValues[index];
      predictionIndex = index;
    }
  }

  return { prediction: predictionIndex, score: maxPrediction };
}
