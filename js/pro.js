/*************************************************************************************************
 * pro.js v0.2.0                                                                                 *
 * (c) 2025 Grant Freeman                                                                        *
 * License GPL 3.0                                                                               *
 *************************************************************************************************/
/* global Chart, ChartDataLabels, DualRangeInput */

/* Protection Sub-Classes
================================================================================================ */
class ProBrand {
  #name
  #short

  /**
   * @constructor
   * @param {string} name - full name
   * @param {string|null} short - leave blank if no shorthand
   */
  constructor (name, short) {
    this.#name = name
    this.#short = short
  }

  get name () { return this.#name }
  get short () { return this.#short === null ? this.#name : this.#short }

  toString () { return this.brand }
}

class ProModel {
  #name
  #short
  #available

  /**
   * @constructor
   * @param {string} name - full name
   * @param {string|null} short - if no shorthand, set to null
   * @param {boolean} available - is it still in production
   */
  constructor (name, short, available) {
    this.#name = name
    this.#short = short
    this.#available = available
    Object.freeze(this)
  }

  get name () { return this.#name }
  get short () { return this.#short === null ? this.#name : this.#short }
  get available () { return this.#available }

  toString () { return this.#name }
}

/* Protection Class
================================================================================================ */
class Pro {
  static BRAND = {
    BLACK_DIAMOND: new ProBrand('Black Diamond', 'BD'),
    DMM_WALES: new ProBrand('DMM Wales', 'DMM'),
    FIXE: new ProBrand('FIXE', null),
    METOLIUS: new ProBrand('Metolius', null),
    TOTEM: new ProBrand('Totem', null),
    TRANGO: new ProBrand('Trango', null),
    WILD_COUNTRY: new ProBrand('Wild Country', 'WC')
  }

  static COLOR = {
    RED: '#C96868',
    ORANGE: '#FFB26F',
    YELLOW: '#FADFA1',
    GREEN: '#9DBC98',
    BLUE: '#8CC0DE',
    PURPLE: '#A888B5',
    SILVER: '#C7C8CC',
    BLACK: '#41444B'
  }

  static MODEL = {
    // Black Diamond
    CAMALOT_C3: new ProModel('Camalot C3', 'C3', false),
    CAMALOT_C4: new ProModel('Camalot C4', 'C4', true),
    CAMALOT_X4: new ProModel('Camalot X4', 'X4', false),
    CAMALOT_Z4: new ProModel('Camalot Z4', 'Z4', true),
    CAMALOT_ULTRALIGHT: new ProModel('Camalot Ultralight', 'UL', true),
    STOPPER: new ProModel('Stopper', null, true),
    // DMM Wales
    DRAGON: new ProModel('Dragon', 'DRGN', true),
    DRAGONFLY: new ProModel('Dragonfly', 'FLY', true),
    WALLNUT: new ProModel('Wallnut', null, true),
    // FIXE
    ALIEN_X: new ProModel('Alien X', null, true),
    // Metolius
    FAT_CAM: new ProModel('Fat Cam', 'FC', true),
    MASTER_CAM: new ProModel('Master Cam', 'MC', true),
    POWER_CAM: new ProModel('Power Cam', 'PC', true),
    SUPERCAM: new ProModel('Supercam', 'SC', true),
    TCU: new ProModel('TCU', null, true),
    // Trango
    FLEX: new ProModel('Flex', null, true),
    // Wild Country
    FRIEND: new ProModel('Friend', null, true),
    FRIEND_ZERO: new ProModel('Friend Zero', 'Zero', true)
  }

  static RANGE = {
    EXPANSION: 'Expansion',
    OPERATION: 'Operation',
    PASSIVE: 'Passive'
  }

  static STEM = {
    FLEX: 'Flex',
    RIGID: 'Rigid',
    SLING: 'Sling',
    WIRED: 'Wired'
  }

  static TYPE = {
    BALL_NUT: 'Ball Nut',
    BIG_BRO: 'Big Bro',
    CAM: 'Cam',
    HEX: 'Hex',
    NUT: 'Nut',
    TRICAM: 'Tricam'
  }

  static STRENGTH = 'Strength'
  static WEIGHT = 'Weight'

  /**
   * @constructor
   * @param {Pro.TYPE} type
   * @param {Pro.BRAND} brand
   * @param {Pro.Model} model
   * @param {Pro.COLOR} color
   * @param {string} size
   * @param {number} weight
   * @param {Pro.STEM} stem
   * @param {Object} range
   *   @param {number} min
   *   @param {number} max
   * @param {Object} strength
   *   @param {number} active
   *   @param {number} passive
   */
  constructor (type, brand, model, color, size, weight, stem, range, strength) {
    this.type = type
    this.brand = brand
    this.model = model
    this.color = color
    this.size = size
    this.weight = weight
    this.stem = stem

    /****************************
     *     RANGE / STRENGTH     *
     ****************************
     *              |  PASSIVE  |
     *          | A | 1 | 2 | 3 |
     * BALL NUT | X |   |   |   |
     *  BIG BRO | X |   |   |   |
     *      CAM | X | X |   |   |
     *      HEX |   | X | X | X |
     *      NUT |   | X | X |   |
     *   TRICAM | X | X | X |   |
     ****************************/
    this.range = {
      expansion: {
        min: Object.hasOwn(range, 'min') ? range.min : null,
        max: Object.hasOwn(range, 'max') ? range.max : null,
      },
      operation: {
        min: null,
        max: null
      },
      passive: {
        p1: Object.hasOwn(range, 'p1') ? range.p1 : null,
        p2: Object.hasOwn(range, 'p2') ? range.p2 : null,
        p3: Object.hasOwn(range, 'p3') ? range.p3 : null
      }
    }
    this.strength = {
      active: Object.hasOwn(strength, 'active') ? strength.active : null,
      p1: Object.hasOwn(strength, 'p1') ? strength.p1 : null,
      p2: Object.hasOwn(strength, 'p2') ? strength.p2 : null,
      p3: Object.hasOwn(strength, 'p3') ? strength.p3 : null,
    }

    // calculate operation range
    if ([Pro.TYPE.BALL_NUT, Pro.TYPE.BIG_BRO, Pro.TYPE.CAM, Pro.TRICAM].includes(this.type)) {
      const delta = this.range.expansion.max - this.range.expansion.min
      this.range.operation.min = ((delta * 0.10) + this.range.expansion.min).toFixed(1)
      this.range.operation.max = (this.range.expansion.max - (delta * 0.25)).toFixed(1)
      if (this.type === Pro.TYPE.BIG_BRO) this.range.operation.max = this.range.expansion.max
    }

    Object.freeze(this)
  }

  min () {
    let list = []
    for (const arg of arguments) {
      if (arg === Pro.RANGE.EXPANSION) list.push(this.range.expansion.min)
      else if (arg === Pro.RANGE.OPERATION) list.push(this.range.operation.min)
      else if (arg === Pro.RANGE.PASSIVE) {
        list.push(this.range.passive.p1)
        list.push(this.range.passive.p2)
      } else if (arg === Pro.STRENGTH) {
        list.push(this.strength.active)
        list.push(this.strength.p1)
        list.push(this.strength.p2)
        list.push(this.strength.p3)
      }
    }
    list = list.filter((x) => x)
    return Math.min(...list)
  }

  max () {
    let list = []
    for (const arg of arguments) {
      if (arg === Pro.RANGE.EXPANSION) list.push(this.range.expansion.max)
      else if (arg === Pro.RANGE.OPERATION) list.push(this.range.operation.max)
      else if (arg === Pro.RANGE.PASSIVE) {
        list.push(this.range.passive.p1)
        list.push(this.range.passive.p2)
      } else if (arg === Pro.STRENGTH) {
        list.push(this.strength.active)
        list.push(this.strength.p1)
        list.push(this.strength.p2)
        list.push(this.strength.p3)
      }
    }
    list = list.filter((x) => x)
    return Math.max(...list)
  }

  /**
   * generates a label containing brand, model, and size
   * @param {boolean} shorthand - use shorthand for brand and model?
   * @return {string} label
   */
  label (shorthand = false) {
    const label = []
    label.push(shorthand ? this.brand.short : this.brand.name)
    if (this.model !== null) label.push(shorthand ? this.model.short : this.model.name)
    label.push(this.size)
    return label.join(' ')
  }
}

/* Protection Library
================================================================================================ */
/* eslint-disable key-spacing */
/* eslint-disable no-multi-spaces */
const PROLIB = []

// Black Diamond - Camalot C3
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C3, Pro.COLOR.SILVER, '000', 56, Pro.STEM.RIGID, { min:  7.8, max: 12.9 }, { active:  4 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C3, Pro.COLOR.PURPLE, '00',  58, Pro.STEM.RIGID, { min:  8.9, max: 13.7 }, { active:  6 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C3, Pro.COLOR.GREEN,  '0',   59, Pro.STEM.RIGID, { min: 10.2, max: 15.8 }, { active:  7 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C3, Pro.COLOR.RED,    '1',   64, Pro.STEM.RIGID, { min: 12.0, max: 18.8 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C3, Pro.COLOR.YELLOW, '2',   66, Pro.STEM.RIGID, { min: 14.2, max: 22.6 }, { active: 10 }))

// Black Diamond - Camalot C4
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.BLUE,   '.3',   70, Pro.STEM.RIGID, { min:  13.8, max:  23.4 }, { active:  8, p1:  8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.SILVER, '.4',   78, Pro.STEM.RIGID, { min:  15.5, max:  26.7 }, { active:  9, p1:  9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.PURPLE, '.5',   93, Pro.STEM.RIGID, { min:  19.6, max:  33.5 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.GREEN,  '.75', 108, Pro.STEM.RIGID, { min:  23.9, max:  41.2 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.RED,    '1',   124, Pro.STEM.RIGID, { min:  30.2, max:  52.1 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.YELLOW, '2',   140, Pro.STEM.RIGID, { min:  37.2, max:  64.9 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.BLUE,   '3',   180, Pro.STEM.RIGID, { min:  50.7, max:  87.9 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.SILVER, '4',   257, Pro.STEM.RIGID, { min:  66.0, max: 114.7 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.PURPLE, '5',   348, Pro.STEM.RIGID, { min:  85.4, max: 148.5 }, { active: 14, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.GREEN,  '6',   530, Pro.STEM.RIGID, { min: 114.1, max: 195.0 }, { active: 14, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.RED,    '7',   710, Pro.STEM.RIGID, { min: 150.0, max: 253.3 }, { active:  8, p1:  8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_C4, Pro.COLOR.YELLOW, '8',   974, Pro.STEM.RIGID, { min: 193.0, max: 321.2 }, { active:  5, p1:  5 }))

// Black Diamond - Camalot UL
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.SILVER, '.4',   61, Pro.STEM.RIGID, { min:  15.5, max:  26.7 }, { active:  8, p1:  8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.PURPLE, '.5',   74, Pro.STEM.RIGID, { min:  19.6, max:  33.5 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.GREEN,  '.75',  89, Pro.STEM.RIGID, { min:  23.9, max:  41.2 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.RED,    '1',   101, Pro.STEM.RIGID, { min:  30.2, max:  52.1 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.YELLOW, '2',   126, Pro.STEM.RIGID, { min:  37.2, max:  64.9 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.BLUE,   '3',   167, Pro.STEM.RIGID, { min:  50.7, max:  87.9 }, { active: 12, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_ULTRALIGHT, Pro.COLOR.SILVER, '4',   225, Pro.STEM.RIGID, { min:  66.0, max: 114.7 }, { active: 12, p1: 12 }))

// Black Diamond - Camalot X4
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_X4, Pro.COLOR.RED,    '.1',   51, Pro.STEM.FLEX, { min:  8.4, max: 13.8 }, { active:  5, }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_X4, Pro.COLOR.YELLOW, '.2',   54, Pro.STEM.FLEX, { min:  9.9, max: 16.5 }, { active:  6, }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_X4, Pro.COLOR.BLUE,   '.3',   75, Pro.STEM.FLEX, { min: 12.4, max: 21.2 }, { active:  8, }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_X4, Pro.COLOR.SILVER, '.4',   82, Pro.STEM.FLEX, { min: 15.5, max: 26.6 }, { active: 10, }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_X4, Pro.COLOR.PURPLE, '.5',   91, Pro.STEM.FLEX, { min: 19.8, max: 33.7 }, { active: 10, }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_X4, Pro.COLOR.GREEN,  '.75', 112, Pro.STEM.FLEX, { min: 24.0, max: 41.2 }, { active: 10, }))

// Black Diamond - Camalot Z4
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.GREEN,  '0',   43, Pro.STEM.FLEX, { min:  7.5, max: 11.8 }, { active:  5, p1: null }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.RED,    '.1',  45, Pro.STEM.FLEX, { min:  8.8, max: 13.8 }, { active:  5, p1: null }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.YELLOW, '.2',  48, Pro.STEM.FLEX, { min: 10.4, max: 16.3 }, { active:  6, p1: null }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.BLUE,   '.3',  54, Pro.STEM.FLEX, { min: 12.4, max: 22.6 }, { active:  8, p1:    8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.SILVER, '.4',  61, Pro.STEM.FLEX, { min: 15.3, max: 27.7 }, { active:  9, p1:    9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.PURPLE, '.5',  77, Pro.STEM.FLEX, { min: 18.8, max: 33.9 }, { active: 10, p1:   10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.CAMALOT_Z4, Pro.COLOR.GREEN,  '.75', 93, Pro.STEM.FLEX, { min: 23.1, max: 42.1 }, { active: 10, p1:   10 }))

// // Black Diamond - Stoppers
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.RED,     '1',  7, Pro.STEM.WIRED, { p1:  4.3, p2:  9.1 }, { p1:  2, p2:  2 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.YELLOW,  '2',  8, Pro.STEM.WIRED, { p1:  4.8, p2:  9.9 }, { p1:  2, p2:  2 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.BLUE,    '3', 15, Pro.STEM.WIRED, { p1:  6.1, p2: 11.4 }, { p1:  5, p2:  5 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.SILVER,  '4', 16, Pro.STEM.WIRED, { p1:  6.9, p2: 12.4 }, { p1:  6, p2:  2 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.PURPLE,  '5', 18, Pro.STEM.WIRED, { p1:  8.4, p2: 13.5 }, { p1:  6, p2:  3 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.GREEN,   '6', 32, Pro.STEM.WIRED, { p1: 10.2, p2: 15.5 }, { p1: 10, p2:  3 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.RED,     '7', 34, Pro.STEM.WIRED, { p1: 11.7, p2: 16.3 }, { p1: 10, p2:  6 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.YELLOW,  '8', 37, Pro.STEM.WIRED, { p1: 13.5, p2: 18.3 }, { p1: 10, p2:  8 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.BLUE,    '9', 39, Pro.STEM.WIRED, { p1: 15.2, p2: 20.8 }, { p1: 10, p2:  8 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.SILVER, '10', 43, Pro.STEM.WIRED, { p1: 17.3, p2: 23.4 }, { p1: 10, p2: 10 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.PURPLE, '11', 51, Pro.STEM.WIRED, { p1: 20.1, p2: 26.7 }, { p1: 10, p2: 10 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.GREEN,  '12', 58, Pro.STEM.WIRED, { p1: 22.9, p2: 30.5 }, { p1: 10, p2: 10 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.BLACK_DIAMOND, Pro.MODEL.STOPPER, Pro.COLOR.RED,    '13', 71, Pro.STEM.WIRED, { p1: 26.4, p2: 35.1 }, { p1: 10, p2: 10 }))

// DMM Wales - Dragon
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.BLUE,   '00',  75, Pro.STEM.RIGID, { min:  14, max:  21 }, { active: 10, p1:  9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.SILVER, '0',   85, Pro.STEM.RIGID, { min:  16, max:  25 }, { active: 14, p1: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.PURPLE, '1',  103, Pro.STEM.RIGID, { min:  20, max:  33 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.GREEN,  '2',  117, Pro.STEM.RIGID, { min:  24, max:  41 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.RED,    '3',  128, Pro.STEM.RIGID, { min:  29, max:  50 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.YELLOW, '4',  154, Pro.STEM.RIGID, { min:  38, max:  64 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.BLUE,   '5',  208, Pro.STEM.RIGID, { min:  50, max:  85 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.SILVER, '6',  299, Pro.STEM.RIGID, { min:  68, max: 114 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.PURPLE, '7',  362, Pro.STEM.RIGID, { min:  88, max: 149 }, { active: 14, p1: 14 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGON, Pro.COLOR.GREEN,  '8',  515, Pro.STEM.RIGID, { min: 116, max: 195 }, { active: 14, p1: 14 }))

// DMM Wales - Dragonfly
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGONFLY, Pro.COLOR.GREEN,  '1', 55, Pro.STEM.FLEX, { min:  7.8, max: 11.0 }, { active: 6 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGONFLY, Pro.COLOR.RED,    '2', 56, Pro.STEM.FLEX, { min:  8.7, max: 12.9 }, { active: 6 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGONFLY, Pro.COLOR.YELLOW, '3', 65, Pro.STEM.FLEX, { min: 10.2, max: 15.1 }, { active: 8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGONFLY, Pro.COLOR.BLUE,   '4', 67, Pro.STEM.FLEX, { min: 12.1, max: 17.9 }, { active: 8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGONFLY, Pro.COLOR.SILVER, '5', 70, Pro.STEM.FLEX, { min: 15.1, max: 22.5 }, { active: 9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.DMM_WALES, Pro.MODEL.DRAGONFLY, Pro.COLOR.PURPLE, '6', 73, Pro.STEM.FLEX, { min: 19.0, max: 28.3 }, { active: 9 }))

// // DMM Wales - Wallnuts
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.PURPLE,  '1', 15, Pro.STEM.WIRED, { p1:  6.7, p2: 14.3 }, { p1:  7, p2:  7 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.GREEN,   '2', 26, Pro.STEM.WIRED, { p1:  8.1, p2: 15.8 }, { p1:  9, p2:  9 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.SILVER,  '3', 28, Pro.STEM.WIRED, { p1:  9.4, p2: 16.5 }, { p1: 11, p2: 11 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.YELLOW,  '4', 30, Pro.STEM.WIRED, { p1: 11.0, p2: 17.6 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.BLUE,    '5', 32, Pro.STEM.WIRED, { p1: 13.2, p2: 19.4 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.RED,     '6', 39, Pro.STEM.WIRED, { p1: 15.6, p2: 22.6 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.SILVER,  '7', 40, Pro.STEM.WIRED, { p1: 18.9, p2: 25.8 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.BLUE,    '8', 45, Pro.STEM.WIRED, { p1: 22.3, p2: 29.0 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.YELLOW,  '9', 50, Pro.STEM.WIRED, { p1: 25.2, p2: 32.1 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.SILVER, '10', 56, Pro.STEM.WIRED, { p1: 28.8, p2: 32.6 }, { p1: 12, p2: 12 }))
// PROLIB.push(new Pro(Pro.TYPE.NUT, Pro.BRAND.DMM_WALES, Pro.MODEL.WALLNUT, Pro.COLOR.GREEN,  '11', 68, Pro.STEM.WIRED, { p1: 33.1, p2: 37.4 }, { p1: 12, p2: 12 }))

// FIXE - Alien X
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.FIXE, Pro.MODEL.ALIEN_X, Pro.COLOR.BLACK,  '1/3', 55, Pro.STEM.FLEX, { min:  9.3, max: 14.0 }, { active:  5, p1: null }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.FIXE, Pro.MODEL.ALIEN_X, Pro.COLOR.BLUE,   '3/8', 56, Pro.STEM.FLEX, { min: 10.8, max: 16.1 }, { active:  6, p1: null }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.FIXE, Pro.MODEL.ALIEN_X, Pro.COLOR.GREEN,  '1/2', 60, Pro.STEM.FLEX, { min: 13.8, max: 20.8 }, { active:  7, p1: null }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.FIXE, Pro.MODEL.ALIEN_X, Pro.COLOR.YELLOW, '3/4', 64, Pro.STEM.FLEX, { min: 16.1, max: 25.7 }, { active: 10, p1:    5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.FIXE, Pro.MODEL.ALIEN_X, Pro.COLOR.SILVER, '7/8', 66, Pro.STEM.FLEX, { min: 18.6, max: 28.0 }, { active: 10, p1:    5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.FIXE, Pro.MODEL.ALIEN_X, Pro.COLOR.RED,    '1',   70, Pro.STEM.FLEX, { min: 20.3, max: 33.4 }, { active: 10, p1:    5 }))

// Metolius - Master Cam
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.SILVER, '00',  45, Pro.STEM.FLEX, { min:  8.5, max: 12.0 }, { active:  5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.PURPLE, '0',   45, Pro.STEM.FLEX, { min: 10.0, max: 15.0 }, { active:  5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.BLUE,   '1',   52, Pro.STEM.FLEX, { min: 12.5, max: 18.0 }, { active:  8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.YELLOW, '2',   55, Pro.STEM.FLEX, { min: 15.5, max: 22.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.ORANGE, '3',   65, Pro.STEM.FLEX, { min: 18.5, max: 26.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.RED,    '4',   75, Pro.STEM.FLEX, { min: 23.5, max: 33.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.BLACK,  '5',   85, Pro.STEM.FLEX, { min: 28.0, max: 39.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.GREEN,  '6',   96, Pro.STEM.FLEX, { min: 32.5, max: 48.0 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.BLUE,   '7',  112, Pro.STEM.FLEX, { min: 40.0, max: 57.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.MASTER_CAM, Pro.COLOR.PURPLE, '8',  129, Pro.STEM.FLEX, { min: 48.5, max: 71.5 }, { active: 10 }))

// Metolius - TCU
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.TCU, Pro.COLOR.SILVER, '00', 41, Pro.STEM.RIGID, { min:  8.5, max: 12.0 }, { active:  5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.TCU, Pro.COLOR.PURPLE,  '0', 43, Pro.STEM.RIGID, { min: 10.0, max: 15.0 }, { active:  5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.TCU, Pro.COLOR.BLUE,    '1', 50, Pro.STEM.RIGID, { min: 12.5, max: 18.0 }, { active:  8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.TCU, Pro.COLOR.YELLOW,  '2', 57, Pro.STEM.RIGID, { min: 15.5, max: 22.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.TCU, Pro.COLOR.ORANGE,  '3', 59, Pro.STEM.RIGID, { min: 18.5, max: 26.5 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.TCU, Pro.COLOR.RED,     '4', 68, Pro.STEM.RIGID, { min: 23.5, max: 33.5 }, { active: 10 }))

// Metolius - power cam
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.SILVER, '00',  45, Pro.STEM.RIGID, { min:  8.5, max: 12.0 }, { active:   5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.PURPLE, '0',   48, Pro.STEM.RIGID, { min: 10.0, max: 15.0 }, { active:   5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.BLUE,   '1',   54, Pro.STEM.RIGID, { min: 12.5, max: 18.0 }, { active:   8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.YELLOW, '2',   64, Pro.STEM.RIGID, { min: 15.5, max: 22.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.ORANGE, '3',   68, Pro.STEM.RIGID, { min: 18.5, max: 26.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.RED,    '4',   77, Pro.STEM.RIGID, { min: 23.5, max: 33.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.BLACK,  '5',   86, Pro.STEM.RIGID, { min: 28.0, max: 39.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.GREEN,  '6',   98, Pro.STEM.RIGID, { min: 32.5, max: 48.0 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.BLUE,   '7',  127, Pro.STEM.RIGID, { min: 40.0, max: 57.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.POWER_CAM, Pro.COLOR.PURPLE, '8',  150, Pro.STEM.RIGID, { min: 48.5, max: 71.5 }, { active:  10 }))

// metolius - fat cam
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.YELLOW, '2',  72, Pro.STEM.RIGID, { min: 15.5, max: 22.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.ORANGE, '3',  75, Pro.STEM.RIGID, { min: 18.5, max: 26.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.RED,    '4',  84, Pro.STEM.RIGID, { min: 23.5, max: 33.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.BLACK,  '5',  98, Pro.STEM.RIGID, { min: 28.0, max: 39.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.GREEN,  '6', 111, Pro.STEM.RIGID, { min: 32.5, max: 48.0 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.BLUE,   '7', 136, Pro.STEM.RIGID, { min: 40.0, max: 57.5 }, { active:  10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.FAT_CAM, Pro.COLOR.PURPLE, '8', 154, Pro.STEM.RIGID, { min: 48.5, max: 71.5 }, { active:  10 }))

// metolius - supercam
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.SUPERCAM, Pro.COLOR.SILVER, 'S', 184, Pro.STEM.RIGID, { min: 42.0, max:  63.4 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.SUPERCAM, Pro.COLOR.RED,    'M', 255, Pro.STEM.RIGID, { min: 52.5, max:  91.5 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.METOLIUS, Pro.MODEL.SUPERCAM, Pro.COLOR.BLUE,   'L', 312, Pro.STEM.RIGID, { min: 66.5, max: 118.5 }, { active: 12 }))

// totem
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.BLACK,  '0.50',  69, Pro.STEM.FLEX, { min: 11.7, max: 18.9 }, { active:  6 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.BLUE,   '0.65',  75, Pro.STEM.FLEX, { min: 13.8, max: 22.5 }, { active:  8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.YELLOW, '0.80',  83, Pro.STEM.FLEX, { min: 17.0, max: 27.7 }, { active:  9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.PURPLE, '1.00',  95, Pro.STEM.FLEX, { min: 20.9, max: 34.2 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.GREEN,  '1.25', 109, Pro.STEM.FLEX, { min: 25.7, max: 42.3 }, { active: 13 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.RED,    '1.50', 132, Pro.STEM.FLEX, { min: 31.6, max: 52.2 }, { active: 13 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TOTEM, null, Pro.COLOR.ORANGE, '1.80', 144, Pro.STEM.FLEX, { min: 39.7, max: 64.2 }, { active: 13 }))

// trango - flex
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.YELLOW,  '1',  58, Pro.STEM.RIGID, { min: 11, max:  17 }, { active:  7 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.BLUE,    '2',  60, Pro.STEM.RIGID, { min: 15, max:  21 }, { active:  7 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.SILVER,  '3',  73, Pro.STEM.RIGID, { min: 19, max:  27 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.PURPLE,  '4',  81, Pro.STEM.RIGID, { min: 24, max:  33 }, { active: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.GREEN,   '5', 121, Pro.STEM.RIGID, { min: 27, max:  43 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.RED,     '6', 128, Pro.STEM.RIGID, { min: 34, max:  55 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.YELLOW,  '7', 148, Pro.STEM.RIGID, { min: 44, max:  68 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.BLUE,    '8', 182, Pro.STEM.RIGID, { min: 53, max:  86 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.SILVER,  '9', 233, Pro.STEM.RIGID, { min: 63, max: 107 }, { active: 12 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.TRANGO, Pro.MODEL.FLEX, Pro.COLOR.PURPLE, '10', 332, Pro.STEM.RIGID, { min: 81, max: 134 }, { active: 12 }))

// wild country - friend
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.SILVER, '.4',   75, Pro.STEM.RIGID, { min: 15.8, max:  26.4 }, { active:  9, p1:  9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.PURPLE, '.5',   88, Pro.STEM.RIGID, { min: 20.6, max:  34.5 }, { active: 12, p1: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.GREEN,  '.75', 102, Pro.STEM.RIGID, { min: 25.8, max:  43.0 }, { active: 12, p1: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.RED,    '1',   123, Pro.STEM.RIGID, { min: 31.7, max:  53.6 }, { active: 12, p1: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.YELLOW, '2',   142, Pro.STEM.RIGID, { min: 41.5, max:  69.3 }, { active: 12, p1: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.BLUE,   '3',   192, Pro.STEM.RIGID, { min: 52.7, max:  88.0 }, { active: 12, p1: 10 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND, Pro.COLOR.SILVER, '4',   260, Pro.STEM.RIGID, { min: 66.8, max: 112.1 }, { active: 12, p1: 10 }))

// wild country - friend zero
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND_ZERO, Pro.COLOR.RED,    '.1',  49, Pro.STEM.FLEX, { min:  8.5, max: 13.2 }, { active: 5 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND_ZERO, Pro.COLOR.YELLOW, '.2',  51, Pro.STEM.FLEX, { min: 10.4, max: 15.7 }, { active: 6 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND_ZERO, Pro.COLOR.BLUE,   '.3',  68, Pro.STEM.FLEX, { min: 13.8, max: 22.3 }, { active: 8 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND_ZERO, Pro.COLOR.SILVER, '.4',  70, Pro.STEM.FLEX, { min: 15.8, max: 25.9 }, { active: 9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND_ZERO, Pro.COLOR.PURPLE, '.5',  76, Pro.STEM.FLEX, { min: 20.2, max: 32.9 }, { active: 9 }))
PROLIB.push(new Pro(Pro.TYPE.CAM, Pro.BRAND.WILD_COUNTRY, Pro.MODEL.FRIEND_ZERO, Pro.COLOR.GREEN,  '.75', 81, Pro.STEM.FLEX, { min: 25.4, max: 40.1 }, { active: 9 }))
/* eslint-enable key-spacing */
/* eslint-enable no-multi-spaces */

/* Protection Class
================================================================================================ */
class ProChart { // eslint-disable-line no-unused-vars
  #container
  #chartContainer
  #chartCanvasId
  #filtersEnabled
  #proLibrary
  #proList

  static COLOR = {
    MAGENTA: '#FF00FF',
    TEXT:
    {
      DARK: Pro.COLOR.BLACK,
      LIGHT: 'hsl(42deg 24% 92%)'
    },
    RANGE: Pro.COLOR.BLUE,
    WEIGHT: '#C1BAA1',
    // AID: '#B03052'
    AID: '#B80000'
  }

  /**
   * @constructor
   * @param {string} containerId - the container id to inject the ProChart
   * @param {boolean} filtersEnabled - do you want (brand/model/range) filters?
   */
  constructor (containerId, filtersEnabled) {
    this.#container = document.getElementById(containerId)
    this.#filtersEnabled = filtersEnabled

    // protection library and active #proList
    this.#proLibrary = Array.from(PROLIB)

    // chart & filters
    this.chart = null
    this.BMMap = new Map()
    this.filter =
    {
      brand:
      {
        include: new Set(),
        exclude: new Set()
      },
      model:
      {
        include: new Set(),
        exclude: new Set()
      },
      range:
      {
        dri: null,
        min: 20,
        max: 70,
        input:
        {
          min: null,
          max: null
        },
        output:
        {
          min: null,
          max: null
        }
      },
      strength:
      {
        min: 5,
        output: null,
        input: null
      }
    }
  }

  deploy () {
    if (this.#filtersEnabled) this.#deployFilters()
    this.#deployChart()
  }

  prune (filter) {
    if (this.chart === null) {
      this.#proLibrary = this.#proLibrary.filter(filter)
    }
  }

  #chartScale (scale, percent) {
    let min = null
    let max = null
    if (this.#proList.length === 0) return { min: 0, max: 10 }
    if (scale === Pro.RANGE) {
      min = this.#proList[0].min(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE)
      max = this.#proList[0].max(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE)
      this.#proList.forEach((pro) => {
        const min2 = pro.min(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE)
        const max2 = pro.max(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE)
        if (min2 < min) min = min2
        if (max2 > max) max = max2
      })
    }
    if (scale === Pro.WEIGHT) {
      min = this.#proList[0].weight
      max = this.#proList[0].weight
      this.#proList.forEach((pro) => {
        min = min <= pro.weight ? min : pro.weight
        max = max >= pro.weight ? max : pro.weight
      })
    }

    const pad = (max - min) * percent
    return { min: Math.floor(min - pad), max: Math.ceil(max + pad) }
  }

  #deployChart () {
    // plugins
    Chart.register(ChartDataLabels)

    // generate dom elements
    this.#chartContainer = document.createElement('div')
    this.#container.append(this.#chartContainer)

    const canvas = document.createElement('canvas')
    this.#chartCanvasId = Math.random().toString(16).substring(2,8)
    canvas.id = this.#chartCanvasId
    this.#chartContainer.append(canvas)

    // initialize chart
    this.chart = new Chart(canvas, { type: 'bar' })
    this.#refreshChart()
  }

  #deployFilters () {
    /** brand/model filter
     *
     *  <section class="brand-model-container">
     *    <header>Brand / Model</header>
     *    <div class="row">
     *      <div class="two columns">
     *        <button>{brand}</button>
     *      </div>
     *      <div class="ten columns">
     *        <button>{model}</button>
     *        ...
     *      </div>
     *    </div>
     *    <div class="row">
     *      ...
     *    </div>
     *  </section>
     */
    // create map between brand and models
    this.#proLibrary.forEach((pro) => {
      if (this.BMMap.has(pro.brand.name) === false) this.BMMap.set(pro.brand.name, new Set())
      if (pro.model) this.BMMap.get(pro.brand.name).add(pro.model.name)
    })

    const bmBtnOnclick = (event) => {
      const INCLUDE = 'include'
      const EXCLUDE = 'exclude'
      const btn = event.srcElement
      const type = btn.classList.contains('brand') ? 'brand' : 'model'
      const name = btn.innerText
      console.log(this.filter)

      if (btn.classList.contains(INCLUDE)) {
        btn.classList.replace(INCLUDE, EXCLUDE)
        this.filter[type].include.delete(name)
        this.filter[type].exclude.add(name)
      } else if (btn.classList.contains(EXCLUDE)) {
        btn.classList.remove(EXCLUDE)
        this.filter[type].exclude.delete(name)
      } else {
        btn.classList.add(INCLUDE)
        this.filter[type].include.add(name)
      }
      console.log(this.filter)
      this.#refreshChart()
    }

    const bmContainer = document.createElement('section')
    bmContainer.classList.add('brand-model-container')
    this.#container.append(bmContainer)

    const bmHeader = document.createElement('header')
    bmHeader.classList.add('filter', 'center')
    bmHeader.textContent = 'Brand / Model'
    bmContainer.append(bmHeader)

    this.BMMap.forEach((models, brand, map) => {
      const row = document.createElement('div')
      row.classList.add('row')
      bmContainer.append(row)

      const colBrand = document.createElement('div')
      colBrand.classList.add('two', 'columns')
      row.append(colBrand)

      const btnBrand = document.createElement('button')
      btnBrand.classList.add('brand')
      btnBrand.textContent = brand
      btnBrand.onclick = bmBtnOnclick
      colBrand.append(btnBrand)

      const colModels = document.createElement('div')
      colModels.classList.add('ten', 'columns')
      row.append(colModels)

      models.forEach((model) => {
        const btnModel = document.createElement('button')
        btnModel.classList.add('model')
        btnModel.textContent = model
        btnModel.onclick = bmBtnOnclick
        colModels.append(btnModel)
      })
    })
    /** strength filter
     *
     *  <section class="center">
     *    <header>Strength Minimum (kn)</header>
     *    <div>
     *      <span></span>
     *    </div>
     *    <div class="dual-range-input">
     *      <input type="range" min="{}" max="{}" step="1" value="{min}" />
     *    </div>
     *  </section>
     */
    const strMin = Math.min(...this.#proLibrary.map((pro) => pro.min(Pro.STRENGTH)))
    const strMax = Math.max(...this.#proLibrary.map((pro) => pro.max(Pro.STRENGTH)))

    const strSection = document.createElement('section')
    strSection.classList.add('center')
    this.#container.append(strSection)

    const strHeader = document.createElement('header')
    strHeader.classList.add('filter')
    strHeader.textContent = 'Strength (kn)'
    strSection.append(strHeader)

    const strOutputContainer = document.createElement('div')
    strSection.append(strOutputContainer)

    this.filter.strength.output = document.createElement('span')
    this.filter.strength.output.textContent = this.filter.strength.min
    strOutputContainer.append(this.filter.strength.output)

    const strInputContainer = document.createElement('div')
    strSection.append(strInputContainer)

    this.filter.strength.input = document.createElement('input')
    this.filter.strength.input.classList.add('strength')
    this.filter.strength.input.type = 'range'
    this.filter.strength.input.min = strMin
    this.filter.strength.input.max = strMax
    this.filter.strength.input.step = 1
    this.filter.strength.input.value = this.filter.strength.min
    this.filter.strength.input.oninput = () => {
      this.filter.strength.output.textContent = this.filter.strength.input.value
    }
    this.filter.strength.input.onchange = () => {
      this.filter.strength.min = parseInt(this.filter.strength.input.value)
      this.#refreshChart()
    }
    strInputContainer.append(this.filter.strength.input)

    /** range filter
     *
     *  <section class="center">
     *    <header>Range (mm)</header>
     *    <div>
     *      <span></span>
     *      <span>-</span>
     *      <span></span>
     *    </div>
     *    <div class="dual-range-input">
     *      <input type="range" min="{}" max="{}" step="5" value="{}" />
     *      <input type="range" min="{}" max="{}" step="5" value="{}" />
     *    </div>
     *  </section>
     */
    const driStep = 5
    const minimums = this.#proLibrary.map((pro) => pro.min(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE))
    const maximums = this.#proLibrary.map((pro) => pro.max(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE))
    const driMin = Math.floor(Math.min(...minimums) / driStep) * driStep
    const driMax = Math.ceil(Math.max(...maximums) / driStep) * driStep

    const driSection = document.createElement('section')
    driSection.classList.add('center')
    this.#container.append(driSection)

    const driHeader = document.createElement('header')
    driHeader.classList.add('filter')
    driHeader.textContent = 'Range (mm)'
    driSection.append(driHeader)

    const driOutputContainer = document.createElement('div')
    driSection.append(driOutputContainer)

    this.filter.range.output.min = document.createElement('span')
    this.filter.range.output.min.textContent = this.filter.range.min
    driOutputContainer.append(this.filter.range.output.min)

    const driSpanDash = document.createElement('span')
    driSpanDash.textContent = ' - '
    driOutputContainer.append(driSpanDash)

    this.filter.range.output.max = document.createElement('span')
    this.filter.range.output.max.textContent = this.filter.range.max
    driOutputContainer.append(this.filter.range.output.max)

    const driInputContainer = document.createElement('div')
    driInputContainer.classList.add('dual-range-input')
    driSection.append(driInputContainer)

    this.filter.range.input.min = document.createElement('input')
    this.filter.range.input.min.type = 'range'
    this.filter.range.input.min.min = driMin
    this.filter.range.input.min.max = driMax
    this.filter.range.input.min.step = driStep
    this.filter.range.input.min.value = this.filter.range.min
    this.filter.range.input.min.oninput = () => {
      this.filter.range.output.min.textContent = this.filter.range.input.min.value
    }
    this.filter.range.input.min.onchange = () => {
      this.filter.range.min = parseInt(this.filter.range.input.min.value)
      this.#refreshChart()
    }
    driInputContainer.append(this.filter.range.input.min)

    this.filter.range.input.max = document.createElement('input')
    this.filter.range.input.max.type = 'range'
    this.filter.range.input.max.min = driMin
    this.filter.range.input.max.max = driMax
    this.filter.range.input.max.step = driStep
    this.filter.range.input.max.value = this.filter.range.max
    this.filter.range.input.max.oninput = () => {
      this.filter.range.output.max.textContent = this.filter.range.input.max.value
    }
    this.filter.range.input.max.onchange = () => {
      this.filter.range.max = parseInt(this.filter.range.input.max.value)
      this.#refreshChart()
    }
    driInputContainer.append(this.filter.range.input.max)

    this.filter.range.dri = new DualRangeInput(this.filter.range.input.min, this.filter.range.input.max)
  }

  #refreshChart() {
    this.#proList = Array.from(this.#proLibrary)

    // sort by range: min to max
    this.#proList.sort((pro1, pro2) => {
      const minDelta = pro1.min(Pro.RANGE.OPERATION, Pro.RANGE.PASSIVE) - pro2.min(Pro.RANGE.OPERATION, Pro.RANGE.PASSIVE)
      const maxDelta = pro1.max(Pro.RANGE.OPERATION, Pro.RANGE.PASSIVE) - pro2.max(Pro.RANGE.OPERATION, Pro.RANGE.PASSIVE)
      const weightDelta = pro1.weight - pro2.weight
      if (minDelta !== 0) return minDelta
      else if (maxDelta !== 0) return maxDelta
      else return weightDelta
    })

    // filter - brands / models
    this.#proList = this.#proList.filter((pro) => {
      const bFilter = this.filter.brand
      const mFilter = this.filter.model
      const brand = pro.brand.name
      const model = pro.model ? pro.model.name : null
      // exclude
      if (bFilter.exclude.has(brand) || mFilter.exclude.has(model)) return false
      // include
      if (bFilter.include.size !== 0 || mFilter.include.size !== 0) {
        if (bFilter.include.has(brand) === false && mFilter.include.has(model) === false) return false
        if (bFilter.include.has(brand) && mFilter.include.has(model) === false && mFilter.include.size !== 0) return false
      }
      return true
    })

    // filter - strength
    this.#proList = this.#proList.filter((pro) => {
      if (pro.min(Pro.STRENGTH) < this.filter.strength.min) return false
      return true
    })

    // filter - range
    this.#proList = this.#proList.filter((pro) => {
      if (pro.min(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE) < this.filter.range.min) return false
      if (pro.max(Pro.RANGE.EXPANSION, Pro.RANGE.PASSIVE) > this.filter.range.max) return false
      return true
    })

    // generate data sets
    const dataLabels = this.#proList.map((pro) => {
      return pro.label()
    })
    const dataExpansionRange = this.#proList.map((pro) => {
      return [pro.range.expansion.min, pro.range.expansion.max]
    })
    const dataOperatingRange = this.#proList.map((pro) => {
      return [pro.range.operation.min, pro.range.operation.max]
    })
    const dataP1Range = this.#proList.map((pro) => {
      return pro.range.passive.p1
    })
    const dataP2Range = this.#proList.map((pro) => {
      return pro.range.passive.p2
    })
    const dataP3Range = this.#proList.map((pro) => {
      return pro.range.passive.p3
    })
    const dataWeight = this.#proList.map((pro) => {
      return pro.weight
    })

    this.chart.data.labels = dataLabels
    this.chart.data.datasets = [
      {
        // data
        type: 'line',
        label: 'Weight (g)',
        data: dataWeight,

        // color
        backgroundColor: Pro.COLOR.BLACK,
        borderColor: '#C1BAA190',
        // borderColor: 'hsl(0 0 0  / 0)',
        pointBackgroundColor: Pro.COLOR.BLACK,
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
        label: Pro.RANGE.OPERATION + ' (mm)',
        data: dataOperatingRange,

        // border
        borderSkipped: false,
        borderWidth: 4,

        // color
        backgroundColor: (context) => {
          if (this.length !== 0) return this.#proList[context.dataIndex].color
          else return ProChart.COLOR.TEXT.LIGHT
        },
        borderColor: Pro.COLOR.BLACK,

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
                if (this.#proList.length === 0) return ProChart.COLOR.TEXT.LIGHT
                const pro = this.#proList[context.dataIndex]
                if (pro.color === Pro.COLOR.BLACK) return ProChart.COLOR.TEXT.LIGHT
                else return ProChart.COLOR.TEXT.DARK
              },
              font: {
                family: 'Roboto',
                weight: 'bold',
                size: 12
              },
              formatter: (value, context) => {
                const pro = this.#proList[context.dataIndex]
                if ([Pro.TYPE.HEX, Pro.TYPE.NUT].includes(pro.type)) return ''
                return (value[1] - value[0]).toFixed(1)
              }
            }
          }
        }
      },
      {
        // data
        label: Pro.RANGE.EXPANSION + ' (mm)',
        data: dataExpansionRange,

        // border
        borderSkipped: false,
        borderWidth: 4,
        
        // color
        backgroundColor: 'hsl(42deg 24% 92%)',
        borderColor: Pro.COLOR.BLACK,
        
        // size
        barPercentage: 0.85,
        categoryPercentage: 1,

        // labels
        datalabels: {
          labels: {
            brand: {
              color: Pro.COLOR.BLACK,
              anchor: 'start',
              align: 'left',
              font: {
                weight: 'bold'
              },
              formatter: (value, context) => {
                if (this.#proList.length === 0) return ''
                const pro = this.#proList[context.dataIndex]
                return pro.label(true)
              }
            }
          }
        }
      }
    ]

    // options
    this.chart.options.indexAxis = 'y'
    this.chart.options.maintainAspectRatio = false
    this.chart.options.responsive = true

    // options
    this.chart.options.indexAxis = 'y'
    this.chart.options.maintainAspectRatio = false
    this.chart.options.responsive = true

    // scales
    this.chart.options.scales.y = {
      alignToPixels: true,
      stacked: true,
      grid: {
        display: false
      },
      ticks: {
        display: false
      }
    }
    this.chart.options.scales.x = {
      alignToPixels: true,
      position: 'top',
      min: this.#chartScale(Pro.RANGE, .08).min,
      max: this.#chartScale(Pro.RANGE, .16).max,
      grid: {
        color: Pro.COLOR.BLUE + '90'
      },
      ticks: {
        color: Pro.COLOR.BLACK + '90',
        font: {
          size: 14
        }
      }
    }
    this.chart.options.scales.weight = {
      alignToPixels: true,
      position: 'bottom',
      // min: this.ChartScaleMinMax(Pro.WEIGHT, .48).min,
      min: 0,
      max: this.#chartScale(Pro.WEIGHT, .02).max,
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
    document.getElementById(this.#chartCanvasId).parentElement.style.height = ((this.#proList.length * 32) + 103) + 'px'
    
    // update based on settings above
    this.chart.update()
  }
}