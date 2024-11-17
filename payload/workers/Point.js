export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get distance() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static get zero() {
    return new Point(0, 0);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Point(this.x / scalar, this.y / scalar);
  }
}
