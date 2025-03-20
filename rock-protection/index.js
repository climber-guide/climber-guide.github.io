/*************************************************************************************************
 * index.js v1.0.0                                                                               *
 * (c) 2025 Grant Freeman                                                                        *
 * License GPL 3.0                                                                               *
 *************************************************************************************************/
/* global ProChart */

const pc = new ProChart('pro-chart-container', true)
pc.filter.range.min = 20
pc.filter.range.max = 70
pc.filter.strength.min = 5
pc.deploy()
