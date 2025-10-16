Student Finance Tracker
A comprehensive, accessible, and responsive web application designed for students to manage their expenses effectively with advanced regex validation and search capabilities.
Live Demo
GitHub Repository: https://github.com/murinziben/Front-End_Summative_Student-Finance-Tracker_Responsive-UI
Live Demo (YouTube page): https://youtu.be/MYauxsuwcr4
Table of Contents
Theme
Features
Regex Patterns Catalog
Keyboard Navigation Map
Accessibility Features
Project Structure
Installation & Setup
Usage Guide
Testing
Technologies Used
Browser Support
Known Issues
Future Enhancements
License
Contact

Theme
Student Finance Tracker - A financial management application tailored for students to track expenses, manage budgets, and analyze spending patterns across multiple categories.

Features
Core Features
Dashboard with Statistics
Total transactions for current month
Total spending with currency conversion
Top spending category
Last 7 days spending trend
Interactive charts (Category breakdown & Daily trend)
Recent transactions table
Transaction Management
Add, edit, and delete transactions
Unique ID generation for each record
Timestamps (createdAt, updatedAt) for all records
Categories: Food, Books, Transport, Entertainment, Fees, Health, Other
Advanced Regex Validation
Description validation (no leading/trailing spaces)
Amount validation with decimal support
Date format validation (YYYY-MM-DD)
Category validation
Duplicate word detection (advanced back-reference pattern)
Regex-Powered Search
Live regex search with try/catch error handling
Case-insensitive toggle
Highlight matches using <mark> tags
Search across description, category, and amount
Sorting Capabilities
Sort by date (ascending/descending)
Sort by description (A-Z, Z-A)
Sort by amount (low-high, high-low)
Budget Management
Set monthly budget cap
Real-time remaining/overage calculation
ARIA live regions for budget alerts
Polite announcement when under budget
Assertive announcement when over budget
Multi-Currency Support
Base currency: USD
EUR conversion with custom rate
RWF (Rwandan Franc) conversion with custom rate
Manual rate configuration in Settings
Data Persistence
LocalStorage for automatic data saving
JSON Export with proper formatting
JSON Import with validation
Seed data with 11+ diverse records
Accessibility (A11y)
Semantic HTML5 landmarks
ARIA labels and live regions
Keyboard-only navigation
Skip-to-content link
Visible focus indicators
High contrast (WCAG AA compliant)
Screen reader friendly
Responsive Design
Mobile-first approach
Three breakpoints: 360px, 768px, 1024px
Flexbox and CSS Grid layouts
Touch-friendly buttons
Optimized for all devices

 Regex Patterns Catalog
1. Description Validation
Pattern: /^\S(?:.*\S)?$/
Purpose: Ensures no leading or trailing whitespace in descriptions
Examples:
Valid: "Lunch at cafeteria", "Coffee", "Book: Advanced Algebra"
Invalid: " Lunch", "Coffee ", " Book "

2. Amount Validation
Pattern: /^(0|[1-9]\d*)(\.\d{1,2})?$/
Purpose: Validates numeric amounts with optional decimal (up to 2 places)
Examples:
Valid: "0", "12", "12.5", "12.50", "1000", "99.99"
 Invalid: "12.345", "-5", "abc", "12.", ".50"

3. Date Format Validation
Pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
Purpose: Validates YYYY-MM-DD date format
Examples:
Valid: "2025-10-15", "2025-01-01", "2025-12-31"
 Invalid: "2025-13-01", "2025-10-32", "25-10-15", "2025/10/15"

4. Category Validation
Pattern: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
Purpose: Validates category names (letters, spaces, hyphens only)
Examples:
Valid: "Food", "Books", "Health Care", "Extra-Curricular"
 Invalid: "Food123", "Books!", "_Health"

5. Duplicate Word Detection (Advanced)
Pattern: /\b(\w+)\s+\1\b/i
Purpose: Detects consecutive duplicate words using back-reference
Examples:
 Matches: "Coffee coffee", "the the book", "buy buy groceries"
No Match: "Coffee with friends", "Buy groceries"
How it works:
\b - Word boundary
(\w+) - Capture group 1: one or more word characters
\s+ - One or more whitespace
\1 - Back-reference to group 1 (matches the same word)
i flag - Case insensitive

Search Pattern Examples
Users can use these regex patterns in the search box:
Find beverages:
coffee|tea
Matches: "Coffee with friends", "Afternoon tea"
Find amounts with cents:
\.\d{2}\b
Matches: transactions with amounts like 12.50, 8.75
Find items starting with capital letter:
^[A-Z]
Matches: "Lunch", "Bus pass", "Chemistry textbook"
Find duplicate words:
\b(\w+)\s+\1\b
Matches: "Coffee coffee", "the the"
Find specific categories:
^(Food|Entertainment)$
Matches: exactly "Food" or "Entertainment"

 Accessibility Features
Semantic HTML
Proper use of <header>, <nav>, <main>, <section>, <footer>
Heading hierarchy (h1 → h2 → h3)
<table> with <thead>, <tbody>, <th scope="col">
ARIA Implementation
role="status" for status messages
aria-live="polite" for budget updates (under cap)
aria-live="assertive" for budget warnings (over cap)
aria-label on navigation buttons and inputs
aria-describedby linking inputs to error messages
aria-required="true" on required form fields
Keyboard Support
All interactive elements are keyboard accessible
Logical tab order throughout the application
Skip-to-content link for keyboard users
Visible focus indicators (2px outline with offset)
Visual Accessibility
High contrast color scheme (WCAG AA compliant)
Minimum contrast ratio: 4.5:1 for text
Focus indicators with 2px solid outline
Color is not the only indicator of state
Readable font sizes (minimum 14px base)
Screen Reader Support
Descriptive labels on all form inputs
Status messages announced appropriately
Table headers properly associated
Empty states clearly communicated
Error messages clearly announced

Project Structure
finance-tracker/
├── index.html          	# Main HTML file (single-page app)
├── README.md          	# This file
├── seed.json          	# Sample data with 11+ transactions
├── tests.html             # Regex validation tests
├── styles/
│   └── main.css       	# All styles (included in index.html)
├── scripts/
│   └── script.js      	# All JavaScript (included in index.html)
└── assets/
	└── demo-video.mp4 	# Demo video (if applicable)
Note: This is a single-file implementation with embedded CSS and JavaScript for simplicity.

 Installation & Setup
Prerequisites
Modern web browser (Chrome, Firefox, Safari, Edge)
No build tools or dependencies required
Works offline after initial load
Steps
Clone the repository
2.  git clone https://github.com/yourusername/finance-tracker.git
3.  cd finance-tracker
Open in browser
5.  # Option 1: Direct file
6.  open index.html
7.   
8.  # Option 2: Local server (recommended)
9.  python3 -m http.server 8000
10.# Then visit: http://localhost:8000
GitHub Pages Deployment
Push code to GitHub
Go to Settings → Pages
Select branch: main, folder: /root
Save and wait for deployment
Access at: https://yourusername.github.io/finance-tracker

Usage Guide
Adding a Transaction
Navigate to the Add page (Alt + A)
Fill in all required fields:
Description: No leading/trailing spaces
Amount: Numeric value (e.g., 12.50)
Category: Select from dropdown
Date: Format YYYY-MM-DD
Click "Add Transaction"
The success message will appear
Searching Transactions
Go to the Transactions page
Enter the regex pattern in the search box
Toggle case sensitivity if needed
Matches will be highlighted in yellow
Setting Budget Cap
Go to Dashboard
Scroll to the "Budget Cap" section
Enter monthly budget amount
Status will update automatically
Green = under budget, Red = over budget
Exporting/Importing Data
Export:
Go to the Transactions page
Click "Export JSON"
File downloads automatically
Import:
Click "Import JSON"
Select a valid JSON file
Data validates and loads
Currency Conversion
Go to Settings
Update EUR or RWF rates
Click "Save Settings"
Conversions update on dashboard

Testing
Running Tests
Open tests.html in your browser to run regex validation tests.
Manual Testing Checklist
Validation Tests
Description with leading space (should fail)
Description with trailing space (should fail)
 Description with duplicate words (should warn)
 Amount with 3 decimals (should fail)
 Amount with negative value (should fail)
 Invalid date format (should fail)
 Invalid category characters (should fail)
Search Tests
 Search with invalid regex (should show red border)
 Search with a valid pattern (should highlight)
 Case-insensitive toggle (should work)
Search across all fields (should work)
Accessibility Tests
 Tab through entire page (logical order)
 Use only the keyboard to add a transaction
 Use only the keyboard to delete the transaction
 Screen reader announces errors
 Budget alerts announced correctly
Responsive Tests
 Test at 360px width (mobile)
 Test at 768px width (tablet)
 Test at 1024px+ width (desktop)
Charts resize properly
Tables scroll horizontally

Keyboard Navigation Map
Global Shortcuts
Key CombinationActionAlt + DNavigate to DashboardAlt + TNavigate to TransactionsAlt + ANavigate to Add TransactionTabMove to next focusable elementShift + TabMove to previous focusable elementEnter / SpaceActivate buttons and links
Navigation Menu

Use Tab to focus on navigation buttons
Use Enter or Space to activate
Visual focus indicator shows current position

Tables

Tab through sortable column headers
Enter to sort by that column
Tab through action buttons in each row

Forms

Tab through form fields
Shift + Tab to go back
Enter to submit form
Error messages announced to screen readers

Modal/Confirmation Dialogs

Tab to cycle through options
Enter to confirm
Esc to cancel (browser default)

Technologies Used
HTML5: Semantic markup
CSS3: Flexbox, Grid, Custom Properties, Animations
Vanilla JavaScript (ES6+): No frameworks
Chart.js: Data visualization
LocalStorage API: Data persistence
FileReader API: Import functionality
Blob API: Export functionality

 Browser Support
Browser
Version
Status
Chrome
90+
Fully Supported
Firefox
88+
 Fully Supported
Safari
14+
 Fully Supported
Edge
90+
 Fully Supported
Opera
76+
 Fully Supported


 Known Issues
Date Validation: Basic regex doesn't validate actual calendar dates (e.g., Feb 31)
LocalStorage Limit: ~5-10MB storage limit (sufficient for typical use)
Chart.js CDN: Requires an internet connection for initial load

Future Enhancements
Service Worker for offline functionality
CSV export option
Recurring transactions
Category management (add/edit custom categories)
Multi-month comparison charts
Receipt image upload
Tags/labels for transactions
Advanced filtering (date range, amount range)
Budget alerts via notifications

Contact
Developer: Benjamin Niyomurinzi
GitHub: murinziben
Email: b.niyomurin@alustudent.co
 Acknowledgments
Chart.js for a visualization library
MDN Web Docs for regex and accessibility references
WCAG Guidelines for accessibility standards
Course instructors and peers for feedback

 Academic Integrity Statement
This project was completed independently as coursework. All code is original unless otherwise cited. Chart.js library is used under the MIT license. AI tools were used only for documentation and seed data generation, not for code implementation.

Last Updated: October 16, 2025
Version: 1.0.0
 

