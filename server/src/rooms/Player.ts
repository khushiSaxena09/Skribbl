export class Player {
  id: string;
  name: string;
  score = 0;
  ready = false;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  addScore(points: number) {
    this.score += points;
  }

  reset() {
    this.ready = false;
  }
}