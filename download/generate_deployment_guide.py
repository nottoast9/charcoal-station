from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
output_path = '/home/z/my-project/download/Charcoal_Station_Deployment_Guide.pdf'
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    title='Charcoal Station Deployment Guide',
    author='Z.ai',
    creator='Z.ai',
    subject='Deployment guide for Charcoal Station Business Manager on GitHub and Vercel'
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='TitleStyle',
    fontName='Times New Roman',
    fontSize=28,
    leading=34,
    alignment=TA_CENTER,
    spaceAfter=24
)

subtitle_style = ParagraphStyle(
    name='SubtitleStyle',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#666666'),
    spaceAfter=36
)

heading1_style = ParagraphStyle(
    name='Heading1Style',
    fontName='Times New Roman',
    fontSize=18,
    leading=24,
    spaceBefore=18,
    spaceAfter=12,
    textColor=colors.HexColor('#1F4E79')
)

heading2_style = ParagraphStyle(
    name='Heading2Style',
    fontName='Times New Roman',
    fontSize=14,
    leading=18,
    spaceBefore=12,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceAfter=8
)

code_style = ParagraphStyle(
    name='CodeStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    leftIndent=20,
    backColor=colors.HexColor('#F5F5F5'),
    borderColor=colors.HexColor('#E0E0E0'),
    borderWidth=1,
    borderPadding=8,
    spaceAfter=12
)

note_style = ParagraphStyle(
    name='NoteStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    leftIndent=20,
    textColor=colors.HexColor('#666666'),
    spaceAfter=12
)

story = []

# Cover Page
story.append(Spacer(1, 120))
story.append(Paragraph('<b>Charcoal Station Business Manager</b>', title_style))
story.append(Paragraph('Deployment Guide', subtitle_style))
story.append(Spacer(1, 48))
story.append(Paragraph('Complete Guide for Deploying to GitHub and Vercel', 
    ParagraphStyle(name='CenterText', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)))
story.append(Spacer(1, 24))
story.append(Paragraph('Version 1.0 | March 2025', 
    ParagraphStyle(name='CenterText2', fontName='Times New Roman', fontSize=12, alignment=TA_CENTER, textColor=colors.HexColor('#888888'))))
story.append(PageBreak())

# Table of Contents
story.append(Paragraph('<b>Table of Contents</b>', heading1_style))
story.append(Spacer(1, 12))

toc_items = [
    ('1. Overview', 3),
    ('2. Prerequisites', 3),
    ('3. GitHub Repository Setup', 4),
    ('4. Vercel Deployment', 5),
    ('5. Data Storage with GitHub', 7),
    ('6. Environment Configuration', 8),
    ('7. Testing Your Deployment', 8),
    ('8. Future: APK and EXE Conversion', 9),
    ('9. Troubleshooting', 10),
]

for item, page in toc_items:
    story.append(Paragraph(f'{item} {"." * 60} {page}', 
        ParagraphStyle(name='TOCItem', fontName='Times New Roman', fontSize=11, leading=18)))
story.append(PageBreak())

# Section 1: Overview
story.append(Paragraph('<b>1. Overview</b>', heading1_style))
story.append(Paragraph(
    'The Charcoal Station Business Manager is a comprehensive web application designed for managing '
    'the daily operations of a charcoal station business. This application enables you to track sales, '
    'expenses, and profit splits while providing real-time dashboard analytics and CSV export functionality. '
    'The application is built using Next.js 15 with the App Router architecture, providing a modern, '
    'responsive, and performant user experience that works seamlessly across desktop and mobile devices.',
    body_style))
story.append(Spacer(1, 8))
story.append(Paragraph('<b>Key Features:</b>', heading2_style))
story.append(Paragraph('Interactive Dashboard with Monthly Charts - Visualize your business performance with '
    'comprehensive charts showing sales trends, income patterns, expense breakdowns, and profit margins over time.', body_style))
story.append(Paragraph('Product Management with Price History - Add and manage products with full price tracking, '
    'ensuring historical sales data remains accurate even when prices change.', body_style))
story.append(Paragraph('Expense Tracking by Category - Categorize and monitor all business expenses with '
    'customizable expense types for detailed financial analysis.', body_style))
story.append(Paragraph('Profit Split Recording - Automatically calculate and record profit distributions '
    'for any given month with full audit trail.', body_style))
story.append(Paragraph('CSV Data Export - Export all business data in CSV format for backup, '
    'analysis in spreadsheet software, or migration purposes.', body_style))
story.append(PageBreak())

# Section 2: Prerequisites
story.append(Paragraph('<b>2. Prerequisites</b>', heading1_style))
story.append(Paragraph('Before beginning the deployment process, ensure you have the following accounts and tools:', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Required Accounts:</b>', heading2_style))
story.append(Paragraph('1. GitHub Account (github.com) - Free tier is sufficient. This will host your source code '
    'and CSV data files, enabling version control and collaboration.', body_style))
story.append(Paragraph('2. Vercel Account (vercel.com) - Free tier is sufficient. Vercel provides seamless '
    'deployment and hosting for Next.js applications with automatic HTTPS and global CDN.', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Required Tools:</b>', heading2_style))
story.append(Paragraph('1. Git - Version control system for pushing code to GitHub. Download from git-scm.com.', body_style))
story.append(Paragraph('2. Node.js 18 or higher - JavaScript runtime environment required for Next.js. '
    'Download from nodejs.org.', body_style))
story.append(Paragraph('3. A code editor (VS Code recommended) - For making any modifications to the codebase.', body_style))
story.append(PageBreak())

# Section 3: GitHub Repository Setup
story.append(Paragraph('<b>3. GitHub Repository Setup</b>', heading1_style))
story.append(Paragraph('<b>Step 3.1: Create a New Repository</b>', heading2_style))
story.append(Paragraph('1. Navigate to github.com and log into your account.', body_style))
story.append(Paragraph('2. Click the "+" icon in the top right corner and select "New repository".', body_style))
story.append(Paragraph('3. Enter a repository name such as "charcoal-station-manager".', body_style))
story.append(Paragraph('4. Choose "Private" if you want to restrict access to your business data, or "Public" '
    'if you want to share the code.', body_style))
story.append(Paragraph('5. Do not initialize with README, .gitignore, or license (we will push existing code).', body_style))
story.append(Paragraph('6. Click "Create repository".', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Step 3.2: Initialize Git and Push Code</b>', heading2_style))
story.append(Paragraph('Open a terminal or command prompt in your project directory and run the following commands:', body_style))
story.append(Spacer(1, 8))
story.append(Paragraph('git init', code_style))
story.append(Paragraph('git add .', code_style))
story.append(Paragraph('git commit -m "Initial commit: Charcoal Station Business Manager"', code_style))
story.append(Paragraph('git branch -M main', code_style))
story.append(Paragraph('git remote add origin https://github.com/YOUR_USERNAME/charcoal-station-manager.git', code_style))
story.append(Paragraph('git push -u origin main', code_style))
story.append(Spacer(1, 8))
story.append(Paragraph('Replace YOUR_USERNAME with your actual GitHub username. After executing these commands, '
    'your code will be pushed to GitHub and available in your repository.', body_style))
story.append(PageBreak())

# Section 4: Vercel Deployment
story.append(Paragraph('<b>4. Vercel Deployment</b>', heading1_style))
story.append(Paragraph('<b>Step 4.1: Connect Vercel to GitHub</b>', heading2_style))
story.append(Paragraph('1. Navigate to vercel.com and sign up or log in using your GitHub account for the '
    'easiest integration experience.', body_style))
story.append(Paragraph('2. Once logged in, click "Add New..." then "Project" from the dashboard.', body_style))
story.append(Paragraph('3. If prompted, authorize Vercel to access your GitHub repositories.', body_style))
story.append(Paragraph('4. Select "Import Git Repository" and choose your charcoal-station-manager repository '
    'from the list.', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Step 4.2: Configure Project Settings</b>', heading2_style))
story.append(Paragraph('1. Framework Preset: Vercel should automatically detect "Next.js". If not, select it manually.', body_style))
story.append(Paragraph('2. Root Directory: Leave as "./" (default).', body_style))
story.append(Paragraph('3. Build Command: Leave as default (next build).', body_style))
story.append(Paragraph('4. Output Directory: Leave as default (.next).', body_style))
story.append(Paragraph('5. Install Command: Leave as default (npm install or bun install).', body_style))
story.append(Spacer(1, 8))
story.append(Paragraph('6. Environment Variables: No environment variables are required for basic functionality. '
    'The application uses local CSV file storage for data persistence.', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Step 4.3: Deploy</b>', heading2_style))
story.append(Paragraph('1. Click "Deploy" to start the deployment process.', body_style))
story.append(Paragraph('2. Wait for the build to complete (typically 2-5 minutes).', body_style))
story.append(Paragraph('3. Once complete, Vercel will provide you with a URL such as '
    'https://charcoal-station-manager.vercel.app', body_style))
story.append(Paragraph('4. Click the URL to view your deployed application.', body_style))
story.append(PageBreak())

story.append(Paragraph('<b>Step 4.4: Custom Domain (Optional)</b>', heading2_style))
story.append(Paragraph('To use a custom domain for your application:', body_style))
story.append(Paragraph('1. Go to your project settings in Vercel dashboard.', body_style))
story.append(Paragraph('2. Navigate to "Domains" and add your custom domain.', body_style))
story.append(Paragraph('3. Follow Vercel instructions to configure DNS records with your domain registrar.', body_style))
story.append(Paragraph('4. Vercel will automatically provision SSL certificates for HTTPS security.', body_style))
story.append(PageBreak())

# Section 5: Data Storage with GitHub
story.append(Paragraph('<b>5. Data Storage with GitHub</b>', heading1_style))
story.append(Paragraph('The application stores all business data in CSV files located in the /data directory. '
    'This approach provides several advantages including human-readable format, easy backup, and direct '
    'editing capabilities using any spreadsheet software or text editor.', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Data Files Structure:</b>', heading2_style))
story.append(Paragraph('products.csv - Contains product information including name, price, and status', body_style))
story.append(Paragraph('product_price_history.csv - Records all price changes with timestamps', body_style))
story.append(Paragraph('expense_types.csv - Defines expense categories for your business', body_style))
story.append(Paragraph('sales.csv - Records all sales transactions with product details', body_style))
story.append(Paragraph('expenses.csv - Records all expense transactions with categories', body_style))
story.append(Paragraph('profit_splits.csv - Records profit distribution events', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Important Notes on Data Persistence:</b>', heading2_style))
story.append(Paragraph('When deploying to Vercel, the file system is ephemeral, meaning any changes made through '
    'the application will be lost when the deployment is refreshed or a new version is deployed. For persistent '
    'data storage in production, you have several options:', body_style))
story.append(Spacer(1, 8))
story.append(Paragraph('Option 1: Manual CSV Sync - Export data regularly using the Export CSV button. '
    'Manually update the CSV files in your GitHub repository when needed.', body_style))
story.append(Paragraph('Option 2: Database Migration - Migrate to a database like PostgreSQL or MongoDB for '
    'true persistent storage. This is recommended for production use.', body_style))
story.append(Paragraph('Option 3: GitHub API Integration - Implement GitHub API to commit changes directly '
    'to your repository, enabling true persistence with version control.', body_style))
story.append(PageBreak())

# Section 6: Environment Configuration
story.append(Paragraph('<b>6. Environment Configuration</b>', heading1_style))
story.append(Paragraph('The application is designed to work out of the box without any environment configuration. '
    'However, if you plan to extend the application, you may need to configure the following:', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Optional Environment Variables:</b>', heading2_style))
story.append(Paragraph('NEXT_PUBLIC_APP_NAME - Custom application name displayed in the header', body_style))
story.append(Paragraph('NEXT_PUBLIC_CURRENCY - Currency code for formatting (default: USD)', body_style))
story.append(Paragraph('DATABASE_URL - Connection string if migrating to PostgreSQL', body_style))
story.append(Paragraph('To add environment variables in Vercel, go to Project Settings, then Environment Variables, '
    'and add your key-value pairs. Changes will take effect on the next deployment.', body_style))
story.append(PageBreak())

# Section 7: Testing Your Deployment
story.append(Paragraph('<b>7. Testing Your Deployment</b>', heading1_style))
story.append(Paragraph('After deployment, test the following features to ensure everything is working correctly:', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Basic Functionality Tests:</b>', heading2_style))
story.append(Paragraph('1. Dashboard - Verify all charts load and display correctly. The dashboard should show '
    'summary statistics and trend charts.', body_style))
story.append(Paragraph('2. Products Tab - Add a new product and verify it appears in the list. Edit the price '
    'and check the price history.', body_style))
story.append(Paragraph('3. Expense Types Tab - Add a new expense category and verify it can be selected when '
    'adding expenses.', body_style))
story.append(Paragraph('4. Sales Tab - Record a new sale and verify the transaction appears in the history table. '
    'Check that the total amount is calculated correctly.', body_style))
story.append(Paragraph('5. Expenses Tab - Record a new expense and verify it appears in the history. Check that '
    'the expense type is displayed correctly.', body_style))
story.append(Paragraph('6. Profit Split Tab - Attempt to split profit for a month and verify the calculation is correct.', body_style))
story.append(Paragraph('7. Export CSV - Click the Export CSV button in the header and verify a file downloads '
    'with all your data.', body_style))
story.append(PageBreak())

# Section 8: Future: APK and EXE Conversion
story.append(Paragraph('<b>8. Future: APK and EXE Conversion</b>', heading1_style))
story.append(Paragraph('While the current deployment provides a web-based application accessible from any browser, '
    'you may want to create native applications for Android (APK) and Windows (EXE). Here is an overview of the '
    'options available for converting your web application to native apps:', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>For Android (APK):</b>', heading2_style))
story.append(Paragraph('Option 1: Progressive Web App (PWA) - Add PWA support to your Next.js application. '
    'Users can install the app directly from their browser, creating a native-like experience without '
    'the need for app store distribution.', body_style))
story.append(Paragraph('Option 2: Capacitor - Use Ionic Capacitor to wrap your web application in a native '
    'Android container. This provides access to native device features while keeping your web codebase.', body_style))
story.append(Paragraph('Option 3: React Native - Rewrite the application using React Native for a truly '
    'native mobile experience with better performance and native UI components.', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>For Windows (EXE):</b>', heading2_style))
story.append(Paragraph('Option 1: Electron - Package your Next.js application using Electron to create a '
    'standalone Windows desktop application. This is ideal for offline usage and provides native desktop integration.', body_style))
story.append(Paragraph('Option 2: Tauri - A lighter alternative to Electron using Rust. Provides smaller '
    'bundle sizes and better performance while still delivering a native desktop experience.', body_style))
story.append(Paragraph('Option 3: PWA - Windows 10 and 11 support PWAs, allowing users to install your web '
    'app directly from the browser as a standalone application.', body_style))
story.append(PageBreak())

# Section 9: Troubleshooting
story.append(Paragraph('<b>9. Troubleshooting</b>', heading1_style))
story.append(Paragraph('<b>Common Issues and Solutions:</b>', heading2_style))
story.append(Spacer(1, 8))

story.append(Paragraph('Build Fails on Vercel:', body_style))
story.append(Paragraph('Check that your package.json includes all necessary dependencies. Ensure Node.js version '
    'in Vercel project settings matches your development environment (18.x or higher). Review the build logs '
    'for specific error messages and address accordingly.', note_style))
story.append(Spacer(1, 8))

story.append(Paragraph('Data Not Persisting:', body_style))
story.append(Paragraph('This is expected behavior on Vercel free tier. The file system is reset on each deployment. '
    'For persistent data, consider migrating to a database or implementing GitHub API integration for data storage.', note_style))
story.append(Spacer(1, 8))

story.append(Paragraph('Charts Not Displaying:', body_style))
story.append(Paragraph('Ensure the Recharts library is properly installed. Check browser console for JavaScript '
    'errors. Verify that data is being returned from the API endpoints correctly.', note_style))
story.append(Spacer(1, 8))

story.append(Paragraph('Slow Loading Times:', body_style))
story.append(Paragraph('Vercel provides global CDN which should ensure fast loading. If slow, check for large '
    'dependencies, optimize images, and consider implementing data pagination for large datasets.', note_style))
story.append(Spacer(1, 8))

story.append(Paragraph('CORS Errors:', body_style))
story.append(Paragraph('This application uses Next.js API routes which should not cause CORS issues. If accessing '
    'external APIs, ensure proper CORS headers are configured in your API routes.', note_style))

# Build PDF
doc.build(story)
print(f"PDF generated: {output_path}")
