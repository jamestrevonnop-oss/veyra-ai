export class ModelAdapter {
  constructor(name) {
    this.name = name;
  }

  async generate() {
    throw new Error(
      `Model adapter "${this.name}" does not implement generate()`
    );
  }

  async *stream() {
    throw new Error(
      `Model adapter "${this.name}" does not implement stream()`
    );
  }
}
