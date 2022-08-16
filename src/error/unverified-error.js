class UnverifiedError extends Error {
  constructor (message) {
    super(message)

    this.name = 'UnverifiedError'
  }
}

export default UnverifiedError
