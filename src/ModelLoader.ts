import * as tf from "@tensorflow/tfjs";

import * as modelJson from "../model/model.json";

import * as group1File11 from "../model/group1-shard1of1";
import * as group2File11 from "../model/group2-shard1of1";
import * as group3File11 from "../model/group3-shard1of1";
import * as group4File11 from "../model/group4-shard1of1";

var weights_urls = [group1File11, group2File11, group3File11, group4File11];
// codeSendBox unique auto generated prefix
var weights_names = [
  "incs-group1-shard1of1",
  "TpCA-group2-shard1of1",
  "RaxT-group3-shard1of1",
  "EcKX-group4-shard1of1"
];

export function loadModel(onModelLoad: (model) => void) {
  // Convert json to blob
  // https://stackoverflow.com/a/26158579/2496170
  var model_Blob = new Blob([JSON.stringify(modelJson)], {
    type: "application/json"
  });
  loadWeights(weights_urls[0], weights_names[0], w1 => {
    loadWeights(weights_urls[1], weights_names[1], w2 => {
      loadWeights(weights_urls[2], weights_names[2], w3 => {
        loadWeights(weights_urls[3], weights_names[3], w4 => {
          tf.loadModel(tf.io.browserFiles([model_Blob, w1, w2, w3, w4])).then(
            onModelLoad
          );
        });
      });
    });
  });
}
//return a promise that resolves with a File instance
function urltoFile(url, filename, mimeType) {
  //https://stackoverflow.com/a/38935990/2496170
  return fetch(url)
    .then(function(res) {
      return res.arrayBuffer();
    })
    .then(function(buf) {
      return new File([buf], filename, { type: mimeType });
    });
}
function getSandboxFile(imported) {
  let url = "";
  for (let k in imported) url += imported[k];
  return "https://" + url.split("https://")[1];
}
function loadWeights(W, newName, callBack) {
  // Bug ? Hack ? WTF ?!
  // console.log("W", "https://" + getSandboxFile(W).split("https://")[1]);
  urltoFile(getSandboxFile(W), newName, "*/*").then(f => {
    callBack(f);
  });
}
