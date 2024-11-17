import { Point } from "./Point.js";

self.onmessage = function (event) {
  self.postMessage(computeWebWorkerEffectTiles(event.data));
};

// 함수 변환
function computeWebWorkerEffectTiles(payload) {
  // Float32Array로 가정
  let hoverDistance = payload[0];
  let stiffness = payload[1];
  let tilesCount = payload[2] | 0; // 정수로 변환
  let maxPointCount = payload[3] | 0;
  let requestPointsCount = payload[4] | 0;
  let fixedOffsetsPosition = 5 + maxPointCount * 2;
  let tileStatesPosition = fixedOffsetsPosition + tilesCount * 2;
  let opacitiesPosition = tileStatesPosition + tilesCount;
  let destOffsetsPosition = opacitiesPosition + tilesCount;
  let requestPoints = [];

  // requestPoints 생성
  for (let i = 0; i < requestPointsCount; i++) {
    let requestPointIndex = i * 2;
    let pos = new Point(
      payload[5 + requestPointIndex],
      payload[5 + requestPointIndex + 1]
    );
    requestPoints.push(pos);
  }

  // 메인 루프
  for (let i = 0; i < tilesCount; i++) {
    let index = i * 2;
    let fixedPos = new Point(
      payload[fixedOffsetsPosition + index],
      payload[fixedOffsetsPosition + index + 1]
    );
    let opacity = 0;

    let lastDestPos = new Point(
      payload[destOffsetsPosition + index],
      payload[destOffsetsPosition + index + 1]
    );
    let state = -1;

    for (let point of requestPoints) {
      if (state === -1) {
        let vec = point.subtract(fixedPos);
        if (vec.distance < hoverDistance) {
          state = 0;
          let distanceDegree = (hoverDistance - vec.distance) / hoverDistance;
          opacity = distanceDegree * distanceDegree;
          let nextDestPos = fixedPos.add(
            vec.multiply(distanceDegree * stiffness)
          );
          let distance = lastDestPos.subtract(nextDestPos).distance;

          if (distance > 2.2) {
            lastDestPos = nextDestPos;
            state = 1;
          }
        }
      }
    }

    payload[tileStatesPosition + i] = state;
    payload[opacitiesPosition + i] = opacity;
    payload[destOffsetsPosition + index] = lastDestPos.x;
    payload[destOffsetsPosition + index + 1] = lastDestPos.y;
  }

  return payload;
}
