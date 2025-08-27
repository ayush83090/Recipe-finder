// API Configuration
const API_KEY = '072b824f33bf4c36b708e075ec981b75';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// DOM Elements
const recipesContainer = document.querySelector('.recipes-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resetFiltersBtn = document.getElementById('reset-filters');
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
const homeBtn = document.getElementById('home-btn');
const aboutBtn = document.getElementById('about-btn');
const themeToggle = document.getElementById('theme-toggle');

// State Management
const recipeCache = {};
let currentView = 'home'; // 'home' or 'about'

// Initialize the application
function init() {
    loadThemePreference();
    setupEventListeners();
    filterRecipes();
}

// Load saved theme preference
function loadThemePreference() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', filterRecipes);
    searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && filterRecipes());
    
    // Filter functionality
    resetFiltersBtn.addEventListener('click', resetFilters);
    filterCheckboxes.forEach(cb => cb.addEventListener('change', filterRecipes));
    
    // Navigation
    homeBtn.addEventListener('click', showHomeView);
    aboutBtn.addEventListener('click', showAboutView);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
}

// Toggle between light and dark theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Show home view with recipes
function showHomeView(e) {
    if (e) e.preventDefault();
    currentView = 'home';
    updateActiveNav();
    filterRecipes();
}

// Show about view
function showAboutView(e) {
    if (e) e.preventDefault();
    currentView = 'about';
    updateActiveNav();
    
    recipesContainer.innerHTML = `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recipe Finder - About</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* Base Styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
            line-height: 1.6;
        }

        /* Navigation Bar */
        .navbar {
            background-color: #ff6b6b;
            color: white;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }

        .nav-logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 1.5rem;
            align-items: center;
        }

        .nav-link {
            color: white;
            text-decoration: none;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .nav-link:hover {
            background-color: rgba(255,255,255,0.2);
        }

        .nav-link.active {
            background-color: rgba(255,255,255,0.3);
        }

        .theme-toggle {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .theme-toggle:hover {
            background-color: rgba(255,255,255,0.2);
        }

        /* About Page Styles */
        .about-container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .about-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .about-header h1 {
            color: #ff6b6b;
            margin-bottom: 0.5rem;
        }

        .about-header p {
            color: #666;
            font-size: 1.1rem;
        }

        .about-section {
            margin-bottom: 2rem;
        }

        .about-section h2 {
            color: #ff6b6b;
            border-bottom: 2px solid #eee;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }

        .developer-card {
            display: flex;
            align-items: center;
            gap: 2rem;
            background: #f9f9f9;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 1.5rem;
        }

        .developer-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #ff6b6b;
        }

        .developer-info h3 {
            margin: 0 0 0.5rem;
            color: #333;
        }

        .developer-info p {
            margin: 0.3rem 0;
            color: #666;
        }

        .contact-link {
            display: inline-block;
            margin-top: 0.5rem;
            color: #ff6b6b;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s;
        }

        .contact-link:hover {
            color: #ff5252;
            text-decoration: underline;
        }

        /* Dark Theme Styles */
        body.dark-theme {
            background-color: #121212;
            color: #e0e0e0;
        }

        body.dark-theme .about-container,
        body.dark-theme .developer-card {
            background-color: #1e1e1e;
            color: #e0e0e0;
        }

        body.dark-theme .about-header h1,
        body.dark-theme .about-section h2,
        body.dark-theme .developer-info h3 {
            color: #ff8e8e;
        }

        body.dark-theme .about-header p,
        body.dark-theme .developer-info p {
            color: #b0b0b0;
        }

        body.dark-theme .developer-card {
            background-color: #2d2d2d;
            border: 1px solid #444;
        }

        body.dark-theme .contact-link {
            color: #ff8e8e;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .developer-card {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">RecipeFinder</a>
            <div class="nav-links">
                <a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>
                <a href="about.html" class="nav-link active"><i class="fas fa-info-circle"></i> About</a>
                <button class="theme-toggle" id="theme-toggle">
                    <i class="fas fa-moon"></i> Dark Mode
                </button>
            </div>
        </div>
    </nav>

    <main>
        <div class="about-container">
            <div class="about-header">
                <h1>About Recipe Finder</h1>
                <p>Your ultimate solution for discovering delicious recipes tailored to your preferences!</p>
            </div>

            <div class="about-section">
                <h2>Our Mission</h2>
                <p>Recipe Finder was created to help people discover new and exciting recipes based on their dietary preferences, available ingredients, and cooking skills. We believe everyone should have access to great recipes regardless of their cooking experience.</p>
            </div>

            <div class="about-section">
                <h2>Features</h2>
                <ul>
                    <li>Search thousands of recipes with our powerful search engine</li>
                    <li>Filter by meal type, cuisine, and dietary restrictions</li>
                    <li>View complete recipe details with step-by-step instructions</li>
                    <li>Save your favorite recipes for quick access</li>
                    <li>Toggle between light and dark themes for comfortable browsing</li>
                </ul>
            </div>

            <div class="about-section">
                <h2>Meet the Developer</h2>
                <p>Recipe Finder was developed by a passionate developer who loves both cooking and coding.</p>
                
                <div class="developer-card">
                    <div class="developer-info">
                        <h3>Ayush Pandey</h3>
                        <p>Lead Developer</p>
                        <p>Full Stack Developer & Cooking Enthusiast</p>
                        <p>Specializing in creating user-friendly applications that solve real-world problems</p>
                        <a href="mailto:ayushpandeyv1976@gmail.com" class="contact-link">
                            <i class="fas fa-envelope"></i> ayushpandeyv1976@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            <div class="about-section">
                <h2>Contact Us</h2>
                <p>Have questions, suggestions, or feedback? We'd love to hear from you!</p>
                <p>Email: <a href="mailto:ayushpandeyv1976@gmail.com">ayushpandeyv1976@gmail.com</a></p>
            </div>
        </div>
    </main>

    <script>
        // Theme Toggle Functionality
        const themeToggle = document.getElementById('theme-toggle');
        
        // Load saved theme preference
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
        
        // Toggle theme
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                localStorage.setItem('theme', 'light');
            }
        });
    </script>
</body>
</html>
    `;
}

// Update active navigation link
function updateActiveNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (currentView === 'home') {
        homeBtn.classList.add('active');
    } else {
        aboutBtn.classList.add('active');
    }
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';
    filterCheckboxes.forEach(cb => cb.checked = false);
    filterRecipes();
}

// Main filter function to fetch recipes
async function filterRecipes() {
    const searchTerm = searchInput.value.trim();
    const selectedMealTypes = getSelectedFilters('meal-type');
    const selectedCuisines = getSelectedFilters('cuisine');
    const selectedDiets = getSelectedFilters('diet');
    
    try {
        showLoading('Searching for recipes...');
        
        let queryParams = `apiKey=${API_KEY}&number=12&addRecipeInformation=true`;
        
        if (searchTerm) queryParams += `&query=${encodeURIComponent(searchTerm)}`;
        if (selectedMealTypes.length) queryParams += `&type=${selectedMealTypes.join(',')}`;
        if (selectedCuisines.length) queryParams += `&cuisine=${selectedCuisines.join(',')}`;
        if (selectedDiets.length) queryParams += `&diet=${selectedDiets.join(',')}`;
        
        const response = await fetch(`${BASE_URL}/complexSearch?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length) {
            displayRecipes(data.results);
        } else {
            showNoResults();
        }
    } catch (error) {
        showError(error.message);
    }
}

// Display recipe cards
function displayRecipes(recipes) {
    recipesContainer.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.dataset.id = recipe.id;
        
        recipeCard.innerHTML = `
            <img src="${recipe.image}" onerror="this.src='images/default-food.jpg'" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    ${recipe.diets ? recipe.diets.map(diet => `<span class="recipe-tag">${diet}</span>`).join('') : ''}
                </div>
                <div class="recipe-details">
                    <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes} mins</span>
                    <span><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
                </div>
            </div>
        `;
        
        recipeCard.addEventListener('click', () => showRecipeDetails(recipe.id));
        recipesContainer.appendChild(recipeCard);
    });
}

// Show detailed recipe view
async function showRecipeDetails(recipeId) {
    try {
        showLoading('Loading recipe details...');
        
        if (recipeCache[recipeId]) {
            displayRecipeDetails(recipeCache[recipeId]);
            return;
        }
        
        const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=false`);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const recipeDetails = await response.json();
        recipeCache[recipeId] = recipeDetails;
        displayRecipeDetails(recipeDetails);
    } catch (error) {
        showError(error.message);
    }
}

// Display detailed recipe information
function displayRecipeDetails(recipe) {
    recipesContainer.innerHTML = `
        <div class="recipe-detail">
            <button onclick="showHomeView()" class="back-button"><i class="fas fa-arrow-left"></i> Back to recipes</button>
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}" class="detail-image">
            
            <div class="detail-meta">
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${recipe.readyInMinutes} minutes</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-utensils"></i>
                    <span>${recipe.servings} servings</span>
                </div>
                ${recipe.diets ? `<div class="meta-item">
                    <i class="fas fa-heart"></i>
                    <span>${recipe.diets.join(', ')}</span>
                </div>` : ''}
            </div>
            
            <div class="detail-section">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">
                    ${recipe.extendedIngredients.map(ing => `
                        <li>
                            <span class="ingredient-amount">${Math.round(ing.amount * 10) / 10} ${ing.unit}</span>
                            <span class="ingredient-name">${ing.name}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3>Instructions</h3>
                ${recipe.instructions 
                    ? `<div class="instructions">${formatInstructions(recipe.instructions)}</div>`
                    : `<p>No instructions provided. Check the <a href="${recipe.sourceUrl}" target="_blank">original source</a>.</p>`
                }
            </div>
            
            ${recipe.sourceUrl ? `
            <div class="detail-section">
                <a href="${recipe.sourceUrl}" target="_blank" class="original-link">
                    <i class="fas fa-external-link-alt"></i> View original recipe
                </a>
            </div>` : ''}
        </div>
    `;
}

// Helper function to format instructions
function formatInstructions(instructions) {
    // Remove HTML tags if present
    const cleanText = instructions.replace(/<[^>]*>?/gm, '');
    // Add line breaks for numbered steps
    return cleanText.replace(/(\d+\.)\s/g, '<br>$1 ');
}

// Helper function to get selected filters
function getSelectedFilters(filterName) {
    const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Show loading state
function showLoading(message) {
    recipesContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> ${message}
        </div>
    `;
}

// Show no results message
function showNoResults() {
    recipesContainer.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <p>No recipes found. Try adjusting your search or filters.</p>
            <button onclick="resetFilters()" class="back-button">Reset Filters</button>
        </div>
    `;
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    recipesContainer.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message || 'Something went wrong. Please try again.'}</p>
            <button onclick="filterRecipes()" class="back-button">Try Again</button>
        </div>
    `;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make functions available globally for HTML onclick attributes
window.showHomeView = showHomeView;
window.resetFilters = resetFilters;
window.filterRecipes = filterRecipes;