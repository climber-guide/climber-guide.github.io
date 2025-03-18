/* global ProChart */

const pc = new ProChart('pro-chart-container', true)
pc.filter.range.min = 0
pc.filter.range.max = 20
pc.filter.strength.min = 7
pc.deploy()
