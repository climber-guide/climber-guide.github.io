/*************************************************************************************************
 * index.js v1.1.1                                                                               *
 * (c) 2025 Grant Freeman                                                                        *
 * License GPL 3.0                                                                               *
 *************************************************************************************************/
/* global Pro, ProChart */

const pc = new ProChart('pro-chart-container', true)
pc.filter.range.min = 20
pc.filter.range.max = 70
pc.filter.strength.min = 5
pc.deploy()

const appendixEvO = new ProChart('expansion-vs-operation', false)
appendixEvO.prune((pro) => {
  if (pro.brand === Pro.BRAND.CAMP && pro.model === Pro.MODEL.TRICAM && pro.size === 'N.0.125') return true
  if (pro.brand === Pro.BRAND.TRANGO && pro.model === Pro.MODEL.FLEX && pro.size === '1') return true
  if (pro.brand === Pro.BRAND.CAMP && pro.model === Pro.MODEL.BALL_NUT && pro.size === '5') return true
  return false
})
appendixEvO.filter.range.min = 5
appendixEvO.filter.range.max = 20
appendixEvO.filter.strength.min = 2
appendixEvO.deploy()

const appendixHexNut = new ProChart('hex-and-nut', false)
appendixHexNut.prune((pro) => {
  if (pro.brand === Pro.BRAND.DMM_WALES && pro.model === Pro.MODEL.TORQUE && pro.size === '1') return true
  if (pro.brand === Pro.BRAND.METOLIUS && pro.model === Pro.MODEL.BIG_NUT && pro.size === '2') return true
  return false
})
appendixHexNut.filter.range.min = 30
appendixHexNut.filter.range.max = 45
appendixHexNut.filter.strength.min = 8
appendixHexNut.deploy()

const appendixStrength = new ProChart('strength', false)
appendixStrength.prune((pro) => {
  if (pro.brand === Pro.BRAND.BLACK_DIAMOND && pro.model === Pro.MODEL.STOPPER && pro.size === '7') return true
  if (pro.brand === Pro.BRAND.DMM_WALES && pro.model === Pro.MODEL.DMM_OFFSET && pro.size === '7') return true
  if (pro.brand === Pro.BRAND.TOTEM && pro.size === '0.50') return true
  if (pro.brand === Pro.BRAND.DMM_WALES && pro.model === Pro.MODEL.DRAGON && pro.size === '00') return true
  if (pro.brand === Pro.BRAND.BLACK_DIAMOND && pro.model === Pro.MODEL.CAMALOT_C4 && pro.size === '.3') return true
  return false
})
appendixStrength.filter.range.min = 5
appendixStrength.filter.range.max = 45
appendixStrength.filter.strength.min = 2
appendixStrength.deploy()
