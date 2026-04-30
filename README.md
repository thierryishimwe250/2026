# Inkuru Zitangaje by Thierry - News Site

A simple, high-speed dynamic news site built with HTML, Tailwind CSS, and Supabase (JavaScript SDK). No complex frameworks.

## 📋 Project Structure

```
├── index.html          # Public news page
├── admin.html          # News posting page
├── app.js              # Core logic and Supabase integration
└── README.md           # This file
```

## 🚀 Quick Start

### 1. **Supabase Setup**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a new table called `articles` with these columns:
   - `id` (int8, primary key, auto-increment)
   - `created_at` (timestamp, default: now())
   - `title` (text)
   - `content` (text)
   - `image_url` (text)

3. Get your Supabase credentials:
   - Go to **Project Settings → API**
   - Copy your `Project URL` and `Anon Key`

### 2. **Update Credentials**

Edit `app.js` and replace these values:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. **Deploy**

Upload all three files to any static hosting service:
- GitHub Pages
- Vercel
- Netlify
- Any web server

## 📄 File Details

### `index.html`
- Responsive navbar with navigation
- Grid layout for news cards (1 col on mobile, 2 on tablet, 3 on desktop)
- Loading spinner while fetching data
- Empty state message
- Error handling display

### `admin.html`
- Clean form with three inputs:
  - Article Title
  - Article Content (textarea)
  - Image URL
- Form validation
- Success/error notifications
- Loading state on submit button

### `app.js`
- **`getNews()`** - Fetches articles from Supabase and displays them as cards
- **`postNews()`** - Validates and inserts new articles to the database
- **`createNewsCard()`** - Generates card HTML with image, title, content
- **`formatDate()`** - Converts timestamps to human-readable format (e.g., "2h ago")
- Error handling and recovery

## 🎨 Features

✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Real-time Data** - Instantly displays new posts  
✅ **Form Validation** - Validates all inputs before submission  
✅ **Error Handling** - User-friendly error messages  
✅ **Fast Loading** - Placeholder images and loading states  
✅ **Image Preview** - Fallback for broken image URLs  
✅ **Relative Timestamps** - "2h ago" instead of full dates  

## 🔧 Configuration

### Environment Variables (Optional)
Instead of hardcoding, you can store credentials in environment variables:
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-key';
```

### Tailwind Customization
All styling uses Tailwind CSS classes. Modify colors in `index.html` and `admin.html` as needed.

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): 1 column grid
- **Tablet** (768px - 1024px): 2 column grid
- **Desktop** (> 1024px): 3 column grid

## 🔐 Security Notes

- Supabase credentials are public (Anon Key), which is safe by design
- Implement Row Level Security (RLS) policies in Supabase for production
- Validate all inputs server-side (Supabase functions)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No news available" | Check Supabase credentials and table name |
| Images not loading | Verify image URLs are valid and accessible |
| Form not submitting | Check browser console for JavaScript errors |
| Blank page | Ensure Supabase URL and Anon Key are correct |

## 📝 Database Schema

```sql
CREATE TABLE articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL
);
```

## 🎯 Future Enhancements

- Search functionality
- Category/tag filtering
- User authentication
- Comment system
- Social sharing
- Dark mode toggle

## 👨‍💻 Author

**Thierry** - Senior Web Developer

---

**Built with:** HTML • Tailwind CSS • Supabase • Vanilla JavaScript
