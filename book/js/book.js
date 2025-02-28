/* GNU GPL V3 */

/***********************************/
/******* Climber's Guidebook *******/
/***********************************/
/**
 * The guidebook is designed with the following goals:
 *    1. Free information by climbers for climbers.
 *        No one, not even this org, may use the information commercially.
 *        Words and photos protected by CC BY-NC-SA 4.0 INT.
 *        Code protected by GNU GPL V3.
 *    2. Provide a minimum standardized dataset.
 *        This is a delicate balance: you need enough details for an inexperienced climber to find
 *        the climb and not get hurt, but not so much it ruins the sense of adventure.
 *    3. Offline capability on all devices.
 *        Allow users to cache the data for remote areas, this relies on the above goal of small
 *        datasets to limit excessive data storage on mobile devices.
 *        Users can still use maps offline to find their desired routes and read necassary info.
 */

/** history controls
 * 
 * @returns 
 */
// The guidebook is a static site with a single html page.
// Instead of numerous html pages with the same structure (lots of excess bytes and page loading),
// it dynamically loads data files to display relevant information.
// The problem is crag, route, and problem would be viewed from url '<host>/book'.
// This prevents the user from sharing links to specific data
function getUrlSearch () {
  const urlSearchParams = new URLSearchParams(window.location.search)
  return Object.fromEntries(urlSearchParams.entries())
}

function load_json() {
  // parse current url query parameter 'path'
  const search = getUrlSearch()
  let jsonPath = null
  if (! Object.hasOwn(search, 'path')) {
    jsonPath = '/book/data/data.json'
  } else {
    jsonPath = '/book/data/' + search.path + '/data.json'
  }

  // get json contents and pass to renderer
  fetch(jsonPath)
    .then((response) => response.json())
    .then((json) => {
      render(json)
    })
}

function render (json) {
  updateInfo(json)
  updateList(json)
}

function updateInfo(json) {
  const info = document.getElementById('info')
  info.innerHTML = ''
  if (Object.hasOwn(json, 'name')) {
    // create <h2>name</h2>
    const title = document.createElement('h2')
    title.append(json.name)
    info.appendChild(title)
  }
}

function updateList(json) {
  const list = document.getElementById('list')
  list.innerHTML = ''

  // create <ul>area</ul>
  // add areas with valid links first
  if (Object.hasOwn(json, 'areas')) {
    const valid = []
    const empty = []

    json.areas.forEach(area => {
      const link = document.createElement('ul')
      link.setAttribute('child', area.child)
      link.addEventListener('click', queryAddPathChild)
      link.append(area.name)

      if (area.child) {
        valid.push(link)
      } else {
        link.classList.add('inactive')
        empty.push(link)
      }
    })

    valid.forEach(link => {
      list.append(link)
    });

    empty.forEach(link => {
      list.append(link)
    });
  }
}

function queryAddPathChild () {
  const url = new URL(window.location)
  const child = this.getAttribute('child')
  let path = url.searchParams.get('path')
  if (path) {
    path = path + '/' + child
  } else {
    path = child
  }
  console.log(path)
  url.searchParams.set('path', path)
  history.pushState(null, '', url);
  load_json()
}

// add a new location change event which triggers on history changes
;(function() {
  var pushState = history.pushState;
  var replaceState = history.replaceState;
  history.pushState = function() {
      pushState.apply(history, arguments);
      window.dispatchEvent(new Event('pushstate'));
  };
  history.replaceState = function() {
      replaceState.apply(history, arguments);
      window.dispatchEvent(new Event('replacestate'));
  };
  window.addEventListener('popstate', function() {
      window.dispatchEvent(new Event('locationchange'))
  });
})();

window.addEventListener('locationchange', function(){
  load_json()
})

// entrypoint
load_json()