const API_KEY = 'live_TN6K2LR16IQFfrWXsmiFj4t2uJN4MV1S9KSQdDZxrIDEFxkjvureEJRyoNrt32YC';
const BASE_URL = 'https://api.thecatapi.com/v1/images/search';
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');
const breedSelect = document.getElementById('breed-select');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

let currentBreed = '';
let isLoading = false;

// Initial load
fetchCats();

// Event listeners
loadMoreBtn.addEventListener('click', fetchCats);
breedSelect.addEventListener('change', (e) => {
    currentBreed = e.target.value;
    gallery.innerHTML = ''; // Clear current gallery
    fetchCats();
});

async function fetchCats() {
    if (isLoading) return;
    
    isLoading = true;
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    
    try {
        const limit = 10;
        let url = `${BASE_URL}?limit=${limit}&api_key=${API_KEY}`;
        
        if (currentBreed) {
            url += `&breed_ids=${currentBreed}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const cats = await response.json();
        
        if (cats.length === 0) {
            showError('No cats found for the selected breed.');
            return;
        }
        
        displayCats(cats);
    } catch (error) {
        console.error('Error fetching cats:', error);
        showError('Failed to load cats. Please try again later.');
    } finally {
        isLoading = false;
        loadingElement.style.display = 'none';
    }
}

function displayCats(cats) {
    cats.forEach(cat => {
        const catCard = document.createElement('div');
        catCard.className = 'cat-card';
        
        const img = document.createElement('img');
        img.src = cat.url;
        img.alt = 'Random cat';
        img.loading = 'lazy';
        
        const catInfo = document.createElement('div');
        catInfo.className = 'cat-info';
        
        if (cat.breeds && cat.breeds.length > 0) {
            const breed = cat.breeds[0];
            catInfo.innerHTML = `
                <h3>${breed.name}</h3>
                <p>${breed.temperament}</p>
            `;
        } else {
            catInfo.innerHTML = '<p>Mixed breed</p>';
        }
        
        catCard.appendChild(img);
        catCard.appendChild(catInfo);
        gallery.appendChild(catCard);
    });
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}