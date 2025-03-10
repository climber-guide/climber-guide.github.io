/**
 * pro.js v0.1.1
 * (c) 2025 climber's guide contributers
 * released under the gpl-3.0 license
 */

class DualRangeInput {
  /**
   * @param {HTMLInputElement} $min - The range input element for the minimum value
   * @param {HTMLInputElement} $max - The range input element for the maximum value
   * @param {number} [precision=3] - The number of decimal places to round the mid value to, defaults to 3
   */
  constructor($min, $max, precision = 3) {
      this.updateFloor = () => this.update('floor');
      this.updateCeil = () => this.update('ceil');
      this.$min = $min;
      this.$max = $max;
      this.precision = precision;
      this.$min.addEventListener('input', this.updateCeil);
      this.$max.addEventListener('input', this.updateFloor);
      this.$min.addEventListener('focus', this.updateCeil);
      this.$max.addEventListener('focus', this.updateFloor);
      // Unfortunately Safari doesn't trigger focus on mousedown or touchstart
      // like other browsers do, so we have to listen for those events as well
      this.$min.addEventListener('mousedown', this.updateCeil);
      this.$max.addEventListener('mousedown', this.updateFloor);
      this.$min.addEventListener('touchstart', this.updateCeil);
      this.$max.addEventListener('touchstart', this.updateFloor);
      this.update();
      this.$min.dataset.ready = 'true';
      this.$max.dataset.ready = 'true';
  }
  update(method = 'ceil') {
      const thumbWidthVar = 'var(--dri-thumb-width)';
      const min = parseFloat(this.$min.min);
      const max = parseFloat(this.$max.max);
      const step = parseFloat(this.$min.step) || 1;
      const minValue = parseFloat(this.$min.value);
      const maxValue = parseFloat(this.$max.value);
      const midValue = (maxValue - minValue) / 2;
      const mid = minValue + Math[method](midValue / step) * step;
      const range = max - min;
      const leftWidth = (((mid - min) / range) * 100).toFixed(this.precision);
      const rightWidth = (((max - mid) / range) * 100).toFixed(this.precision);
      this.$min.style.flexBasis = `calc(${leftWidth}% + ${thumbWidthVar})`;
      this.$max.style.flexBasis = `calc(${rightWidth}% + ${thumbWidthVar})`;
      this.$min.max = mid.toFixed(this.precision);
      this.$max.min = mid.toFixed(this.precision);
      const minFill = (minValue - min) / (mid - min) || 0;
      const maxFill = (maxValue - mid) / (max - mid) || 0;
      const minFillPercentage = (minFill * 100).toFixed(this.precision);
      const maxFillPercentage = (maxFill * 100).toFixed(this.precision);
      const minFillThumb = (0.5 - minFill).toFixed(this.precision);
      const maxFillThumb = (0.5 - maxFill).toFixed(this.precision);
      this.$min.style.setProperty('--dri-gradient-position', `calc(${minFillPercentage}% + (${minFillThumb} * ${thumbWidthVar}))`);
      this.$max.style.setProperty('--dri-gradient-position', `calc(${maxFillPercentage}% + (${maxFillThumb} * ${thumbWidthVar}))`);
  }
  destroy() {
      this.$min.removeEventListener('input', this.updateFloor);
      this.$max.removeEventListener('input', this.updateCeil);
      this.$min.removeEventListener('focus', this.updateFloor);
      this.$max.removeEventListener('focus', this.updateCeil);
      this.$min.removeEventListener('mousedown', this.updateCeil);
      this.$max.removeEventListener('mousedown', this.updateFloor);
      this.$min.removeEventListener('touchstart', this.updateCeil);
      this.$max.removeEventListener('touchstart', this.updateFloor);
  }
}

class Pro {
  // Pro Types
  static get BALLNUT()  { return 'Ball Nut' }
  static get BIGBRO()   { return 'Big Bro'  }
  static get HEX()      { return 'Hex'      }
  static get NUT()      { return 'Nut'      }
  static get CAM()      { return 'Cam'     }
  static get TRICAM()   { return 'Tricam'   }

  // Pro Colors
  static get RED()    { return '#C96868' }
  static get ORANGE() { return '#FFB26F' }
  static get YELLOW() { return '#FADFA1' }
  static get GREEN()  { return '#9DBC98' }
  static get BLUE()   { return '#8CC0DE' }
  static get PURPLE() { return '#A888B5' }
  static get SILVER() { return '#C7C8CC' }
  static get BLACK()  { return '#41444B' }

  // Pro Stem
  static get FLEX()   { return 'Flex'  }
  static get RIGID()  { return 'Rigid' }

  // Pro Range Type
  static get EXPANSION()    { return 'Expansion Range'   }
  static get OPERATIONAL()  { return 'Operational Range' }

  // Pro Weight Enum
  static get WEIGHT() { return 'Weight' }

  /**
   *  @param {object} pro - a piece of gear used in traditional climbing
   *    @param {string} pro.type - see Pro Types (ex: Pro.HEX)
   *    @param {string} pro.brand - brand name
   *    @param {string} pro.brandShort - shorthand
   *    @param {string} pro.model - model name
   *    @param {string} pro.modelShort - shorthand
   *    @param {string} pro.color - see Pro Colors (ex: Pro.BLUE)
   *    @param {string} pro.size - type string needed for format
   *    @param {number} pro.weight - grams (g)
   *    @param {object} pro.range - the physical / expansion range
   *      @param {number} pro.range.min - expansion range. millimeters (mm)
   *      @param {number} pro.range.max - expansion range. millimeters (mm)
   *    @param {object} pro.strength - max holding power before device failure
   *      @param {number} pro.strength.active  - kilonewtons (kn)
   *      @param {number} pro.strength.passive - kilonewtons (kn)
   */
  constructor({
    type = null,
    brand = null, brandShort = null,
    model = null, modelShort = null,
    color = null,
    size = null,
    weight = null,
    range: {min = null, max = null},
    strength: {active  = null, passive = null},
    stem = null
  } = {}) {
    this.type = type
    this.brand = brand
    this.brandShort = brandShort
    this.model = model
    this.modelShort = modelShort
    this.color = color
    this.size = size
    this.weight = weight
    this.range = {
      expansion: {
        min: min,
        max: max
      },
      operational: {
        min: null,
        max: null
      }
    }
    this.strength = {
      active: active,
      passive: passive
    }
    this.stem = stem

    // determine operational range if applicable
    if (this.strength.active != null) {
      let rangeDelta = this.range.expansion.max - this.range.expansion.min
      this.range.operational.min = ((rangeDelta * 0.10) + this.range.expansion.min).toFixed(1)
      this.range.operational.max = (this.range.expansion.max - (rangeDelta * 0.25)).toFixed(1)
      if (this.type == Pro.BIGBRO) this.range.operational.max = this.range.expansion.max
    }
  }

  /**
   * hasActiveStrength
   * 
   * @returns {boolean} true if active strength, otherwise false
   */
  hasActiveStrength() {
    return this.strength.active != null
  }

  /**
   * hasPassiveStrength
   * 
   * @returns {boolean} true if passive strength, otherwise false
   */
  hasPassiveStrength() {
    return this.strength.passive != null
  }

  /**
   * hasHybridStrength
   * 
   * @returns {boolean} true if active and passive strength, otherwise false
   */
  hasHybridStrength() {
    return this.hasActiveStrength() && this.hasPassiveStrength()
  }

  /**
   * label
   * 
   * generates a label the may be displayed for the given pro.
   * if shorthand is not available, it will default to full string.
   * if model is not available, it will be skipped.
   * 
   *  @param {Object} configuration
   *    @param {boolean} brand - show brand
   *    @param {boolean} brandShort - use brand shorthand if true (brand must be true)
   *    @param {boolean} model - show model
   *    @param {boolean} modelShort - use model shorthand if true (model must be true)
   *    @param {boolean} size - show size
   * 
   *  @return {string} label
   */
  label({brand = true, brandShort = false, model = true, modelShort = false, size = true} = {}) {
    const label = []

    // brand
    if (brand == true) {
      if (brandShort == true && this.brandShort != null) {
        label.push(this.brandShort)
      } else if (this.brand != null) {
        label.push(this.brand)
      }
    }

    // model
    if (model == true) {
      if (modelShort == true && this.modelShort != null) {
        label.push(this.modelShort)
      } else if (this.model != null) {
        label.push(this.model)
      }
    }

    // size
    if (size == true && this.size != null) {
      label.push(this.size)
    }

    return label.join(' ')
  }
}

class ProLib {
  constructor(list = []) {
    this.library = list
    this.list = list
    this.filter = {
      range: {
        min: 0,
        max: 0
      },
      brand: {
        include: new Set(),
        exclude: new Set()
      },
      model: {
        include: new Set(),
        exclude: new Set()
      }
    }
    this.chart = {
      id: null,
      instance: null
    }
  }

  /**
   * get length
   * 
   * @returns {number} quantity of protection in library
   */
  get length() {
    return this.list.length
  }

  get absMin() {
    const minimums = this.list.map((pro) => pro.range.expansion.min)
    return Math.min(...minimums)
  }

  get absMax() {
    const maximums = this.list.map((pro) => pro.range.expansion.max)
    return Math.max(...maximums)
  }

  /**
   * add
   * 
   * @param {Pro} pro - an instance of pro
   */
  add(pro) {
    this.library.push(pro)
  }

  /**
   * Sort
   * 
   * @param {func} sortFunction - passed to array array method
   * 
   * @return {ProLib} returns new instance of ProLib with only pro from filter
   */
  sort(sortFunction) {
    this.list.sort(sortFunction)
  }

  /**
   * chartLabels
   * 
   * @returns {array.<string>} list of each pro's label
   */
  chartLabels() {
    return this.list.map((pro) => {
      return pro.label()
    })
  }

  /**
   * chartRanges
   * 
   * @param {String} type - Pro.EXPANSION or Pro.OPERATIONAL
   * 
   * @returns {array.<array>} list of each pro's range
   */
  chartRanges(type) {
    return this.list.map((pro) => {
      if (type == Pro.EXPANSION) {
        return [pro.range.expansion.min, pro.range.expansion.max]
      } else {
        return [pro.range.operational.min, pro.range.operational.max]
      }
    })
  }

  chartWeights() {
    return this.list.map((pro) => {
      return pro.weight
    })
  }

  /**
   * 
   * @param {string} scale - Pro.EXPANSION or Pro.OPERATIONAL or Pro.WEIGHT
   * @param {number} percent - 0 to 1, % to pad data
   * 
   * @returns {number} padding value
   */
  ChartScaleMinMax(scale, percent) {
    let min = null
    let max = null

    if (this.length == 0) return {min: this.filter.range.min, max: this.filter.range.max}
    
    if (scale == Pro.EXPANSION) {
      min = this.list[0].range.expansion.min
      max = this.list[0].range.expansion.max
      this.list.forEach((pro) => {
        min = min <= pro.range.expansion.min ? min : pro.range.expansion.min
        max = max >= pro.range.expansion.max ? max : pro.range.expansion.max
      })
    }
    
    if (scale == Pro.OPERATIONAL) {
      min = this.list[0].range.operational.min
      max = this.list[0].range.operational.max
      this.list.forEach((pro) => {
        min = min <= pro.range.operational.min ? min : pro.range.operational.min
        max = max >= pro.range.operational.max ? max : pro.range.operational.max
      })
    }

    if (scale == Pro.WEIGHT) {
      min = this.list[0].weight
      max = this.list[0].weight
      this.list.forEach((pro) => {
        min = min <= pro.weight ? min : pro.weight
        max = max >= pro.weight ? max : pro.weight
      })
    }

    const pad = (max - min) * percent
    return {min: Math.floor(min - pad), max: Math.ceil(max + pad)}
  }
  
  applyFilter() {
    this.list = this.list.filter((pro) => {
      const b2mMap = new Map([
        ['Black Diamond', new Set(['Camalot C4', 'Camalot Ultralight', 'Camalot Z4'])],
        ['DMM Wales', new Set(['Dragonfly', 'Dragon'])],
        ['FIXE', new Set(['Alien', 'Alien Revolution', 'Alien X'])],
        ['Metolius', new Set(['Master Cam', 'TCU Ultralight', 'Power Cam', 'Supercam', 'Fat Cam'])],
        ['Totem', new Set([])],
        ['Trango', new Set(['Flex'])],
        ['Wild Country', new Set(['Friend', 'Friend Zero'])]
      ])
      const brand = this.filter.brand
      const model = this.filter.model
      
      // exclude
      if(brand.exclude.has(pro.brand) || model.exclude.has(pro.model)) return false
      // include
      if (brand.include.size != 0 || model.include.size != 0) {
        if (brand.include.has(pro.brand) == false && model.include.has(pro.model) == false) {
          return false
        }
        if (brand.include.has(pro.brand) && model.include.has(pro.model) == false) {
          let remove = false
          b2mMap.get(pro.brand).forEach((m) => {
            if (model.include.has(m)) {
              remove = true
            }
          })
          if (remove) return false
        }
      }
      // if (brand.include.size != 0 && brand.include.has(pro.brand) == false) return false
      // if (model.include.size != 0 && model.include.has(pro.model) == false) return false
      // range
      if (pro.range.expansion.min < this.filter.range.min) return false
      if (pro.range.expansion.max > this.filter.range.max) return false
      return true
    })
  }

  generateChart(id) {
    this.chart.id = id
    const canvas = document.getElementById(this.chart.id)
    this.applyFilter()
    this.chart.instance = new Chart(canvas, {type: 'bar'})
    this.updateChart()
  }


  updateChart() {

    // update list based on current filters
    this.list = this.library
    this.applyFilter()
    this.sort((pro1, pro2) => {
      const minDelta = pro1.range.operational.min - pro2.range.operational.min
      const maxDelta = pro1.range.operational.max - pro2.range.operational.max
      const weightDelta = pro1.weight - pro2.weight
      if (minDelta != 0) return minDelta
      else if (maxDelta != 0) return maxDelta
      else return weightDelta
    })

    // data
    this.chart.instance.data.labels = this.chartLabels()
    this.chart.instance.data.datasets = [
      {
        // data
        type: 'line',
        label: 'Weight (g)',
        data: this.chartWeights(),

        // color
        backgroundColor: Pro.BLACK,
        borderColor: '#C1BAA190',
        // borderColor: 'hsl(0 0 0  / 0)',
        pointBackgroundColor: Pro.BLACK,
        pointBorderColor: '#C1BAA1',

        // point
        pointBorderWidth: 2,
        pointRadius: 6,
        pointStyle: 'rectRot',

        // scale
        xAxisID: 'weight',

        // labels
        datalabels: {
          display: false
        }
      },
      {
        // data
        label: Pro.OPERATIONAL + ' (mm)',
        data: this.chartRanges(Pro.OPERATIONAL),

        // border
        borderSkipped: false,
        borderWidth: 4,

        // color
        backgroundColor: (context) => {
          if (this.length != 0) return this.list[context.dataIndex].color
          else return '#000000'
        },
        borderColor: Pro.BLACK,

        // size
        barPercentage: 0.85,
        categoryPercentage: 1,

        // labels
        datalabels: {
          labels: {
            delta: {
              align: 'center',
              anchor: 'center',
              color: (context) => {
                if (this.length == 0) return '#000000'
                const pro = this.list[context.dataIndex]
                return pro.color != Pro.BLACK ? Pro.BLACK : 'hsl(42deg 24% 92%)'
              },
              font: {
                family: 'Roboto',
                weight: 'bold',
                size: 12
              },
              formatter: function (value, context) {
                return (value[1] - value[0]).toFixed(1)
              }
            }
          }
        }
      },
      {
        // data
        label: Pro.EXPANSION + ' (mm)',
        data: this.chartRanges(Pro.EXPANSION),

        // border
        borderSkipped: false,
        borderWidth: 4,
        
        // color
        backgroundColor: 'hsl(42deg 24% 92%)',
        borderColor: Pro.BLACK,
        
        // size
        barPercentage: 0.85,
        categoryPercentage: 1,

        // labels
        datalabels: {
          labels: {
            brand: {
              color: Pro.BLACK,
              anchor: 'start',
              align: 'left',
              font: {
                weight: 'bold'
              },
              formatter: (value, context) => {
                if (this.length == 0) return ''
                const pro = this.list[context.dataIndex]
                return pro.label({brandShort: true, modelShort: true})
              }
            }
          }
        }
      }
    ]

    // options
    this.chart.instance.options.indexAxis = 'y'
    this.chart.instance.options.maintainAspectRatio = false
    this.chart.instance.options.responsive = true

    // scales
    this.chart.instance.options.scales.y = {
      alignToPixels: true,
      stacked: true,
      grid: {
        display: false
      },
      ticks: {
        display: false
      }
    }
    this.chart.instance.options.scales.x = {
      alignToPixels: true,
      position: 'top',
      min: this.ChartScaleMinMax(Pro.EXPANSION, .08).min,
      max: this.ChartScaleMinMax(Pro.EXPANSION, .16).max,
      grid: {
        color: Pro.BLUE + '90'
      },
      ticks: {
        color: Pro.BLACK + '90',
        font: {
          size: 14
        }
      }
    }
    this.chart.instance.options.scales.weight = {
      alignToPixels: true,
      position: 'bottom',
      // min: this.ChartScaleMinMax(Pro.WEIGHT, .48).min,
      min: 0,
      max: this.ChartScaleMinMax(Pro.WEIGHT, .02).max,
      grid: {
        color: '#C1BAA1',
        display: false
      },
      ticks: {
        color: '#C1BAA1',
        font: {
          weight: 'bold',
          size: 14
        }
      }
    }

    // chart height
    document.getElementById(this.chart.id).parentElement.style.height = ((this.length * 32) + 103) + 'px'
    
    // update based on settings above
    this.chart.instance.update()
  }
}

/* Protection Library
================================================================================================ */
const prolib = new ProLib()

// black diamond - camalot c3
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C3', modelShort: 'C3', color: Pro.SILVER, size: '000', weight: 56, range: {min:  7.8, max: 12.9}, strength: {active:  4, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C3', modelShort: 'C3', color: Pro.PURPLE, size: '00',  weight: 58, range: {min:  8.9, max: 13.7}, strength: {active:  6, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C3', modelShort: 'C3', color: Pro.GREEN,  size: '0',   weight: 59, range: {min: 10.2, max: 15.8}, strength: {active:  7, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C3', modelShort: 'C3', color: Pro.RED,    size: '1',   weight: 64, range: {min: 12.0, max: 18.8}, strength: {active: 10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C3', modelShort: 'C3', color: Pro.YELLOW, size: '2',   weight: 66, range: {min: 14.2, max: 22.6}, strength: {active: 10, passive: null}, stem: Pro.RIGID}))

// black diamond - camalot c4
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.BLUE,   size: '0.3',   weight:  70, range: {min:  13.8, max:  23.4}, strength: {active:  8, passive:  8}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.SILVER, size: '0.4',   weight:  78, range: {min:  15.5, max:  26.7}, strength: {active:  9, passive:  9}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.PURPLE, size: '0.5',   weight:  93, range: {min:  19.6, max:  33.5}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.GREEN,  size: '0.75',  weight: 108, range: {min:  23.9, max:  41.2}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.RED,    size: '#1',    weight: 124, range: {min:  30.2, max:  52.1}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.YELLOW, size: '#2',    weight: 140, range: {min:  37.2, max:  64.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.BLUE,   size: '#3',    weight: 180, range: {min:  50.7, max:  87.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.SILVER, size: '#4',    weight: 257, range: {min:  66.0, max: 114.7}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.PURPLE, size: '#5',    weight: 348, range: {min:  85.4, max: 148.5}, strength: {active: 14, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.GREEN,  size: '#6',    weight: 530, range: {min: 114.1, max: 195.0}, strength: {active: 14, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.RED,    size: '#7',    weight: 710, range: {min: 150.0, max: 253.3}, strength: {active:  8, passive:  8}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot C4', modelShort: 'C4', color: Pro.YELLOW, size: '#8',    weight: 974, range: {min: 193.0, max: 321.2}, strength: {active:  5, passive:  5}, stem: Pro.RIGID}))

// black diamond - camalot ul
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.SILVER, size: '0.4',   weight:  61, range: {min:  15.5, max:  26.7}, strength: {active:  8, passive:  8}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.PURPLE, size: '0.5',   weight:  74, range: {min:  19.6, max:  33.5}, strength: {active: 10, passive: 10}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.GREEN,  size: '0.75',  weight:  89, range: {min:  23.9, max:  41.2}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.RED,    size: '#1',    weight: 101, range: {min:  30.2, max:  52.1}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.YELLOW, size: '#2',    weight: 126, range: {min:  37.2, max:  64.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.BLUE,   size: '#3',    weight: 167, range: {min:  50.7, max:  87.9}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Ultralight', modelShort: 'UL', color: Pro.SILVER, size: '#4',    weight: 225, range: {min:  66.0, max: 114.7}, strength: {active: 12, passive: 12}, stem: Pro.RIGID}))

// black diamond - camalot x4
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot X4', modelShort: 'X4', color: Pro.RED,    size: '0.1',  weight:  51, range: {min:  8.4, max: 13.8}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot X4', modelShort: 'X4', color: Pro.YELLOW, size: '0.2',  weight:  54, range: {min:  9.9, max: 16.5}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot X4', modelShort: 'X4', color: Pro.BLUE,   size: '0.3',  weight:  75, range: {min: 12.4, max: 21.2}, strength: {active:  8, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot X4', modelShort: 'X4', color: Pro.GRAY,   size: '0.4',  weight:  82, range: {min: 15.5, max: 26.6}, strength: {active: 10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot X4', modelShort: 'X4', color: Pro.PURPLE, size: '0.5',  weight:  91, range: {min: 19.8, max: 33.7}, strength: {active: 10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot X4', modelShort: 'X4', color: Pro.GREEN,  size: '0.75', weight: 112, range: {min: 24.0, max: 41.2}, strength: {active: 10, passive: null}, stem: Pro.FLEX}))

// black diamond - camalot z4
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.GREEN,  size: '0',   weight: 43, range: {min:  7.5, max: 11.8}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.RED,    size: '.1',  weight: 45, range: {min:  8.8, max: 13.8}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.YELLOW, size: '.2',  weight: 48, range: {min: 10.4, max: 16.3}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.BLUE,   size: '.3',  weight: 54, range: {min: 12.4, max: 22.6}, strength: {active:  8, passive:    8}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.SILVER, size: '.4',  weight: 61, range: {min: 15.3, max: 27.7}, strength: {active:  9, passive:    9}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.PURPLE, size: '.5',  weight: 77, range: {min: 18.8, max: 33.9}, strength: {active: 10, passive:   10}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'Black Diamond', brandShort: 'BD', model: 'Camalot Z4', modelShort: 'Z4', color: Pro.GREEN,  size: '.75', weight: 93, range: {min: 23.1, max: 42.1}, strength: {active: 10, passive:   10}, stem: Pro.FLEX}))

// dmm - dragonfly
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragonfly', modelShort: 'FLY', color: Pro.GREEN,  size: '1',   weight: 55, range: {min:  7.8, max: 11.0}, strength: {active: 6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragonfly', modelShort: 'FLY', color: Pro.RED,    size: '2',   weight: 56, range: {min:  8.7, max: 12.9}, strength: {active: 6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragonfly', modelShort: 'FLY', color: Pro.YELLOW, size: '3',   weight: 65, range: {min: 10.2, max: 15.1}, strength: {active: 8, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragonfly', modelShort: 'FLY', color: Pro.BLUE,   size: '4',   weight: 67, range: {min: 12.1, max: 17.9}, strength: {active: 8, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragonfly', modelShort: 'FLY', color: Pro.SILVER, size: '5',   weight: 70, range: {min: 15.1, max: 22.5}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragonfly', modelShort: 'FLY', color: Pro.PURPLE, size: '6',   weight: 73, range: {min: 19.0, max: 28.3}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))

// dmm - dragon
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.BLUE,   size: '00',   weight: 75,  range: {min:  14, max:  21}, strength: {active: 10, passive:  9}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.SILVER, size:  '0',   weight: 85,  range: {min:  16, max:  25}, strength: {active: 14, passive: 12}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.PURPLE, size:  '1',   weight: 103, range: {min:  20, max:  33}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.GREEN,  size:  '2',   weight: 117, range: {min:  24, max:  41}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.RED,    size:  '3',   weight: 128, range: {min:  29, max:  50}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.YELLOW, size:  '4',   weight: 154, range: {min:  38, max:  64}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.BLUE,   size:  '5',   weight: 208, range: {min:  50, max:  85}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.SILVER, size:  '6',   weight: 299, range: {min:  68, max: 114}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.PURPLE, size:  '7',   weight: 362, range: {min:  88, max: 149}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.CAM, brand: 'DMM Wales', brandShort: 'DMM', model: 'Dragon', modelShort: 'DRGN', color: Pro.GREEN,  size:  '8',   weight: 515, range: {min: 116, max: 195}, strength: {active: 14, passive: 14}, stem: Pro.RIGID}))

// fixe - alien x
prolib.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'Alien X', modelShort: 'X', color: Pro.BLACK,  size: '1/3', weight: 55, range: {min:  9.3, max: 14.0}, strength: {active:  5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'Alien X', modelShort: 'X', color: Pro.BLUE,   size: '3/8', weight: 56, range: {min: 10.8, max: 16.1}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'Alien X', modelShort: 'X', color: Pro.GREEN,  size: '1/2', weight: 60, range: {min: 13.8, max: 20.8}, strength: {active:  7, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'Alien X', modelShort: 'X', color: Pro.YELLOW, size: '3/4', weight: 64, range: {min: 16.1, max: 25.7}, strength: {active: 10, passive:    5}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'Alien X', modelShort: 'X', color: Pro.SILVER, size: '7/8', weight: 66, range: {min: 18.6, max: 28.0}, strength: {active: 10, passive:    5}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'FIXE', model: 'Alien X', modelShort: 'X', color: Pro.RED,    size: '1',   weight: 70, range: {min: 20.3, max: 33.4}, strength: {active: 10, passive:    5}, stem: Pro.FLEX}))

// metolius - master cam
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.SILVER, size: '00', weight:  45, range: {min:  8.5, max: 12.0}, strength: {active:   5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.PURPLE, size:  '0', weight:  45, range: {min: 10.0, max: 15.0}, strength: {active:   5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.BLUE,   size:  '1', weight:  52, range: {min: 12.5, max: 18.0}, strength: {active:   8, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.YELLOW, size:  '2', weight:  55, range: {min: 15.5, max: 22.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.ORANGE, size:  '3', weight:  65, range: {min: 18.5, max: 26.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.RED,    size:  '4', weight:  75, range: {min: 23.5, max: 33.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.BLACK,  size:  '5', weight:  85, range: {min: 28.0, max: 39.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.GREEN,  size:  '6', weight:  96, range: {min: 32.5, max: 48.0}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.BLUE,   size:  '7', weight: 112, range: {min: 40.0, max: 57.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Master Cam', modelShort: 'Master', color: Pro.PURPLE, size:  '8', weight: 129, range: {min: 48.5, max: 71.5}, strength: {active:  10, passive: null}, stem: Pro.FLEX}))

// metolius - tcu
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'TCU', modelShort: 'TCU', color: Pro.SILVER, size: '00', weight: 41, range: {min:  8.5, max: 12.0}, strength: {active:   5, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'TCU', modelShort: 'TCU', color: Pro.PURPLE, size:  '0', weight: 43, range: {min: 10.0, max: 15.0}, strength: {active:   5, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'TCU', modelShort: 'TCU', color: Pro.BLUE,   size:  '1', weight: 50, range: {min: 12.5, max: 18.0}, strength: {active:   8, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'TCU', modelShort: 'TCU', color: Pro.YELLOW, size:  '2', weight: 57, range: {min: 15.5, max: 22.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'TCU', modelShort: 'TCU', color: Pro.ORANGE, size:  '3', weight: 59, range: {min: 18.5, max: 26.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'TCU', modelShort: 'TCU', color: Pro.RED,    size:  '4', weight: 68, range: {min: 23.5, max: 33.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))

// metolius - power cam
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.SILVER, size: '00', weight:  45, range: {min:  8.5, max: 12.0}, strength: {active:   5, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.PURPLE, size:  '0', weight:  48, range: {min: 10.0, max: 15.0}, strength: {active:   5, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.BLUE,   size:  '1', weight:  54, range: {min: 12.5, max: 18.0}, strength: {active:   8, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.YELLOW, size:  '2', weight:  64, range: {min: 15.5, max: 22.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.ORANGE, size:  '3', weight:  68, range: {min: 18.5, max: 26.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.RED,    size:  '4', weight:  77, range: {min: 23.5, max: 33.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.BLACK,  size:  '5', weight:  86, range: {min: 28.0, max: 39.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.GREEN,  size:  '6', weight:  98, range: {min: 32.5, max: 48.0}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.BLUE,   size:  '7', weight: 127, range: {min: 40.0, max: 57.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Power Cam', modelShort: 'Power', color: Pro.PURPLE, size:  '8', weight: 150, range: {min: 48.5, max: 71.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))

// metolius - fat cam
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.YELLOW, size:  '2', weight:  72, range: {min: 15.5, max: 22.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.ORANGE, size:  '3', weight:  75, range: {min: 18.5, max: 26.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.RED,    size:  '4', weight:  84, range: {min: 23.5, max: 33.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.BLACK,  size:  '5', weight:  98, range: {min: 28.0, max: 39.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.GREEN,  size:  '6', weight: 111, range: {min: 32.5, max: 48.0}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.BLUE,   size:  '7', weight: 136, range: {min: 40.0, max: 57.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Fat Cam', modelShort: 'Fat', color: Pro.PURPLE, size:  '8', weight: 154, range: {min: 48.5, max: 71.5}, strength: {active:  10, passive: null}, stem: Pro.RIGID}))

// metolius - supercam
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Supercam', color: Pro.SILVER, size: 'S', weight: 184, range: {min: 42.0, max:  63.4}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Supercam', color: Pro.RED,    size: 'M', weight: 255, range: {min: 52.5, max:  91.5}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Metolius', brandShort: 'Met', model: 'Supercam', color: Pro.BLUE,   size: 'L', weight: 312, range: {min: 66.5, max: 118.5}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))

// totem
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.BLACK,  size: '0.50', weight:  69, range: {min: 11.7, max: 18.9}, strength: {active:  6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.BLUE,   size: '0.65', weight:  75, range: {min: 13.8, max: 22.5}, strength: {active:  8, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.YELLOW, size: '0.80', weight:  83, range: {min: 17.0, max: 27.7}, strength: {active:  9, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.PURPLE, size: '1.00', weight:  95, range: {min: 20.9, max: 34.2}, strength: {active: 10, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.GREEN,  size: '1.25', weight: 109, range: {min: 25.7, max: 42.3}, strength: {active: 13, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.RED,    size: '1.50', weight: 132, range: {min: 31.6, max: 52.2}, strength: {active: 13, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Totem', model: '', color: Pro.ORANGE, size: '1.80', weight: 144, range: {min: 39.7, max: 64.2}, strength: {active: 13, passive: null}, stem: Pro.FLEX}))

// trango - flex
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.YELLOW, size:  '1', weight:  58, range: {min: 11, max:  17}, strength: {active:  7, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.BLUE,   size:  '2', weight:  60, range: {min: 15, max:  21}, strength: {active:  7, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.SILVER, size:  '3', weight:  73, range: {min: 19, max:  27}, strength: {active: 10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.PURPLE, size:  '4', weight:  81, range: {min: 24, max:  33}, strength: {active: 10, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.GREEN,  size:  '5', weight: 121, range: {min: 27, max:  43}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.RED,    size:  '6', weight: 128, range: {min: 34, max:  55}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.YELLOW, size:  '7', weight: 148, range: {min: 44, max:  68}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.BLUE,   size:  '8', weight: 182, range: {min: 53, max:  86}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.SILVER, size:  '9', weight: 233, range: {min: 63, max: 107}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Trango', model: 'Flex', color: Pro.PURPLE, size: '10', weight: 332, range: {min: 81, max: 134}, strength: {active: 12, passive: null}, stem: Pro.RIGID}))

// wild country - friend
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.SILVER, size: '.4',  weight:  75, range: {min: 15.8, max:  26.4}, strength: {active:  9, passive:  9}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.PURPLE, size: '.5',  weight:  88, range: {min: 20.6, max:  34.5}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.GREEN,  size: '.75', weight: 102, range: {min: 25.8, max:  43.0}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.RED,    size: '1',   weight: 123, range: {min: 31.7, max:  53.6}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.YELLOW, size: '2',   weight: 142, range: {min: 41.5, max:  69.3}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.BLUE,   size: '3',   weight: 192, range: {min: 52.7, max:  88.0}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend', color: Pro.SILVER, size: '4',   weight: 260, range: {min: 66.8, max: 112.1}, strength: {active: 12, passive: 10}, stem: Pro.RIGID}))

// wild country - friend zero
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend Zero', modelShort: 'Zero', color: Pro.RED,    size: '.1',  weight: 49, range: {min:  8.5, max: 13.2}, strength: {active: 5, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend Zero', modelShort: 'Zero', color: Pro.YELLOW, size: '.2',  weight: 51, range: {min: 10.4, max: 15.7}, strength: {active: 6, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend Zero', modelShort: 'Zero', color: Pro.BLUE,   size: '.3',  weight: 68, range: {min: 13.8, max: 22.3}, strength: {active: 8, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend Zero', modelShort: 'Zero', color: Pro.SILVER, size: '.4',  weight: 70, range: {min: 15.8, max: 25.9}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend Zero', modelShort: 'Zero', color: Pro.PURPLE, size: '.5',  weight: 76, range: {min: 20.2, max: 32.9}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))
prolib.add(new Pro({type: Pro.SLCD, brand: 'Wild Country', brandShort: 'WC', model: 'Friend Zero', modelShort: 'Zero', color: Pro.GREEN,  size: '.75', weight: 81, range: {min: 25.4, max: 40.1}, strength: {active: 9, passive: null}, stem: Pro.FLEX}))

/* Pro Chart
================================================================================================ */
Chart.register(ChartDataLabels)

/* Pro Chart Filters
============================================== */

/* brand & model filters
===================== */
const INCLUDE = 'include'
const EXCLUDE = 'exclude'
const brandModelBtns = document.querySelectorAll('.brand-model-container button')
brandModelBtns.forEach((btn) => {
  btn.onclick = (event) => {
    const btn = event.srcElement
    if (btn.classList.contains(INCLUDE)){
      btn.classList.replace(INCLUDE, EXCLUDE)
      if (btn.classList.contains('brand')) {
        prolib.filter.brand.include.delete(btn.dataset.brand)
        prolib.filter.brand.exclude.add(btn.dataset.brand)
      } else {
        // model
        prolib.filter.model.include.delete(btn.dataset.model)
        prolib.filter.model.exclude.add(btn.dataset.model)
      }
    }
    else if (btn.classList.contains(EXCLUDE)) {
      btn.classList.remove(EXCLUDE)
      if (btn.classList.contains('brand')) {
        prolib.filter.brand.exclude.delete(btn.dataset.brand)
      } else {
        // model
        prolib.filter.model.exclude.delete(btn.dataset.model)
      }
    }
    else {
      btn.classList.add(INCLUDE)
      if (btn.classList.contains('brand')) {
        prolib.filter.brand.include.add(btn.dataset.brand)
      } else {
        // model
        prolib.filter.model.include.add(btn.dataset.model)
      }
    }
    prolib.updateChart()
  }
})

/* range filter
===================== */
const driStep = 5
const driMin = document.querySelector('#min')
const driMax = document.querySelector('#max')
const driMinDisplay = document.querySelector('#dri-min-value')
const driMaxDisplay = document.querySelector('#dri-max-value')
const driMinValue = Math.floor(prolib.absMin / driStep) * driStep
const driMaxValue = Math.ceil(prolib.absMax / driStep) * driStep

// defaults
prolib.filter.range.min = 20
prolib.filter.range.max = 80

// dri display
driMinDisplay.textContent = prolib.filter.range.min
driMaxDisplay.textContent = prolib.filter.range.max

// dri min settings
driMin.min = driMinValue
driMin.max = driMaxValue
driMin.step = driStep
driMin.value = prolib.filter.range.min
driMin.oninput = () => driMinDisplay.textContent = driMin.value
driMin.onchange = () => {
  prolib.filter.range.min = parseInt(driMin.value)
  prolib.updateChart()
}

// dri max settings
driMax.min = driMinValue
driMax.max = driMaxValue
driMax.step = driStep
driMax.value = prolib.filter.range.max
driMax.oninput = () => driMaxDisplay.textContent = driMax.value
driMax.onchange = () => {
  prolib.filter.range.max = parseInt(driMax.value)
  prolib.updateChart()
}

// dri
new DualRangeInput(driMin, driMax)

// chart
prolib.generateChart('all-pro-dynamic')
