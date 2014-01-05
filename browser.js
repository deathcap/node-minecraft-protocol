
// when browserified, only export the subset of node-minecraft-protocol without
// native dependencies (i.e., crypto uses ursa, so don't include here)
module.exports = {
  protocol: require('./lib/protocol')
}

