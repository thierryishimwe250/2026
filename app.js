// ============================================
// SUPABASE CONFIGURATION
// ============================================
// Production Supabase Credentials
const SUPABASE_URL = 'https://yefyufnwegofxhacfmaj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ToZ3q82KZyZaZt5L2qPXRw_aaOUGTkl';

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

        console.log('Fetching articles from Supabase...');

        // Fetch articles from Supabase
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        // Enhanced error handling
        if (error) {
            console.error('Supabase fetch error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }

        console.log('Articles fetched successfully:', data);

        // Hide loading state
        if (loading) loading.classList.add('hidden');

        // Check if data exists
        if (!data || data.length === 0) {
            console.log('No articles found in database');
            if (empty) empty.classList.remove('hidden');
            return;
        }

        // Display articles - Map through data and create cards
        if (container) {
            container.innerHTML = '';
            
            data.forEach(article => {
                try {
                    const card = createNewsCard(article);
                    container.appendChild(card);
                } catch (cardError) {
                    console.error('Error creating card for article:', article.id, cardError);
                }
            });

            console.log(`Successfully displayed ${data.length} articles`);
            container.classList.remove('hidden');
        }

    } catch (error) {
        console.error('Error in getNews function:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // Update error display
        const errorState = document.getElementById('error-state');
        const errorMessage = document.getElementById('error-message');
        const loading = document.getElementById('loading');

        if (errorState && errorMessage) {
            errorMessage.textContent = `❌ Failed to load news: ${error.message}`;
            errorState.classList.remove('hidden');
        }

        // Hide loading indicator
        if (loading) {
            loading.classList.add('hidden');
        }

        // Update loading element to show error
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-600 text-lg">⚠️ Error loading news</p>
                    <p class="text-gray-500 text-sm mt-2">${error.message}</p>
                    <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Retry
                    </button>
                </div>
            `;
            loadingDiv.classList.remove('hidden');
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

        console.log('Posting article to Supabase...');

        // Insert into Supabase with .select() for v2 compatibility
        const { data, error } = await supabase
            .from('articles')
            .insert([
                {
                    title: title.trim(),
                    content: content.trim(),
                    image_url: image_url.trim()
                }
            ])
            .select(); // Required in Supabase v2 to return the inserted data

        // Enhanced error handling
        if (error) {
            console.error('Supabase insert error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw new Error(`Failed to post article: ${error.message}`);
        }

        console.log('Article posted successfully:', {
            insertedData: data,
            timestamp: new Date().toISOString()
        });

        // Success confirmation
        if (data && data.length > 0) {
            console.log('New article ID:', data[0].id);
            console.log('Created at:', data[0].created_at);
        }

        return data;

    } catch (error) {
        console.error('Error in postNews function:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            inputData: { title: title?.substring(0, 20), content: content?.substring(0, 20) }
        });
        throw error;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date as relative time (e.g., "2h ago")
function formatDate(isoString) {
    try {
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
    } catch (error) {
        console.error('Error formatting date:', isoString, error);
        return 'Unknown date';
    }
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    if (!text) return '';
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

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global JavaScript error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
    });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', {
        reason: event.reason,
        promise: event.promise
    });
});

// Log initialization
console.log('Inkuru Zitangaje News Site Initialized', {
    supabaseUrl: SUPABASE_URL,
    timestamp: new Date().toISOString()
});
