document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('main > section');

    // Cria e insere a mensagem de "nenhum resultado"
    const noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'no-results';
    noResultsMessage.textContent = 'Nenhum produto encontrado 😢';
    noResultsMessage.style.cssText = `
        display: none;
        text-align: center;
        font-size: 1.5rem;
        color: white;
        margin-top: 40px;
    `;
    document.querySelector('main').appendChild(noResultsMessage);

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase().trim();
        let totalVisible = 0;

        sections.forEach(section => {
            const cards = section.querySelectorAll('.product-card');
            let visible = 0;

            cards.forEach(card => {
                const name = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
                const match = name.includes(term);
                card.style.display = match ? '' : 'none';
                if (match) visible++;
            });

            section.style.display = visible > 0 ? '' : 'none';
            totalVisible += visible;
        });

        // Mostra ou esconde a mensagem de "nenhum resultado"
        noResultsMessage.style.display = totalVisible === 0 ? 'block' : 'none';
    });

    searchInput.addEventListener('blur', () => {
        if (searchInput.value.trim() === '') {
            sections.forEach(section => {
                section.style.display = '';
                section.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = '';
                });
            });
            noResultsMessage.style.display = 'none';
        }
    });

    // FAVORITOS
    loadFavorites();

    const favButton = document.createElement('button');
    favButton.className = 'favorites-toggle';
favButton.innerHTML = '<img src="img/favoritar.png" alt="Favoritos" style="width: 35px; height: 35px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">';
    favButton.onclick = toggleFavoritesSection;
    document.body.appendChild(favButton);
});

function toggleFavorite(card) {
    const productId = card.dataset.productId;
    const favorites = getFavorites();
    const allMatchingCards = document.querySelectorAll(`[data-product-id="${productId}"]`);

    if (favorites.includes(productId)) {
        removeFavorite(productId);
        allMatchingCards.forEach(matchingCard => {
            matchingCard.querySelector('.favorite-btn')?.classList.remove('active');
        });
    } else {
        addFavorite(productId);
        allMatchingCards.forEach(matchingCard => {
            matchingCard.querySelector('.favorite-btn')?.classList.add('active');
        });
    }

    updateFavoritesSection();
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function addFavorite(productId) {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function removeFavorite(productId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function loadFavorites() {
    const favorites = getFavorites();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        if (favorites.includes(card.dataset.productId)) {
            card.querySelector('.favorite-btn')?.classList.add('active');
        }
    });

    updateFavoritesSection();
}

function updateFavoritesSection() {
    const favorites = getFavorites();
    const searchContainer = document.querySelector('.search-container');

    const oldSection = document.getElementById('favorites-section');
    if (oldSection) oldSection.remove();

    if (favorites.length > 0) {
        const favoritesSection = document.createElement('section');
        favoritesSection.id = 'favorites-section';
        favoritesSection.style.display = 'block';

        const header = document.createElement('h2');
header.innerHTML = '<img src="img/favoritado.png" alt="Favoritos" style="width: 35px; height: 35px; vertical-align: middle; margin-right: 8px;"> Favoritos';
        favoritesSection.appendChild(header);

        const favoritesGrid = document.createElement('div');
        favoritesGrid.className = 'product-grid';
        favoritesGrid.id = 'favorites-grid';

        favorites.forEach(productId => {
            const originalCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (originalCard) {
                const clone = originalCard.cloneNode(true);
                const favBtn = clone.querySelector('.favorite-btn');
                if (favBtn) {
                    favBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(clone);
                    };
                }
                favoritesGrid.appendChild(clone);
            }
        });

        favoritesSection.appendChild(favoritesGrid);
        searchContainer.insertAdjacentElement('afterend', favoritesSection);
    }
}

function toggleFavoritesSection() {
    const favoritesSection = document.getElementById('favorites-section');
    const favorites = getFavorites();

    if (favorites.length > 0 && favoritesSection) {
        const isVisible = getComputedStyle(favoritesSection).display !== 'none';
        favoritesSection.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            favoritesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
