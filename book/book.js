function process_data_json() {
    const data_path = window.location.pathname + 'data.json'
    fetch(data_path)
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            render_json(json)
        })
}

function render_json(json) {
    if (Object.hasOwn(json, 'list')) {
        // navbar
        let navbar_div = document.createElement('div')
        navbar_div.classList.add('navbar', 'book')
        json.list.forEach((entry) => {
            let navbar_item = generate_navbar_item(entry)
            navbar_div.append(navbar_item)
        })
        document.body.appendChild(navbar_div)
    }
}

function generate_navbar_item(entry) {
    let div = document.createElement('div')
    div.innerText = entry['name']
    let link = document.createElement('a')
    link.href = entry['href']
    link.appendChild(div)
    return link
}

process_data_json()