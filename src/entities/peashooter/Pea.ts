import P5 from 'p5'
import { PEA_SPEED, PeaAnimation, PeaFrame, PeaKeyframe, PeaState } from '../../constants/peashooter'
import { EntityState, HandleState } from '../../types'
import Entity from '../Entity'
import Peashooter from './Peashooter'

class Pea extends Entity {
  states: EntityState
  currentState: HandleState
  onHitEnd: () => void = () => {  }

  constructor(x: number, y: number) {
    super(x, y)

    Pea.spritesheet = Peashooter.spritesheet

    this.states = {
      [PeaState.FLYING]: {
        type: PeaState.FLYING,
        draw: this.handleFlyingDraw,
        update: this.handleFlyingUpdate
      },
      [PeaState.ON_HIT]: {
        type: PeaState.ON_HIT,
        draw: this.handleOnHitDraw,
        update: this.handleOnHitUpdate
      }
    }

    this.currentState = this.states[PeaState.FLYING]
  }

  handleFlyingDraw = (p5: P5) => {
    const { originX, originY, w, h } = PeaKeyframe[PeaFrame.FLYING]

    p5.imageMode(p5.CENTER)
    p5.image(Peashooter.spritesheet, this.vector.x, this.vector.y, w, h, originX, originY, w, h)
  }

  handleFlyingUpdate = (p5: P5) => {
    this.vector.add(PEA_SPEED * (p5.deltaTime / 1000), 0)
  }

  handleOnHitDraw = (p5: P5) => {
    const { originX, originY, w, h } = PeaAnimation.OnHit[this.animationFrame]

    p5.imageMode(p5.CENTER)
    p5.image(Pea.spritesheet, this.vector.x, this.vector.y, w, h, originX, originY, w, h)
  }

  handleOnHitUpdate = (p5: P5) => {
    if (p5.millis() < this.animationTimer) return

    this.animationFrame++
    if (this.animationFrame >= PeaAnimation.OnHit.length) {
      this.animationFrame = 0
      this.onHitEnd()
    }

    this.animationTimer = p5.millis() + PeaAnimation.OnHit[this.animationFrame].timer * p5.deltaTime
  }

  changeState(p5: P5, newState: string) {
    this.currentState = this.states[newState]
    this.animationFrame = 0
    this.animationTimer = p5.millis() + PeaAnimation.OnHit[this.animationFrame].timer * p5.deltaTime
  }

  update(p5: P5) {
    this.currentState.update(p5)
  }

  draw(p5: P5) {
    this.currentState.draw(p5)
  }
}

export default Pea
