// ============================================
// SUPABASE CONFIGURATION
// ============================================
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Initialize Supabase client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FETCH AND DISPLAY NEWS
// ============================================
async function getNews() {
    try {
        // Show loading state
        const container = document.getElementById('news-container');
        const loading = document.getElementById('loading');
        const empty = document.getElementById('empty-state');
        const errorState = document.getElementById('error-state');

        if (loading) loading.classList.remove('hidden');
        if (container) container.classList.add('hidden');
        if (empty) empty.classList.add('hidden');
        if (errorState) errorState.classList.add('hidden');

        // Fetch articles from Supabase
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        // Hide loading
        if (loading) loading.classList.add('hidden');

        // Check if data exists
        if (!data || data.length === 0) {
            if (empty) empty.classList.remove('hidden');
            return;
        }

        // Display articles
        if (container) {
            container.innerHTML = '';
            data.forEach(article => {
                const card = createNewsCard(article);
                container.appendChild(card);
            });
            container.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        const errorState = document.getElementById('error-state');
        const errorMessage = document.getElementById('error-message');
        if (errorState && errorMessage) {
            errorMessage.textContent = `Failed to load news: ${error.message}`;
            errorState.classList.remove('hidden');
        }
        if (document.getElementById('loading')) {
            document.getElementById('loading').classList.add('hidden');
        }
    }
}

// ============================================
// CREATE NEWS CARD ELEMENT
// ============================================
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow';

    const imageUrl = article.image_url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 class=%22w-full h-48 bg-gray-200%22 fill=%22%23d1d5db%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z%22/%3E%3C/svg%3E';

    const formattedDate = formatDate(article.created_at);

    card.innerHTML = `
        <div class="h-48 overflow-hidden bg-gray-200">
            <img 
                src="${imageUrl}" 
                alt="${article.title}" 
                class="w-full h-full object-cover"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 class=%22w-full h-full bg-gray-300%22 fill=%22%239ca3af%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E'"
            >
        </div>
        <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">${escapeHtml(article.title)}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${escapeHtml(article.content)}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span>${formattedDate}</span>
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">News</span>
            </div>
        </div>
    `;

    return card;
}

// ============================================
// POST NEW ARTICLE TO SUPABASE
// ============================================
async function postNews(title, content, image_url) {
    try {
        // Validate inputs
        if (!title || title.trim().length < 5) {
            throw new Error('Title must be at least 5 characters');
        }
        if (!content || content.trim().length < 10) {
            throw new Error('Content must be at least 10 characters');
        }
        if (!image_url || image_url.trim().length === 0) {
            throw new Error('Image URL is required');
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('articles')
            .insert([
                {
                    title: title.trim(),
                    content: content.trim(),
                    image_url: image_url.trim()
                }
            ]);

        if (error) throw new Error(error.message);

        // Success
        console.log('Article posted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error posting news:', error);
        throw error;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date as relative time (e.g., "2h ago")
function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    // Fallback to formatted date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
});
