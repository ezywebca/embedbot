class Stateful {
  state

  setState(newState) {
    this.state = { ...this.state, ...newState }
  }
}

export default Stateful
