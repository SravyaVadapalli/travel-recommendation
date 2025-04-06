document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-btn');
    const clearButton = document.querySelector('.clear-btn');
    const searchResultsContainer = document.querySelector('.search-results-container');
    const searchResultsDiv = document.getElementById('searchResults');

    if (!searchInput || !searchButton || !clearButton || !searchResultsContainer || !searchResultsDiv) {
        console.error('One or more elements not found.');
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setupSearch(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

    function setupSearch(data) {
        searchButton.addEventListener('click', () => {
            const keyword = searchInput.value.toLowerCase().trim();

            if (keyword === '') {
                alert('Please enter a destination or keyword.');
                return;
            }

            let results = [];

            if (keyword === 'countries') {
                data.countries.forEach(country => {
                    results = results.concat(country.cities);
                });
            } else if (keyword === 'temples') {
                results = data.temples;
            } else if (keyword === 'beaches') {
                results = data.beaches;
            } else {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(keyword) || city.description.toLowerCase().includes(keyword)) {
                            results.push(city);
                        }
                    });
                });

                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(keyword) || temple.description.toLowerCase().includes(keyword)) {
                        results.push(temple);
                    }
                });

                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(keyword) || beach.description.toLowerCase().includes(keyword)) {
                        results.push(beach);
                    }
                });
            }

            displayResults(results);
            searchResultsContainer.style.display = 'block';
            searchResultsContainer.scrollIntoView({ behavior: "smooth" });
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchResultsContainer.style.display = 'none';
            searchResultsDiv.innerHTML = '';
        });
    }

    function displayResults(results) {
        searchResultsDiv.innerHTML = '';

        if (results.length === 0) {
            const noResults = document.createElement('p');
            noResults.textContent = 'No results found.';
            searchResultsDiv.appendChild(noResults);
        } else {
            results.forEach(item => {
                const resultCard = document.createElement('div');
                resultCard.classList.add('result-card');

                resultCard.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}" class="result-image">
                    <div class="result-details">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p><strong>Local Time:</strong> <span class="local-time" data-timezone="${item.timeZone || 'UTC'}"></span></p>
                        <button class="visit-button">Visit</button>
                    </div>
                `;

                searchResultsDiv.appendChild(resultCard);
            });

            updateLocalTimes(); // Initial call
            setInterval(updateLocalTimes, 1000); // Update every second
        }
    }

    function updateLocalTimes() {
        const timeElements = document.querySelectorAll('.local-time');

        timeElements.forEach(elem => {
            const timeZone = elem.getAttribute('data-timezone') || 'UTC';
            const options = {
                timeZone: timeZone,
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };

            const timeString = new Date().toLocaleTimeString('en-US', options);
            elem.textContent = timeString;
        });
    }
});
