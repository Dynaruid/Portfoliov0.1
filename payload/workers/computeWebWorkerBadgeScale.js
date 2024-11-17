import { Point } from "./Point.js";

self.onmessage = function (event) {
  self.postMessage(computeWebWorkerBadgeScale(event.data));
};

function computeWebWorkerBadgeScale(payload) {
  let badgesCount = Math.trunc(payload[0]);
  let readyScale = payload[1];
  let hoverActiveDistance = payload[2];
  let requestPoint = new Point(payload[3], payload[4]);
  let fixedOffsetsPosition = 5;
  let destScalesPosition = 5 + badgesCount * 2;

  for (let i = 0; i < badgesCount; i++) {
    let index = fixedOffsetsPosition + i * 2;
    let badgeCenter = new Point(payload[index], payload[index + 1]);
    let deltaPosition = requestPoint.subtract(badgeCenter);
    let deltaDistance = deltaPosition.distance;
    let destScale = (hoverActiveDistance - deltaDistance) / hoverActiveDistance;

    if (deltaDistance < hoverActiveDistance) {
      destScale = destScale * 0.4 + readyScale;
    } else {
      destScale = destScale * 0.1 + readyScale;
    }

    payload[destScalesPosition + i] = destScale;
  }

  return payload;
}
