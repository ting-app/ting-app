import dayjs from 'dayjs'

function randomString () {
  return (Math.random() + 1).toString(36).substring(6)
}

function randomFileName (fileName) {
  const indexOfDot = fileName.lastIndexOf('.')

  return fileName.substring(0, indexOfDot) + '-' + randomString() + fileName.substring(indexOfDot)
}

function formatDateTime (dateTime) {
  return dayjs(dateTime).format('YYYY/MM/DD HH:mm:ss')
}

export { randomString, randomFileName, formatDateTime }
