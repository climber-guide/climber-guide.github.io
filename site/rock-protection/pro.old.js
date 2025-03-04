class Protection {
  // range (mm)
  // strength (kn)
  // weight (g)
  constructor() {
    this.data = []
  }

  get count() {
    return this.data.length
  }

  get label() {
    return this.data.map((pro) => {
      return [pro.brand, pro.model, pro.size].join(' ')
    })
  }

  get labelShort() {
    return this.data.map((pro) => {
      return [pro.brand_short, pro.model_short, pro.size].join(' ')
    })
  }

  get operateRange() {
    return this.data.map((pro) => {
      let overcam = (pro.range_max - pro.range_min) * 0.10
      let undercam = (pro.range_max - pro.range_min) * 0.25
      return [(pro.range_min + overcam).toFixed(1), (pro.range_max - undercam).toFixed(1)]
    })
  }

  get widthRange() {
    return this.data.map((pro) => {
      return [pro.range_min, pro.range_max]
    })
  }

  get overcamRange() {
    return this.data.map((pro) => {
      let size = (pro.range_max - pro.range_min) * 0.10
      return [pro.range_min, (pro.range_min + size)]
    })
  }

  get undercamRange() {
    return this.data.map((pro) => {
      let size = (pro.range_max - pro.range_min) * 0.25
      return [(pro.range_max - size), pro.range_max]
    })
  }

  get fillColor() {
    return this.data.map((pro) => {
      switch (pro.color) {
        case "black":
          return "hsl(0 0 16)"
        case "gray":
          return "hsl(0 0 64)"
        case "red":
          return "hsl(6 69 83)"
        case "orange":
          return "hsl(29 77 93)"
        case "yellow":
          return "hsl(41 84 64)"
        case "green":
          return "hsl(141 45 59)"
        case "blue":
          return "hsl(204 80 58)"
        case "purple":
          return "hsl(284 54 67)"
        default:
          break;
      }
    })
  }

  add(brand, brand_short, device, model, model_short, size, color,
      range_min, range_max, strength_hold, strength_pass, weight) {
        this.data.push({
          brand: brand,
          brand_short: brand_short,
          device: device,
          model: model,
          model_short: model_short,
          size: size,
          color: color,
          range_min: range_min,
          range_max: range_max,
          strength_hold: strength_hold,
          strength_pass: strength_pass,
          weight: weight
        })
  }

  sort() {
    this.data.sort((a, b) => {
      let aOperateRangeMin = (((a.range_max - a.range_min) * 0.1) + a.range_min).toFixed(1)
      let bOperateRangeMin = (((b.range_max - b.range_min) * 0.1) + b.range_min).toFixed(1)
      return aOperateRangeMin - bOperateRangeMin
    })
  }

}

const pro = new Protection()
pro.add('Black Diamond', 'BD', 'cam', 'Camelot C4', 'C4', '0.3', 'blue',   13.8, 23.4,  8,  8, 69.8)
pro.add('Black Diamond', 'BD', 'cam', 'Camelot C4', 'C4', '0.4', 'gray',   15.5, 26.7,  9,  9, 78.0)
pro.add('Black Diamond', 'BD', 'cam', 'Camelot C4', 'C4', '0.5', 'purple', 19.6, 33.5, 12, 12, 93.0)

pro.add('Black Diamond', 'BD', 'cam', 'Camelot Z4', 'Z4', '0.2', 'yellow', 10.4, 16.3,  6,  null, 48)
pro.add('Black Diamond', 'BD', 'cam', 'Camelot Z4', 'Z4', '0.3', 'blue',   12.4, 22.6,  8,  8, 54)
pro.add('Black Diamond', 'BD', 'cam', 'Camelot Z4', 'Z4', '0.4', 'gray',   15.3, 27.7,  9,  9, 61)
pro.add('Black Diamond', 'BD', 'cam', 'Camelot Z4', 'Z4', '0.5', 'purple', 18.8, 33.9, 10, 10, 77)

pro.add('DMM Wales', 'DMM', 'cam', 'Dragon', 'Dragon', '00', 'blue', 14, 21, 10, 9, 75)
pro.add('DMM Wales', 'DMM', 'cam', 'Dragon', 'Dragon', '0', 'gray', 16, 25, 14, 12, 85)

pro.add('DMM Wales', 'DMM', 'cam', 'Dragonfly Micro', 'Dragonfly', '3', 'yellow', 10.2, 15.1, 8, null, 65)
pro.add('DMM Wales', 'DMM', 'cam', 'Dragonfly Micro', 'Dragonfly', '4', 'blue', 12.1, 17.9, 8, null, 67)
pro.add('DMM Wales', 'DMM', 'cam', 'Dragonfly Micro', 'Dragonfly', '5', 'gray', 15.1, 22.5, 9, null, 70)
pro.add('DMM Wales', 'DMM', 'cam', 'Dragonfly Micro', 'Dragonfly', '6', 'purple', 19, 28.3, 9, null, 73)

pro.add('Totem', 'Totem', 'cam', '', '', '0.5', 'black', 11.7, 18.9, 6, null, 69)
pro.add('Totem', 'Totem', 'cam', '', '', '0.65', 'blue', 13.8, 22.5, 8, null, 75)
pro.add('Totem', 'Totem', 'cam', '', '', '0.80', 'yellow', 17, 27.7, 9, null, 83)
pro.add('Totem', 'Totem', 'cam', '', '', '1.00', 'purple', 20.9, 34.2, 10, null, 95)

pro.add('Wild Country', 'WC', 'cam', 'Friend', 'F', '0.4', 'gray', 15.8, 26.4, 9, 9, 75)
pro.add('Wild Country', 'WC', 'cam', 'Friend', 'F', '0.5', 'purple', 20.6, 34.5, 12, 12, 88)

pro.add('Wild Country', 'WC', 'cam', 'Zero Friend', 'ZF', '0.2', 'yellow', 10.4, 15.7, 6, null, 51)
pro.add('Wild Country', 'WC', 'cam', 'Zero Friend', 'ZF', '0.3', 'blue', 13.8, 22.3, 8, null, 68)
pro.add('Wild Country', 'WC', 'cam', 'Zero Friend', 'ZF', '0.4', 'gray', 15.8, 25.9, 9, null, 70)
pro.add('Wild Country', 'WC', 'cam', 'Zero Friend', 'ZF', '0.5', 'purple', 20.2, 32.9, 9, null, 76)




pro.sort()


window.addEventListener('load', function () {
  const ctx = document.getElementById('chart')
  ctx.setAttribute('height', pro.count * 16)
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: pro.labelShort,
      datasets: [
        {
          label: 'width range (mm)',
          data: pro.widthRange,
          backgroundColor: 'hsla(0 0 0 / 0)',
          borderColor: "hsl(0 0 16)",
          borderWidth: 4,
          borderSkipped: false,
          barThickness: 26
        },
        {
          label: 'operational range (mm)',
          data: pro.operateRange,
          backgroundColor: pro.fillColor,
          borderWidth: 0,
          borderSkipped: false,
          barThickness: 24
        },
      ]
    },
    options: {
      // barThickness: 32,
      indexAxis: 'y',
      plugins: {
        title: {
          display: true,
          text: 'Fingertips to Ring Locks'
        }
      },
      scales: {
        x: {
          beginAtZero: false
        },
        y: {
          stacked: true
        }
      }
    }
  });
})
