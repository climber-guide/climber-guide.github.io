/**
 * pro.js v0.1.0
 * (c) 2025 climber's guide contributers
 * released under the gpl-3.0 license
 */

class Pro {
  // Pro Types
  static get BALLNUT()    { return 'Ball Nut' }
  static get BIGBRO()     { return 'Big Bro'  }
  static get HEX()        { return 'Hex'      }
  static get NUT()        { return 'Nut'      }
  static get SLCD()       { return 'SLCD'     }
  static get TRICAM()     { return 'Tricam'   }

  // Pro Colors
  static get RED()      { return 'Red'    }
  static get ORANGE()   { return 'Orange' }
  static get YELLOW()   { return 'Yellow' }
  static get GREEN()    { return 'Green'  }
  static get BLUE()     { return 'Blue'   }
  static get PURPLE()   { return 'Purple' }
  static get SILVER()   { return 'Silver' }
  static get BLACK()    { return 'Black'  }

  // Pro Stem
  static get FLEX()  { return 'Flex'  }
  static get RIGID() { return 'Rigid' }

  /**
   *  @param {object} pro - a piece of gear used in traditional climbing
   *    @param {string} pro.type - see Pro Types (ex: Pro.HEX)
   *    @param {string} pro.brand - shorthand
   *    @param {string} pro.model - shorthand
   *    @param {string} pro.color - see Pro Colors (ex: Pro.BLUE)
   *    @param {string} pro.size - type string needed for format
   *    @param {number} pro.weight - grams (g)
   *    @param {object} pro.range - the physical / expansion range
   *      @param {number} pro.range.min - millimeters (mm)
   *      @param {number} pro.range.max - millimeters (mm)
   *    @param {object} pro.strength - max holding power before device failure
   *      @param {number} pro.strength.active  - kilonewtons (kn)
   *      @param {number} pro.strength.passive - kilonewtons (kn)
   */
  constructor({type, brand, model, color, size, weight, range: {min, max}, strength: {active  = null, passive = null}, stem}) {
    this.type = type
    this.brand = brand
    this.model = model
    this.color = color
    this.size = size
    this.weight = weight
    this.expansionRange = {
      min: min,
      max: max
    }
    this.strength = {
      active: active,
      passive: passive
    }
    this.stem = stem

    const activeTypes = [Pro.BALLNUT, Pro.BIGBRO, Pro.SLCD, Pro.TRICAM]
    const passiveTypes = [Pro.HEX, Pro.NUT, Pro.TRICAM]

    // verify active/passive data
    if (activeTypes.includes(this.type) && this.strength.active == null) {
      throw ['missing active strength value:', this.brand, this.model, this.size].join(' ')
    }
    if (passiveTypes.includes(this.type) && this.strength.passive == null) {
      throw ['missing passive strength value:', this.brand, this.model, this.size].join(' ')
    }

    // determine operational range for ballnut, bigbro, slcd, and tricam
    if (activeTypes.includes(this.type)) {
      let range = this.expansionRange.max - this.expansionRange.min
      let min = ((range * 0.10) + this.expansionRange.min).toFixed(1)
      let max = (this.expansionRange.max - (range * 0.25)).toFixed(1)
      if (this.type == Pro.BIGBRO) {
        max = this.expansionRange.max
      }
      this.operationalRange = {
        min: min,
        max: max
      }
    }
  }

  /**
   * @return {number} 1 or 2 if pro is a SLCD, otherwise null
   */
  get axles() {
    let axles = null
    if (this.type == Pro.SLCD) {
      axles = this.strength.passive != null ? 2 : 1
    }
    return axles
  }
}

class ProList {
  constructor(list = []) {
    this.list = list
  }

  get length() {
    return this.list.length
  }

  add(pro) {
    this.list.push(pro)
  }

  sort(sortFunction) {
    this.list.sort(sortFunction)
  }

  /**
   * Filter
   * 
   * @param {func} filterFunction - passed to array filter method
   * 
   * @return {ProList} returns new instance of prolist with only pro from filter
   */
  filter(filterFunction) {
    const filteredList = this.list.filter(filterFunction)
    return new ProList(filteredList)
  }

  chartLabels() {
    return this.list.map((pro) => {
      return [pro.brand, pro.model, pro.size].join(' ')
    })
  }

  chartDataExpansionRange() {
    return this.list.map((pro) => {
      return [pro.expansionRange.min, pro.expansionRange.max]
    })
  }

  chartDataOperationalRange() {
    return this.list.map((pro) => {
      return [pro.operationalRange.min, pro.operationalRange.max]
    })
  }

  chartDataWeight(multiplier) {
    return this.list.map((pro) => {
      return pro.weight * multiplier
    })
  }

  /**
   * @param {string} scale - 'ex' or 'op'
   * @param {number} percent - % padding from edge of chart
   * 
   * @return {object} linear scale min max values
   */
  linearScale(scale, percent) {
    if (scale == 'ex') {
      scale = this.chartDataExpansionRange()
    } else {
      scale = this.chartDataOperationalRange()
    }

    let min = scale[0][0]
    let max = scale[0][1]
    scale.forEach(element => {
      min = min <= element[0] ? min : element[0]
      max = max >= element[1] ? max : element[1]
    });
    const pad = ((max - min) * (percent / 100))
    min = Math.floor(min - pad)
    max = Math.ceil(max + pad)
    return {min: min, max: max}
  }

  linearWeightScale(percent) {
    let max = 0
    this.list.forEach(pro => {
      max = max >= pro.weight ? max: pro.weight
    })
    return Math.ceil(max * (1 + (percent / 100)))
  }

  chartProColor() {
    return this.list.map((pro) => {
      switch (pro.color) {
        case Pro.RED:
          return '#C96868'
        case Pro.ORANGE:
          return '#FFB26F'
        case Pro.YELLOW:
          return '#FADFA1'
        case Pro.GREEN:
          return '#9DBC98'
        case Pro.BLUE:
          return '#8CC0DE'
        case Pro.PURPLE:
          return '#A888B5'
        case Pro.SILVER:
          return '#C7C8CC'
        case Pro.BLACK:
          return '#41444B'
        default:
          return '#ff00d9'
      }
    })
  }
}

/* Protection List
================================================================================================ */
const prolist = new ProList()

// black diamond - camalot z4
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.GREEN,  size: '0',   weight: 43, range: {min:  7.5, max: 11.8}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.RED,    size: '.1',  weight: 45, range: {min:  8.8, max: 13.8}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.YELLOW, size: '.2',  weight: 48, range: {min: 10.4, max: 16.3}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.BLUE,   size: '.3',  weight: 54, range: {min: 12.4, max: 22.6}, strength: {active:  8, passive:    8}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.SILVER, size: '.4',  weight: 61, range: {min: 15.3, max: 27.7}, strength: {active:  9, passive:    9}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.PURPLE, size: '.5',  weight: 77, range: {min: 18.8, max: 33.9}, strength: {active: 10, passive:   10}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'Z4', color: Pro.GREEN,  size: '.75', weight: 93, range: {min: 23.1, max: 42.1}, strength: {active: 10, passive:   10}, stem: Pro.FLEX}))

// black diamond - camalot c4
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.BLUE,   size: '0.3',   weight:  70, range: {min:  13.8, max:  23.4}, strength: {active:  8, passive:  8}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.SILVER, size: '0.4',   weight:  78, range: {min:  15.5, max:  26.7}, strength: {active:  9, passive:  9}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.PURPLE, size: '0.5',   weight:  93, range: {min:  19.6, max:  33.5}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.GREEN,  size: '0.75',  weight: 108, range: {min:  23.9, max:  41.2}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.RED,    size: '#1',    weight: 124, range: {min:  30.2, max:  52.1}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.YELLOW, size: '#2',    weight: 140, range: {min:  37.2, max:  64.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.BLUE,   size: '#3',    weight: 180, range: {min:  50.7, max:  87.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.SILVER, size: '#4',    weight: 257, range: {min:  66.0, max: 114.7}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.PURPLE, size: '#5',    weight: 348, range: {min:  85.4, max: 148.5}, strength: {active: 14, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.GREEN,  size: '#6',    weight: 530, range: {min: 114.1, max: 195.0}, strength: {active: 14, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.RED,    size: '#7',    weight: 710, range: {min: 150.0, max: 253.3}, strength: {active:  8, passive:  8}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'C4', color: Pro.YELLOW, size: '#8',    weight: 974, range: {min: 193.0, max: 321.2}, strength: {active:  5, passive:  5}, stem: Pro.RIGID}))

// // black diamond - camalot ul
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.SILVER, size: '0.4',   weight:  61, range: {min:  15.5, max:  26.7}, strength: {active:  8, passive:  8}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.PURPLE, size: '0.5',   weight:  74, range: {min:  19.6, max:  33.5}, strength: {active: 10, passive: 10}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.GREEN,  size: '0.75',  weight:  89, range: {min:  23.9, max:  41.2}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.RED,    size: '#1',    weight: 101, range: {min:  30.2, max:  52.1}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.YELLOW, size: '#2',    weight: 126, range: {min:  37.2, max:  64.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.BLUE,   size: '#3',    weight: 167, range: {min:  50.7, max:  87.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'BD', model: 'UL', color: Pro.SILVER, size: '#4',    weight: 225, range: {min:  66.0, max: 114.7}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))

// dmm - dragonfly
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragonfly', color: Pro.GREEN,  size: '1',   weight: 55, range: {min:  7.8, max: 11.0}, strength: {active: 6, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragonfly', color: Pro.RED,    size: '2',   weight: 56, range: {min:  8.7, max: 12.9}, strength: {active: 6, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragonfly', color: Pro.YELLOW, size: '3',   weight: 65, range: {min: 10.2, max: 15.1}, strength: {active: 8, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragonfly', color: Pro.BLUE,   size: '4',   weight: 67, range: {min: 12.1, max: 17.9}, strength: {active: 8, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragonfly', color: Pro.SILVER, size: '5',   weight: 70, range: {min: 15.1, max: 22.5}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragonfly', color: Pro.PURPLE, size: '6',   weight: 73, range: {min: 19.0, max: 28.3}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))

// dmm - dragon
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.BLUE,   size: '00',   weight: 75,  range: {min:  14, max:  21}, strength: {active: 10, passive:  9}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.SILVER, size:  '0',   weight: 85,  range: {min:  16, max:  25}, strength: {active: 14, passive: 12}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.PURPLE, size:  '1',   weight: 103, range: {min:  20, max:  33}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.GREEN,  size:  '2',   weight: 117, range: {min:  24, max:  41}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.RED,    size:  '3',   weight: 128, range: {min:  29, max:  50}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.YELLOW, size:  '4',   weight: 254, range: {min:  38, max:  64}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.BLUE,   size:  '5',   weight: 208, range: {min:  50, max:  85}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.SILVER,  size:  '6',   weight: 299, range: {min:  68, max: 114}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.PURPLE,  size:  '7',   weight: 362, range: {min:  88, max: 149}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'DMM', model: 'Dragon', color: Pro.GREEN,  size:  '8',   weight: 515, range: {min: 116, max: 195}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))

// fixe - alien x
prolist.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'ALIEN X', color: Pro.BLACK,  size: '1/3', weight: 55, range: {min:  9.3, max: 14.0}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'ALIEN X', color: Pro.BLUE,   size: '3/8', weight: 56, range: {min: 10.8, max: 16.1}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'ALIEN X', color: Pro.GREEN,  size: '1/2', weight: 60, range: {min: 13.8, max: 20.8}, strength: {active:  7, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'ALIEN X', color: Pro.YELLOW, size: '3/4', weight: 64, range: {min: 16.1, max: 25.7}, strength: {active: 10, passive:    5}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'ALIEN X', color: Pro.SILVER, size: '7/8', weight: 66, range: {min: 18.6, max: 28.0}, strength: {active: 10, passive:    5}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'ALIEN X', color: Pro.RED,    size: '1',   weight: 70, range: {min: 20.3, max: 33.4}, strength: {active: 10, passive:    5}, stem: Pro.FLEX}))

// metolius - master
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.SILVER, size: '00', weight:  45, range: {min:  8.5, max: 12.0}, strength: {active:   5, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.PURPLE, size:  '0', weight:  45, range: {min: 10.0, max: 15.0}, strength: {active:   5, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.BLUE,   size:  '1', weight:  52, range: {min: 12.5, max: 18.0}, strength: {active:   8, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.YELLOW, size:  '2', weight:  55, range: {min: 15.5, max: 22.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.ORANGE, size:  '3', weight:  65, range: {min: 18.5, max: 26.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.RED,    size:  '4', weight:  75, range: {min: 23.5, max: 33.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.BLACK,  size:  '5', weight:  85, range: {min: 28.0, max: 39.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.GREEN,  size:  '6', weight:  96, range: {min: 32.5, max: 48.0}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.BLUE,   size:  '7', weight: 112, range: {min: 40.0, max: 57.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'Master', color: Pro.PURPLE, size:  '8', weight: 129, range: {min: 48.5, max: 71.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))

// // metolius - tcu
// prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'TCU', color: Pro.SILVER, size: '00', weight: 41, range: {min:  8.5, max: 12.0}, strength: {active:   5, passive: null}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'TCU', color: Pro.PURPLE, size:  '0', weight: 43, range: {min: 10.0, max: 15.0}, strength: {active:   5, passive: null}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'TCU', color: Pro.BLUE,   size:  '1', weight: 50, range: {min: 12.5, max: 18.0}, strength: {active:   8, passive: null}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'TCU', color: Pro.YELLOW, size:  '2', weight: 57, range: {min: 15.5, max: 22.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'TCU', color: Pro.ORANGE, size:  '3', weight: 59, range: {min: 18.5, max: 26.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
// prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'TCU', color: Pro.RED,    size:  '4', weight: 68, range: {min: 23.5, max: 33.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))

// metolius - supercam
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'SUPERCAM', color: Pro.SILVER, size: 'S', weight: 184, range: {min: 42.0, max:  63.4}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'SUPERCAM', color: Pro.RED,    size: 'M', weight: 255, range: {min: 52.5, max:  91.5}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Metolius', model: 'SUPERCAM', color: Pro.BLUE,   size: 'L', weight: 312, range: {min: 66.5, max: 118.5}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))

// totem
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.BLACK,  size: '0.50', weight:  69, range: {min: 11.7, max: 18.9}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.BLUE,   size: '0.65', weight:  75, range: {min: 13.8, max: 22.5}, strength: {active:  8, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.YELLOW, size: '0.80', weight:  83, range: {min: 17.0, max: 27.7}, strength: {active:  9, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.PURPLE, size: '1.00', weight:  95, range: {min: 20.9, max: 34.2}, strength: {active: 10, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.GREEN,  size: '1.25', weight: 109, range: {min: 25.7, max: 42.3}, strength: {active: 13, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.RED,    size: '1.50', weight: 132, range: {min: 31.6, max: 52.2}, strength: {active: 13, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.ORANGE, size: '1.80', weight: 144, range: {min: 39.7, max: 64.2}, strength: {active: 13, passive: null}, stem: Pro.FLEX}))

// trango - flex
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.YELLOW, size:  '1', weight:  58, range: {min: 11, max:  17}, strength: {active:  7, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.BLUE,   size:  '2', weight:  60, range: {min: 15, max:  21}, strength: {active:  7, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.SILVER, size:  '3', weight:  73, range: {min: 19, max:  27}, strength: {active: 10, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.PURPLE, size:  '4', weight:  81, range: {min: 24, max:  33}, strength: {active: 10, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.GREEN,  size:  '5', weight: 121, range: {min: 27, max:  43}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.RED,    size:  '6', weight: 128, range: {min: 34, max:  55}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.YELLOW, size:  '7', weight: 148, range: {min: 44, max:  68}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.BLUE,   size:  '8', weight: 182, range: {min: 53, max:  86}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.SILVER, size:  '9', weight: 233, range: {min: 63, max: 107}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.PURPLE, size: '10', weight: 332, range: {min: 81, max: 134}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))

// wild country - friend
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.SILVER, size: '.4',  weight:  75, range: {min: 15.8, max:  26.4}, strength: {active:  9, passive:  9}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.PURPLE, size: '.5',  weight:  88, range: {min: 20.6, max:  34.5}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.GREEN,  size: '.75', weight: 102, range: {min: 25.8, max:  43.0}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.RED,    size: '1',   weight: 123, range: {min: 31.7, max:  53.6}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.YELLOW, size: '2',   weight: 142, range: {min: 41.5, max:  69.3}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.BLUE,   size: '3',   weight: 192, range: {min: 52.7, max:  88.0}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Friend', color: Pro.SILVER, size: '4',   weight: 260, range: {min: 66.8, max: 112.1}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))

// wild country - friend zero
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Zero', color: Pro.RED,    size: '.1',  weight: 49, range: {min:  8.5, max: 13.2}, strength: {active: 5, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Zero', color: Pro.YELLOW, size: '.2',  weight: 51, range: {min: 10.4, max: 15.7}, strength: {active: 6, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Zero', color: Pro.BLUE,   size: '.3',  weight: 68, range: {min: 13.8, max: 22.3}, strength: {active: 8, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Zero', color: Pro.SILVER, size: '.4',  weight: 70, range: {min: 15.8, max: 25.9}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Zero', color: Pro.PURPLE, size: '.5',  weight: 76, range: {min: 20.2, max: 32.9}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))
prolist.add(new Pro({type: Pro.SLCD, brand: 'WC', model: 'Zero', color: Pro.GREEN,  size: '.75', weight: 81, range: {min: 25.4, max: 40.1}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))

/* generate charts
================================================================================================ */

// media query
const widthTabletDesktop = window.matchMedia('(min-width: 550px)')
const axleOffset = widthTabletDesktop.matches ? 2 : 0

// plugins
// annotation plugin is automatically registered from the script tag
Chart.register(ChartDataLabels)

/*****************************************/
/*        micro cam range charts         */
/*****************************************/
const microCamList = prolist.filter((pro) => {
  return pro.operationalRange.min < 12.5
})

microCamList.sort((a, b) => {
  return a.operationalRange.min - b.operationalRange.min
})

const canvasMicroCams = document.getElementById('micro-cams')
canvasMicroCams.parentElement.style.height = ((microCamList.length * 36) + 75) + 'px'
new Chart(canvasMicroCams, {
  type: 'bar',
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        min: microCamList.linearScale('ex', 6).min,
        max: microCamList.linearWeightScale('ex', 2).max,
      },
      y: {
        stacked: true,
      }
    }
  },
  data: {
    labels: Array(microCamList.length).fill(''),
    datasets: [
      {
        label: 'Expansion Range',
        barPercentage: 1,
        data: microCamList.chartDataExpansionRange(),
        backgroundColor: 'hsla(0 0 0 / 0)',
        borderColor: '#41444B',
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 15,
        datalabels: {
          labels: {
            brand: {
              color: '#41444B',
              anchor: 'start',
              align: 'left',
              formatter: function (value, context) {
                let pro = microCamList.list[context.dataIndex]
                return [pro.brand, pro.model, pro.size].join(' ')
              }
            }
          }
        }
      },
      {
        label: 'Operational Range',
        data: microCamList.chartDataOperationalRange(),
        backgroundColor: microCamList.chartProColor(),
        datalabels:{
          labels: {
            rangeDelta: {
              align: 'center',
              anchor: 'center',
              color: function(context) {
                return microCamList.list[context.dataIndex].color == Pro.BLACK ? 'hsl(42deg 24% 92%)' : '#41444B'
              },
              font: {
                family: 'Roboto',
                weight: 'bold',
                size: 12
              },
              formatter: function (value, context) {
                return (value[1] - value[0]).toFixed(1) + 'mm'
              }
            }
          }
        }
      }
    ]
  }
})

/*****************************************/
/*        small cam range charts         */
/*****************************************/

const smallCamList = prolist.filter((pro) => {
  return pro.operationalRange.min >= 12 && pro.operationalRange.min <= 25
})

smallCamList.sort((a, b) => {
  return a.operationalRange.min - b.operationalRange.min
})

const canvasSmallCams = document.getElementById('small-cams')
canvasSmallCams.parentElement.style.height = ((smallCamList.length * 36) + 75) + 'px'
new Chart(canvasSmallCams, {
  type: 'bar',
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        min: smallCamList.linearScale('ex', 10).min,
        max: smallCamList.linearWeightScale('ex', 2).max,
      },
      y: {
        stacked: true,
      }
    }
  },
  data: {
    labels: Array(smallCamList.length).fill(''),
    datasets: [
      {
        label: 'Expansion Range',
        barPercentage: 1,
        data: smallCamList.chartDataExpansionRange(),
        backgroundColor: 'hsla(0 0 0 / 0)',
        borderColor: '#41444B',
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 15,
        datalabels: {
          labels: {
            brand: {
              color: '#41444B',
              anchor: 'start',
              align: 'left',
              formatter: function (value, context) {
                let pro = smallCamList.list[context.dataIndex]
                return [pro.brand, pro.model, pro.size].join(' ')
              }
            }
          }
        }
      },
      {
        label: 'Operational Range',
        data: smallCamList.chartDataOperationalRange(),
        backgroundColor: smallCamList.chartProColor(),
        datalabels:{
          labels: {
            rangeDelta: {
              align: 'center',
              anchor: 'center',
              color: function(context) {
                return smallCamList.list[context.dataIndex].color == Pro.BLACK ? 'hsl(42deg 24% 92%)' : '#41444B'
              },
              font: {
                family: 'Roboto',
                weight: 'bold',
                size: 12
              },
              formatter: function (value, context) {
                return (value[1] - value[0]).toFixed(1) + 'mm'
              }
            }
          }
        }
      }
    ]
  }
})

/*****************************************/
/*       medium cam range charts         */
/*****************************************/

const medCamList = prolist.filter((pro) => {

  return pro.operationalRange.min >= 25 && pro.operationalRange.min <= 54
})

medCamList.sort((a, b) => {
  return a.operationalRange.min - b.operationalRange.min
})

const canvasMedCams = document.getElementById('med-cams')
canvasMedCams.parentElement.style.height = ((medCamList.length * 36) + 75) + 'px'
new Chart(canvasMedCams, {
  type: 'bar',
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        min: medCamList.linearScale('ex', 10).min,
        max: medCamList.linearWeightScale('ex', 2).max,
      },
      y: {
        stacked: true,
      }
    }
  },
  data: {
    labels: Array(medCamList.length).fill(''),
    datasets: [
      {
        label: 'Expansion Range',
        barPercentage: 1,
        data: medCamList.chartDataExpansionRange(),
        backgroundColor: 'hsla(0 0 0 / 0)',
        borderColor: '#41444B',
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 15,
        datalabels: {
          labels: {
            brand: {
              color: '#41444B',
              anchor: 'start',
              align: 'left',
              formatter: function (value, context) {
                let pro = medCamList.list[context.dataIndex]
                return [pro.brand, pro.model, pro.size].join(' ')
              }
            }
          }
        }
      },
      {
        label: 'Operational Range',
        data: medCamList.chartDataOperationalRange(),
        backgroundColor: medCamList.chartProColor(),
        datalabels:{
          labels: {
            rangeDelta: {
              align: 'center',
              anchor: 'center',
              color: function(context) {
                return medCamList.list[context.dataIndex].color == Pro.BLACK ? 'hsl(42deg 24% 92%)' : '#41444B'
              },
              font: {
                family: 'Roboto',
                weight: 'bold',
                size: 12
              },
              formatter: function (value, context) {
                return (value[1] - value[0]).toFixed(1) + 'mm'
              }
            }
          }
        }
      }
    ]
  }
})

/*****************************************/
/*       large cam range charts         */
/*****************************************/

const largeCamList = prolist.filter((pro) => {
  return pro.operationalRange.min >= 53 && pro.operationalRange.min <= 125
})

largeCamList.sort((a, b) => {
  return a.operationalRange.min - b.operationalRange.min
})

const canvasLargeCams = document.getElementById('large-cams')
canvasLargeCams.parentElement.style.height = ((largeCamList.length * 36) + 75) + 'px'
new Chart(canvasLargeCams, {
  type: 'bar',
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        min: largeCamList.linearScale('ex', 10).min,
        max: largeCamList.linearWeightScale('ex', 2).max,
      },
      y: {
        stacked: true,
      }
    }
  },
  data: {
    labels: Array(largeCamList.length).fill(''),
    datasets: [
      {
        label: 'Expansion Range',
        barPercentage: 1,
        data: largeCamList.chartDataExpansionRange(),
        backgroundColor: 'hsla(0 0 0 / 0)',
        borderColor: '#41444B',
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 15,
        datalabels: {
          labels: {
            brand: {
              color: '#41444B',
              anchor: 'start',
              align: 'left',
              formatter: function (value, context) {
                let pro = largeCamList.list[context.dataIndex]
                return [pro.brand, pro.model, pro.size].join(' ')
              }
            }
          }
        }
      },
      {
        label: 'Operational Range',
        data: largeCamList.chartDataOperationalRange(),
        backgroundColor: largeCamList.chartProColor(),
        datalabels:{
          labels: {
            rangeDelta: {
              align: 'center',
              anchor: 'center',
              color: function(context) {
                return largeCamList.list[context.dataIndex].color == Pro.BLACK ? 'hsl(42deg 24% 92%)' : '#41444B'
              },
              font: {
                family: 'Roboto',
                weight: 'bold',
                size: 12
              },
              formatter: function (value, context) {
                return (value[1] - value[0]).toFixed(1) + 'mm'
              }
            }
          }
        }
      }
    ]
  }
})

/*****************************************/
/* expansion vs operational range charts */
/*****************************************/
const marketCamList = prolist.filter((pro) => {
  if (pro.model == 'C4' && ['0.75', '#2'].includes(pro.size)) {
    return true
  } else {
    return false
  }
})

const redLineAnnotation = {
  type: 'line',
  mode: 'vertical',
  scaleID: 'x',
  value: 36.5,
  borderColor: '#e74c3c',
  borderWidth: 2,
  label: {
    enabled: true,
    content: 'Vertical Line'
  }
}

// Figure 1
const canvasFigureEvo1 = document.getElementById('figure-evo-1')
canvasFigureEvo1.parentElement.style.height = ((marketCamList.length * 32) + 108) + 'px'
const chartFigure1 = new Chart(canvasFigureEvo1, {
  type: 'bar',
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations: [redLineAnnotation]
      },
      legend: {
        display: true
      },
      title: {
        display: true,
        position: 'bottom',
        text: 'Figure 1'
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        min: marketCamList.linearScale('ex', 2).min,
        max: marketCamList.linearScale('ex', 2).max
      }
    }
  },
  data: {
    labels: marketCamList.chartLabels(),
    datasets: [
      {
        label: 'Expansion Range',
        data: marketCamList.chartDataExpansionRange(),
        backgroundColor: marketCamList.chartProColor(),
        datalabels:{
          align: 'center',
          anchor: 'center',
          color: 'black',
          font: {
            family: 'Roboto'
          },
          formatter: function (value, context) {
            return (value[1] - value[0]).toFixed(0) + 'mm'
          }
        }
      }
    ]
  }
})

const canvasFigureEvo2 = document.getElementById('figure-evo-2')
canvasFigureEvo2.parentElement.style.height = ((marketCamList.length * 36) + 108) + 'px'
const chartMarketCam = new Chart(canvasFigureEvo2, {
  type: 'bar',
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations: [redLineAnnotation]
      },
      legend: {
        display: true
      },
      title: {
        display: true,
        position: 'bottom',
        text: 'Figure 2'
      }
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: false,
        min: marketCamList.linearScale('ex', 2).min,
        max: marketCamList.linearScale('ex', 2).max
      },
      y: {
        stacked: true
      }
    }
  },
  data: {
    labels: marketCamList.chartLabels(),
    datasets: [
      {
        label: 'Expansion Range',
        barPercentage: 1,
        data: marketCamList.chartDataExpansionRange(),
        backgroundColor: 'hsla(0 0 0 / 0)',
        borderColor: '#41444B',
        borderWidth: 3,
        borderSkipped: false,
        borderRadius: 15,
        datalabels: {
          display: false
        }
      },
      {
        label: 'Operational Range',
        data: marketCamList.chartDataOperationalRange(),
        backgroundColor: marketCamList.chartProColor(),
        datalabels:{
          labels: {
            value: {
              align: 'center',
              anchor: 'center',
              color: 'black',
              font: {
                family: 'Roboto'
              },
              formatter: function (value, context) {
                return (value[1] - value[0]).toFixed(0) + 'mm'
              }
            }
          }
        }
      }
    ]
  }
})

