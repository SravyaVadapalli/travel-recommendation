document.addEventListener('DOMContentLoaded', () => {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Data:', data);
            data.forEach(item => {
                console.log('Place Name:', item.name);
            });
            displayRecommendations(data);

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

function displayRecommendations(data) {
    const recommendationsContainer = document.createElement('div');
    document.body.appendChild(recommendationsContainer);

    data.forEach(item => {
        const recommendationDiv = document.createElement('div');
        recommendationDiv.innerHTML = `
            <h2>${item.name}</h2>
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 200px;">
            <p>${item.description}</p>
        `;
        recommendationsContainer.appendChild(recommendationDiv);
    });
}