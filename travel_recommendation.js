document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-btn');
    const clearButton = document.querySelector('.clear-btn');
    const homeDiv = document.querySelector('.home');
    const searchResultsContainer = document.querySelector('.search-results-container');
    const searchResultsDiv = document.getElementById('searchResults');

    if (!searchInput || !searchButton || !clearButton || !homeDiv || !searchResultsContainer || !searchResultsDiv) {
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
            console.log('Fetched Data:', data);
            setupSearch(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

    function setupSearch(data) {
        searchButton.addEventListener('click', () => {
            const keyword = searchInput.value.toLowerCase();
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
            homeDiv.style.display = 'none';
            searchResultsContainer.style.display = 'block';
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            homeDiv.style.display = 'block';
            searchResultsContainer.style.display = 'none';
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
                        <h2>${item.name}</h2>
                        <p>${item.description}</p>
                        <button class="visit-button">Visit</button>
                    </div>
                `;

                searchResultsDiv.appendChild(resultCard);
            });
        }
    }
});