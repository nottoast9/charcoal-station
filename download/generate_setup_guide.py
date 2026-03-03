from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('SimHei', '/usr/share/fonts/truetype/chinese/SimHei.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    "/home/z/my-project/download/Charcoal_Station_Complete_Setup_Guide.pdf",
    pagesize=A4,
    rightMargin=2*cm,
    leftMargin=2*cm,
    topMargin=2*cm,
    bottomMargin=2*cm,
    title="Charcoal Station Complete Setup Guide",
    author="Z.ai",
    creator="Z.ai",
    subject="Complete setup guide for Charcoal Station Business Manager"
)

# Define styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    name='Title',
    fontName='Times New Roman',
    fontSize=32,
    leading=40,
    alignment=TA_CENTER,
    spaceAfter=20,
    textColor=colors.HexColor('#1F4E79')
)

subtitle_style = ParagraphStyle(
    name='Subtitle',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_CENTER,
    spaceAfter=40,
    textColor=colors.HexColor('#666666')
)

h1_style = ParagraphStyle(
    name='Heading1',
    fontName='Times New Roman',
    fontSize=22,
    leading=28,
    spaceBefore=24,
    spaceAfter=12,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    name='Heading2',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    spaceBefore=18,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

h3_style = ParagraphStyle(
    name='Heading3',
    fontName='Times New Roman',
    fontSize=13,
    leading=18,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#404040')
)

body_style = ParagraphStyle(
    name='BodyText',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceAfter=8
)

bullet_style = ParagraphStyle(
    name='BulletText',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    leftIndent=20,
    spaceAfter=4
)

code_style = ParagraphStyle(
    name='CodeStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    leftIndent=20,
    backColor=colors.HexColor('#F5F5F5'),
    spaceAfter=8
)

note_style = ParagraphStyle(
    name='NoteStyle',
    fontName='Times New Roman',
    fontSize=10,
    leading=14,
    leftIndent=20,
    backColor=colors.HexColor('#FFF3CD'),
    borderPadding=8,
    spaceAfter=12
)

# Table styles
header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    textColor=colors.white,
    alignment=TA_CENTER
)

cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=10,
    alignment=TA_LEFT
)

story = []

# Cover Page
story.append(Spacer(1, 3*cm))
story.append(Paragraph("<b>Charcoal Station</b>", title_style))
story.append(Paragraph("Business Manager", title_style))
story.append(Spacer(1, 1*cm))
story.append(Paragraph("Complete Setup Guide", subtitle_style))
story.append(Spacer(1, 2*cm))
story.append(Paragraph("From GitHub to Vercel to Supabase", subtitle_style))
story.append(Spacer(1, 3*cm))
story.append(Paragraph("A comprehensive guide to deploy and configure your", body_style))
story.append(Paragraph("charcoal business management application", body_style))
story.append(Spacer(1, 4*cm))
story.append(Paragraph("Version 1.0", body_style))
story.append(PageBreak())

# Table of Contents
story.append(Paragraph("<b>Table of Contents</b>", h1_style))
story.append(Spacer(1, 0.5*cm))

toc_data = [
    ["Section", "Page"],
    ["1. Overview", "3"],
    ["2. GitHub Setup", "4"],
    ["3. Supabase Database Setup", "6"],
    ["4. Vercel Deployment", "10"],
    ["5. PWA Builder (Mobile Apps)", "13"],
    ["6. Troubleshooting", "16"],
    ["7. Quick Reference", "18"],
]

toc_table = Table(toc_data, colWidths=[12*cm, 3*cm])
toc_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 11),
    ('ALIGN', (1, 0), (1, -1), 'CENTER'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(toc_table)
story.append(PageBreak())

# Section 1: Overview
story.append(Paragraph("<b>1. Overview</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>What is Charcoal Station Business Manager?</b>", h2_style))
story.append(Paragraph(
    "Charcoal Station Business Manager is a web application designed to help you manage your charcoal business operations. "
    "It provides features for tracking sales, recording expenses, managing products, handling partner profit splits, and viewing "
    "business analytics through an intuitive dashboard. The application uses modern web technologies to provide a responsive, "
    "mobile-friendly experience that works across all devices.",
    body_style
))

story.append(Paragraph("<b>Technology Stack</b>", h2_style))
story.append(Paragraph(
    "The application is built with a modern technology stack designed for reliability, performance, and ease of deployment:",
    body_style
))

tech_data = [
    [Paragraph('<b>Component</b>', header_style), Paragraph('<b>Technology</b>', header_style), Paragraph('<b>Purpose</b>', header_style)],
    [Paragraph('Frontend', cell_style), Paragraph('Next.js 15 + React', cell_style), Paragraph('User interface and application logic', cell_style)],
    [Paragraph('Styling', cell_style), Paragraph('Tailwind CSS + shadcn/ui', cell_style), Paragraph('Responsive design and UI components', cell_style)],
    [Paragraph('Database', cell_style), Paragraph('Supabase (PostgreSQL)', cell_style), Paragraph('Data storage and management', cell_style)],
    [Paragraph('Hosting', cell_style), Paragraph('Vercel', cell_style), Paragraph('Cloud deployment and CDN', cell_style)],
    [Paragraph('Code Storage', cell_style), Paragraph('GitHub', cell_style), Paragraph('Version control and deployment trigger', cell_style)],
    [Paragraph('Mobile Apps', cell_style), Paragraph('PWA Builder', cell_style), Paragraph('Android APK and Windows EXE generation', cell_style)],
]

tech_table = Table(tech_data, colWidths=[3.5*cm, 4.5*cm, 7*cm])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(tech_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Architecture Overview</b>", h2_style))
story.append(Paragraph(
    "The application follows a modern serverless architecture. When you push code to GitHub, Vercel automatically builds and deploys "
    "your application. The application connects to Supabase for all data operations, providing real-time data synchronization and "
    "reliable storage. Users access the application through a web browser, and the same application can be packaged as a mobile app "
    "using PWA Builder for offline-capable native experiences on Android and Windows devices.",
    body_style
))

story.append(Paragraph("<b>Setup Order (Recommended)</b>", h2_style))
story.append(Paragraph(
    "For the best setup experience, follow this order:",
    body_style
))

order_data = [
    [Paragraph('<b>Step</b>', header_style), Paragraph('<b>Action</b>', header_style), Paragraph('<b>Why This Order</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Create GitHub Account', cell_style), Paragraph('Required for code storage and Vercel integration', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Set Up Supabase', cell_style), Paragraph('Database must be ready before deployment', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Deploy to Vercel', cell_style), Paragraph('Connects GitHub and uses Supabase credentials', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Generate Mobile Apps', cell_style), Paragraph('Requires live Vercel URL for PWA Builder', cell_style)],
]

order_table = Table(order_data, colWidths=[1.5*cm, 5*cm, 8.5*cm])
order_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(order_table)
story.append(PageBreak())

# Section 2: GitHub Setup
story.append(Paragraph("<b>2. GitHub Setup</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Why GitHub?</b>", h2_style))
story.append(Paragraph(
    "GitHub serves as the central code repository for your application. It provides version control, collaboration features, and acts "
    "as the trigger for automatic deployments to Vercel. Every time you push changes to GitHub, Vercel automatically rebuilds and "
    "redeploys your application, ensuring your live site is always up to date with your latest code changes.",
    body_style
))

story.append(Paragraph("<b>Step 2.1: Create a GitHub Account</b>", h2_style))
story.append(Paragraph("If you don't already have a GitHub account, follow these steps:", body_style))

story.append(Paragraph("1. Go to <b>https://github.com</b> in your web browser", bullet_style))
story.append(Paragraph("2. Click the <b>Sign up</b> button in the top right corner", bullet_style))
story.append(Paragraph("3. Enter your email address and create a password", bullet_style))
story.append(Paragraph("4. Choose a username (this will be part of your repository URL)", bullet_style))
story.append(Paragraph("5. Complete the verification puzzle and select your preferences", bullet_style))
story.append(Paragraph("6. Verify your email address through the confirmation email", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 2.2: Create a New Repository</b>", h2_style))
story.append(Paragraph("After creating your account, set up a repository for your application:", body_style))

story.append(Paragraph("1. Click the <b>+</b> icon in the top right corner and select <b>New repository</b>", bullet_style))
story.append(Paragraph("2. Enter a repository name (e.g., <b>charcoal-station</b>)", bullet_style))
story.append(Paragraph("3. Add an optional description: 'Charcoal Station Business Manager'", bullet_style))
story.append(Paragraph("4. Choose <b>Private</b> or <b>Public</b> (Public is required for free Vercel tier)", bullet_style))
story.append(Paragraph("5. Check <b>Add a README file</b> to initialize the repository", bullet_style))
story.append(Paragraph("6. Click <b>Create repository</b>", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 2.3: Upload Your Application Code</b>", h2_style))
story.append(Paragraph(
    "You can upload code to GitHub in several ways. The most common method is using Git commands from your local machine. "
    "If you have the application code on your computer, open a terminal in the project directory and run the following commands:",
    body_style
))

story.append(Paragraph("git init", code_style))
story.append(Paragraph("git add .", code_style))
story.append(Paragraph('git commit -m "Initial commit"', code_style))
story.append(Paragraph("git branch -M main", code_style))
story.append(Paragraph("git remote add origin https://github.com/YOUR_USERNAME/charcoal-station.git", code_style))
story.append(Paragraph("git push -u origin main", code_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph(
    "Replace <b>YOUR_USERNAME</b> with your actual GitHub username. After pushing, refresh your GitHub repository page "
    "to see all your files uploaded. Your code is now stored on GitHub and ready for Vercel deployment.",
    body_style
))

story.append(Paragraph("<b>Important: Repository Information to Remember</b>", h2_style))
story.append(Paragraph(
    "As you proceed with setup, you'll need these pieces of information from your GitHub account:",
    body_style
))

info_data = [
    [Paragraph('<b>Information</b>', header_style), Paragraph('<b>Example</b>', header_style), Paragraph('<b>Where to Find</b>', header_style)],
    [Paragraph('GitHub Username', cell_style), Paragraph('johndoe', cell_style), Paragraph('Your profile page or repository URL', cell_style)],
    [Paragraph('Repository Name', cell_style), Paragraph('charcoal-station', cell_style), Paragraph('The name you chose when creating the repo', cell_style)],
    [Paragraph('Repository URL', cell_style), Paragraph('https://github.com/johndoe/charcoal-station', cell_style), Paragraph('Your repository page URL', cell_style)],
    [Paragraph('Default Branch', cell_style), Paragraph('main', cell_style), Paragraph('Branch dropdown in repository', cell_style)],
]

info_table = Table(info_data, colWidths=[4*cm, 5.5*cm, 5.5*cm])
info_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(info_table)
story.append(PageBreak())

# Section 3: Supabase Setup
story.append(Paragraph("<b>3. Supabase Database Setup</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Why Supabase?</b>", h2_style))
story.append(Paragraph(
    "Supabase is an open-source alternative to Firebase that provides a PostgreSQL database with a user-friendly interface. "
    "It offers real-time data synchronization, row-level security, automatic API generation, and a generous free tier that is "
    "perfect for small businesses. Your application stores all its data in Supabase, including products, sales, expenses, partners, "
    "and profit splits. This ensures your data is secure, backed up, and accessible from anywhere.",
    body_style
))

story.append(Paragraph("<b>Step 3.1: Create a Supabase Account</b>", h2_style))
story.append(Paragraph("1. Go to <b>https://supabase.com</b> in your web browser", bullet_style))
story.append(Paragraph("2. Click <b>Start your project</b>", bullet_style))
story.append(Paragraph("3. Sign in with GitHub (recommended) or create an account with email", bullet_style))
story.append(Paragraph("4. Authorize Supabase to access your GitHub if prompted", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 3.2: Create a New Project</b>", h2_style))
story.append(Paragraph("1. Click <b>New Project</b> on your Supabase dashboard", bullet_style))
story.append(Paragraph("2. Fill in the project details:", bullet_style))
story.append(Paragraph("   - <b>Name:</b> charcoal-station (or your preferred name)", bullet_style))
story.append(Paragraph("   - <b>Database Password:</b> Create a strong password (save this securely!)", bullet_style))
story.append(Paragraph("   - <b>Region:</b> Choose the region closest to your location for best performance", bullet_style))
story.append(Paragraph("3. Click <b>Create new project</b>", bullet_style))
story.append(Paragraph("4. Wait 1-2 minutes for the project to be provisioned", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 3.3: Get Your API Credentials</b>", h2_style))
story.append(Paragraph(
    "You need two pieces of information to connect your application to Supabase. These credentials allow your application "
    "to authenticate with the database and perform read/write operations:",
    body_style
))

story.append(Paragraph("1. In your Supabase dashboard, click the <b>Settings</b> gear icon (left sidebar)", bullet_style))
story.append(Paragraph("2. Click <b>API</b> in the settings menu", bullet_style))
story.append(Paragraph("3. Under <b>Project URL</b>, copy the URL (looks like: https://xxxxx.supabase.co)", bullet_style))
story.append(Paragraph("4. Under <b>Project API keys</b>, copy the <b>anon public</b> key (starts with eyJ...)", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph(
    "<b>Important:</b> The anon public key is safe to use in your frontend application. Never expose your service_role key, "
    "which has full admin access to your database.",
    note_style
))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 3.4: Set Up the Database Schema</b>", h2_style))
story.append(Paragraph(
    "Your application needs specific database tables to store products, sales, expenses, partners, and profit splits. "
    "Run the provided SQL migration to create all necessary tables, indexes, and security policies:",
    body_style
))

story.append(Paragraph("1. In Supabase dashboard, click <b>SQL Editor</b> (left sidebar)", bullet_style))
story.append(Paragraph("2. Click <b>New query</b> to create a new SQL script", bullet_style))
story.append(Paragraph("3. Open the file <b>supabase/migration.sql</b> from your project", bullet_style))
story.append(Paragraph("4. Copy the entire contents of the file", bullet_style))
story.append(Paragraph("5. Paste into the SQL Editor", bullet_style))
story.append(Paragraph("6. Click <b>Run</b> (or press Ctrl+Enter)", bullet_style))
story.append(Paragraph("7. You should see 'Success. No rows returned' - this is expected!", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Database Tables Created</b>", h2_style))
story.append(Paragraph(
    "The migration creates the following tables with proper relationships and indexes:",
    body_style
))

tables_data = [
    [Paragraph('<b>Table</b>', header_style), Paragraph('<b>Purpose</b>', header_style), Paragraph('<b>ID Format</b>', header_style)],
    [Paragraph('products', cell_style), Paragraph('Product names and prices', cell_style), Paragraph('PRD-00001', cell_style)],
    [Paragraph('product_price_history', cell_style), Paragraph('Track price changes over time', cell_style), Paragraph('PHS-00001', cell_style)],
    [Paragraph('expense_types', cell_style), Paragraph('Categories for expenses', cell_style), Paragraph('EXT-00001', cell_style)],
    [Paragraph('sales', cell_style), Paragraph('Sales transactions', cell_style), Paragraph('SAL-00001', cell_style)],
    [Paragraph('expenses', cell_style), Paragraph('Expense records', cell_style), Paragraph('EXP-00001', cell_style)],
    [Paragraph('partners', cell_style), Paragraph('Business partners', cell_style), Paragraph('PTR-00001', cell_style)],
    [Paragraph('profit_splits', cell_style), Paragraph('Monthly profit distributions', cell_style), Paragraph('PFS-00001', cell_style)],
    [Paragraph('partner_splits', cell_style), Paragraph('Individual partner shares', cell_style), Paragraph('(auto-generated)', cell_style)],
]

tables_table = Table(tables_data, colWidths=[4*cm, 6*cm, 5*cm])
tables_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(tables_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Step 3.5: Verify Database Setup</b>", h2_style))
story.append(Paragraph(
    "To confirm your database is properly configured, use the Table Editor in Supabase:",
    body_style
))

story.append(Paragraph("1. Click <b>Table Editor</b> in the left sidebar", bullet_style))
story.append(Paragraph("2. You should see all 8 tables listed in the sidebar", bullet_style))
story.append(Paragraph("3. Click on the <b>id_sequences</b> table to verify it has 7 rows", bullet_style))
story.append(Paragraph("4. Each row represents an ID prefix (PRD, SAL, EXP, etc.) for generating readable IDs", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 3.6: Credentials Summary</b>", h2_style))
story.append(Paragraph(
    "After completing Supabase setup, you should have these credentials saved:",
    body_style
))

cred_data = [
    [Paragraph('<b>Credential</b>', header_style), Paragraph('<b>Example Format</b>', header_style)],
    [Paragraph('NEXT_PUBLIC_SUPABASE_URL', cell_style), Paragraph('https://abcdefghijklmnop.supabase.co', cell_style)],
    [Paragraph('NEXT_PUBLIC_SUPABASE_ANON_KEY', cell_style), Paragraph('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', cell_style)],
]

cred_table = Table(cred_data, colWidths=[6*cm, 9*cm])
cred_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(cred_table)
story.append(PageBreak())

# Section 4: Vercel Deployment
story.append(Paragraph("<b>4. Vercel Deployment</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Why Vercel?</b>", h2_style))
story.append(Paragraph(
    "Vercel is a cloud platform designed for frontend frameworks like Next.js. It provides automatic deployments from GitHub, "
    "global CDN distribution for fast loading, automatic HTTPS, and a generous free tier. When you push code to GitHub, Vercel "
    "automatically builds and deploys your application within seconds, ensuring your live site always reflects your latest changes.",
    body_style
))

story.append(Paragraph("<b>Step 4.1: Create a Vercel Account</b>", h2_style))
story.append(Paragraph("1. Go to <b>https://vercel.com</b> in your web browser", bullet_style))
story.append(Paragraph("2. Click <b>Sign Up</b>", bullet_style))
story.append(Paragraph("3. Choose <b>Continue with GitHub</b> (recommended for easy integration)", bullet_style))
story.append(Paragraph("4. Authorize Vercel to access your GitHub repositories", bullet_style))
story.append(Paragraph("5. Complete any additional verification steps", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 4.2: Import Your GitHub Repository</b>", h2_style))
story.append(Paragraph("1. After signing in, click <b>Add New...</b> and select <b>Project</b>", bullet_style))
story.append(Paragraph("2. You'll see a list of your GitHub repositories", bullet_style))
story.append(Paragraph("3. Find <b>charcoal-station</b> (or your repository name)", bullet_style))
story.append(Paragraph("4. Click <b>Import</b> next to the repository", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 4.3: Configure the Project</b>", h2_style))
story.append(Paragraph(
    "Before deploying, configure the project settings:",
    body_style
))

story.append(Paragraph("1. <b>Project Name:</b> charcoal-station-manager (or your preferred name)", bullet_style))
story.append(Paragraph("2. <b>Framework Preset:</b> Vercel should auto-detect Next.js", bullet_style))
story.append(Paragraph("3. <b>Root Directory:</b> Leave as ./ (default)", bullet_style))
story.append(Paragraph("4. <b>Build Command:</b> Leave default (next build)", bullet_style))
story.append(Paragraph("5. <b>Output Directory:</b> Leave default (.next)", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 4.4: Add Environment Variables</b>", h2_style))
story.append(Paragraph(
    "This is a critical step. Your application needs the Supabase credentials to connect to the database:",
    body_style
))

story.append(Paragraph("1. Expand the <b>Environment Variables</b> section", bullet_style))
story.append(Paragraph("2. Add the first variable:", bullet_style))
story.append(Paragraph("   - <b>Name:</b> NEXT_PUBLIC_SUPABASE_URL", bullet_style))
story.append(Paragraph("   - <b>Value:</b> Your Supabase project URL (from Step 3.3)", bullet_style))
story.append(Paragraph("3. Click <b>Add</b> to add another variable", bullet_style))
story.append(Paragraph("4. Add the second variable:", bullet_style))
story.append(Paragraph("   - <b>Name:</b> NEXT_PUBLIC_SUPABASE_ANON_KEY", bullet_style))
story.append(Paragraph("   - <b>Value:</b> Your Supabase anon public key (from Step 3.3)", bullet_style))
story.append(Paragraph("5. Ensure both variables have all environments checked (Production, Preview, Development)", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph(
    "<b>Important:</b> Environment variable names are case-sensitive. Make sure you type them exactly as shown, "
    "including the NEXT_PUBLIC_ prefix which makes the variables accessible in the browser.",
    note_style
))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 4.5: Deploy</b>", h2_style))
story.append(Paragraph("1. Click <b>Deploy</b> to start the deployment", bullet_style))
story.append(Paragraph("2. Wait 1-3 minutes for the build to complete", bullet_style))
story.append(Paragraph("3. You'll see build logs showing the progress", bullet_style))
story.append(Paragraph("4. When complete, you'll see a celebration animation and success message", bullet_style))
story.append(Paragraph("5. Click <b>Continue to Dashboard</b>", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 4.6: Get Your Deployment URL</b>", h2_style))
story.append(Paragraph(
    "Vercel provides two types of URLs for your application:",
    body_style
))

url_data = [
    [Paragraph('<b>URL Type</b>', header_style), Paragraph('<b>Format</b>', header_style), Paragraph('<b>Use For</b>', header_style)],
    [Paragraph('Production Domain', cell_style), Paragraph('charcoal-station-manager.vercel.app', cell_style), Paragraph('Main URL - use this for PWA Builder', cell_style)],
    [Paragraph('Deployment URL', cell_style), Paragraph('charcoal-station-manager-abc123.vercel.app', cell_style), Paragraph('Preview URLs - changes each deploy', cell_style)],
]

url_table = Table(url_data, colWidths=[4*cm, 6*cm, 5*cm])
url_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(url_table)
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph(
    "Use the <b>Production Domain</b> (without random characters) for PWA Builder and sharing with users. "
    "This URL remains consistent across deployments.",
    body_style
))

story.append(Paragraph("<b>Step 4.7: Verify Deployment</b>", h2_style))
story.append(Paragraph("1. Click the production URL to open your application", bullet_style))
story.append(Paragraph("2. You should see the Charcoal Station Business Manager interface", bullet_style))
story.append(Paragraph("3. Try adding a test product to verify database connection", bullet_style))
story.append(Paragraph("4. Check Supabase Table Editor to see the product was created", bullet_style))
story.append(Paragraph("5. If successful, delete the test product and your deployment is complete!", bullet_style))
story.append(PageBreak())

# Section 5: PWA Builder
story.append(Paragraph("<b>5. PWA Builder (Mobile Apps)</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>What is PWA Builder?</b>", h2_style))
story.append(Paragraph(
    "PWA Builder is a Microsoft tool that converts Progressive Web Apps into native application packages. This allows you to "
    "distribute your web application as a standalone app on Android (APK) and Windows (MSIX) without going through app stores. "
    "Users can install these packages directly on their devices, providing an app-like experience with offline capabilities.",
    body_style
))

story.append(Paragraph("<b>Prerequisites</b>", h2_style))
story.append(Paragraph("Before using PWA Builder, ensure:", body_style))
story.append(Paragraph("1. Your application is deployed and accessible via HTTPS URL (Vercel provides this)", bullet_style))
story.append(Paragraph("2. Your application has a valid manifest.json (already included in your project)", bullet_style))
story.append(Paragraph("3. Your application has a service worker for offline support (enabled via next-pwa)", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 5.1: Access PWA Builder</b>", h2_style))
story.append(Paragraph("1. Go to <b>https://www.pwabuilder.com/</b> in your web browser", bullet_style))
story.append(Paragraph("2. You'll see a text box asking for your PWA URL", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 5.2: Enter Your Application URL</b>", h2_style))
story.append(Paragraph("1. Enter your Vercel production URL: <b>https://your-app-name.vercel.app</b>", bullet_style))
story.append(Paragraph("2. Click <b>Start</b> to analyze your PWA", bullet_style))
story.append(Paragraph("3. PWA Builder will check your manifest, service worker, and HTTPS", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 5.3: Review the Manifest Report</b>", h2_style))
story.append(Paragraph(
    "PWA Builder displays a report card showing your PWA compliance. A score of 100 indicates your app is fully ready:",
    body_style
))

manifest_data = [
    [Paragraph('<b>Requirement</b>', header_style), Paragraph('<b>Status</b>', header_style), Paragraph('<b>Notes</b>', header_style)],
    [Paragraph('Manifest', cell_style), Paragraph('Required', cell_style), Paragraph('Should show green checkmark', cell_style)],
    [Paragraph('Service Worker', cell_style), Paragraph('Required', cell_style), Paragraph('Enabled via next-pwa package', cell_style)],
    [Paragraph('HTTPS', cell_style), Paragraph('Required', cell_style), Paragraph('Provided by Vercel', cell_style)],
    [Paragraph('Icons', cell_style), Paragraph('Required', cell_style), Paragraph('192x192 and 512x512 PNG files', cell_style)],
    [Paragraph('Screenshots', cell_style), Paragraph('Optional', cell_style), Paragraph('For store listings only', cell_style)],
]

manifest_table = Table(manifest_data, colWidths=[4*cm, 3*cm, 8*cm])
manifest_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(manifest_table)
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 5.4: Generate Windows Package (MSIX)</b>", h2_style))
story.append(Paragraph("1. Click the <b>Windows</b> tab or icon", bullet_style))
story.append(Paragraph("2. Click <b>Options</b> to customize if needed (optional)", bullet_style))
story.append(Paragraph("3. Click <b>Download</b> or <b>Generate</b>", bullet_style))
story.append(Paragraph("4. Wait for the package to be generated (1-2 minutes)", bullet_style))
story.append(Paragraph("5. Download the MSIX file", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Installing Windows MSIX (For Users)</b>", h3_style))
story.append(Paragraph("To install the Windows package on a user's computer:", body_style))
story.append(Paragraph("1. Download the MSIX file to the Windows computer", bullet_style))
story.append(Paragraph("2. Right-click the file and select <b>Properties</b>", bullet_style))
story.append(Paragraph("3. Check <b>Unblock</b> at the bottom (if present) and click OK", bullet_style))
story.append(Paragraph("4. Double-click the MSIX file", bullet_style))
story.append(Paragraph("5. Click <b>Install</b> in the installer window", bullet_style))
story.append(Paragraph("6. The app will appear in Start Menu and can be pinned to taskbar", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Step 5.5: Generate Android Package (APK)</b>", h2_style))
story.append(Paragraph("1. Click the <b>Android</b> tab or icon", bullet_style))
story.append(Paragraph("2. Select <b>APK</b> (for direct install) or <b>AAB</b> (for Play Store)", bullet_style))
story.append(Paragraph("3. Click <b>Options</b> to customize if needed:", bullet_style))
story.append(Paragraph("   - <b>App Name:</b> Charcoal Station Business Manager", bullet_style))
story.append(Paragraph("   - <b>Package ID:</b> com.charcoalstation.businessmanager", bullet_style))
story.append(Paragraph("   - <b>Signing Key:</b> Create new or upload existing", bullet_style))
story.append(Paragraph("4. Click <b>Download</b> or <b>Generate</b>", bullet_style))
story.append(Paragraph("5. Wait for the package to be generated (2-5 minutes)", bullet_style))
story.append(Paragraph("6. Download the APK file", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Installing Android APK (For Users)</b>", h3_style))
story.append(Paragraph("To install the APK on an Android device:", body_style))
story.append(Paragraph("1. Transfer the APK file to the Android device (USB, email, cloud storage)", bullet_style))
story.append(Paragraph("2. Open <b>Settings</b> on the Android device", bullet_style))
story.append(Paragraph("3. Go to <b>Security</b> or <b>Apps</b>", bullet_style))
story.append(Paragraph("4. Enable <b>Install unknown apps</b> or <b>Unknown sources</b>", bullet_style))
story.append(Paragraph("5. Open a file manager app and locate the APK", bullet_style))
story.append(Paragraph("6. Tap the APK file and select <b>Install</b>", bullet_style))
story.append(Paragraph("7. After installation, the app appears in the app drawer", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Alternative: Install as PWA from Browser</b>", h2_style))
story.append(Paragraph(
    "Users can also install your app directly from their browser without downloading any files:",
    body_style
))

story.append(Paragraph("<b>On Android (Chrome):</b>", h3_style))
story.append(Paragraph("1. Open your Vercel URL in Chrome", bullet_style))
story.append(Paragraph("2. Tap the three-dot menu in the top right", bullet_style))
story.append(Paragraph("3. Tap <b>Add to Home screen</b> or <b>Install app</b>", bullet_style))
story.append(Paragraph("4. Confirm by tapping <b>Install</b>", bullet_style))
story.append(Paragraph("5. The app icon appears on the home screen", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>On Windows (Edge/Chrome):</b>", h3_style))
story.append(Paragraph("1. Open your Vercel URL in Edge or Chrome", bullet_style))
story.append(Paragraph("2. Look for the install icon in the address bar (a plus sign or computer icon)", bullet_style))
story.append(Paragraph("3. Click <b>Install</b> in the prompt", bullet_style))
story.append(Paragraph("4. The app installs and appears in Start Menu", bullet_style))
story.append(PageBreak())

# Section 6: Troubleshooting
story.append(Paragraph("<b>6. Troubleshooting</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Deployment Issues</b>", h2_style))

story.append(Paragraph("<b>Problem: Build fails on Vercel</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>Missing dependencies:</b> Check package.json for all required packages", bullet_style))
story.append(Paragraph("- <b>TypeScript errors:</b> Run 'bun run lint' locally to find issues", bullet_style))
story.append(Paragraph("- <b>Environment variables:</b> Verify all env vars are set in Vercel dashboard", bullet_style))
story.append(Paragraph("- <b>Memory limit:</b> Large apps may need increased memory in vercel.json", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Problem: Application shows blank page</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>JavaScript error:</b> Open browser console (F12) and check for errors", bullet_style))
story.append(Paragraph("- <b>Missing env vars:</b> Verify Supabase credentials in Vercel", bullet_style))
story.append(Paragraph("- <b>Wrong API URL:</b> Check that fetch calls use relative paths ('/api/...')", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Database Issues</b>", h2_style))

story.append(Paragraph("<b>Problem: Failed to fetch products/sales</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>Invalid credentials:</b> Re-copy Supabase URL and key from dashboard", bullet_style))
story.append(Paragraph("- <b>RLS policies missing:</b> Re-run the migration SQL in Supabase", bullet_style))
story.append(Paragraph("- <b>CORS issues:</b> Supabase handles this automatically; check URL format", bullet_style))
story.append(Paragraph("- <b>Network issue:</b> Verify internet connectivity and Supabase status", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Problem: Permission denied errors</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>RLS not configured:</b> Run the full migration SQL script", bullet_style))
story.append(Paragraph("- <b>Wrong API key:</b> Use 'anon public' key, not 'service_role' key", bullet_style))
story.append(Paragraph("- <b>Policies too restrictive:</b> Check policies in Supabase Authentication section", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Problem: Database not saving data</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>Tables missing:</b> Run migration SQL to create all tables", bullet_style))
story.append(Paragraph("- <b>Constraint violation:</b> Check for duplicate IDs or foreign key issues", bullet_style))
story.append(Paragraph("- <b>Data type mismatch:</b> Ensure correct types (number vs string)", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>PWA Builder Issues</b>", h2_style))

story.append(Paragraph("<b>Problem: PWA Builder shows low score</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>Missing manifest:</b> Verify /manifest.json is accessible", bullet_style))
story.append(Paragraph("- <b>No service worker:</b> Build with 'bun run build' first (creates sw.js)", bullet_style))
story.append(Paragraph("- <b>Missing icons:</b> Ensure icon-192.png and icon-512.png exist", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Problem: Windows app won't install</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", body_style))
story.append(Paragraph("- <b>Windows Defender blocking:</b> Add exclusion or disable temporarily", bullet_style))
story.append(Paragraph("- <b>Not unblocked:</b> Right-click file, Properties, check Unblock", bullet_style))
story.append(Paragraph("- <b>Certificate issue:</b> Accept the security prompt during install", bullet_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Problem: Android app won't install</b>", h3_style))
story.append(Paragraph("Possible causes and solutions:", bullet_style))
story.append(Paragraph("- <b>Unknown sources disabled:</b> Enable in Android Security settings", bullet_style))
story.append(Paragraph("- <b>Corrupt APK:</b> Re-download the APK file", bullet_style))
story.append(Paragraph("- <b>Incompatible architecture:</b> Use the universal APK option", bullet_style))
story.append(PageBreak())

# Section 7: Quick Reference
story.append(Paragraph("<b>7. Quick Reference</b>", h1_style))
story.append(Spacer(1, 0.3*cm))

story.append(Paragraph("<b>Environment Variables</b>", h2_style))

env_data = [
    [Paragraph('<b>Variable Name</b>', header_style), Paragraph('<b>Where to Get</b>', header_style), Paragraph('<b>Example</b>', header_style)],
    [Paragraph('NEXT_PUBLIC_SUPABASE_URL', cell_style), Paragraph('Supabase Dashboard > Settings > API', cell_style), Paragraph('https://abc123.supabase.co', cell_style)],
    [Paragraph('NEXT_PUBLIC_SUPABASE_ANON_KEY', cell_style), Paragraph('Supabase Dashboard > Settings > API', cell_style), Paragraph('eyJhbGciOiJI...', cell_style)],
]

env_table = Table(env_data, colWidths=[5.5*cm, 5.5*cm, 4*cm])
env_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(env_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Important URLs</b>", h2_style))

url_ref_data = [
    [Paragraph('<b>Service</b>', header_style), Paragraph('<b>URL</b>', header_style)],
    [Paragraph('GitHub', cell_style), Paragraph('https://github.com', cell_style)],
    [Paragraph('Supabase', cell_style), Paragraph('https://supabase.com', cell_style)],
    [Paragraph('Vercel', cell_style), Paragraph('https://vercel.com', cell_style)],
    [Paragraph('PWA Builder', cell_style), Paragraph('https://pwabuilder.com', cell_style)],
]

url_ref_table = Table(url_ref_data, colWidths=[4*cm, 11*cm])
url_ref_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(url_ref_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Setup Checklist</b>", h2_style))

checklist_data = [
    [Paragraph('<b>Step</b>', header_style), Paragraph('<b>Task</b>', header_style), Paragraph('<b>Status</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Create GitHub account', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Create GitHub repository', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Push code to GitHub', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Create Supabase account', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Create Supabase project', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('6', cell_style), Paragraph('Run database migration SQL', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('7', cell_style), Paragraph('Copy Supabase credentials', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('8', cell_style), Paragraph('Create Vercel account', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('9', cell_style), Paragraph('Import GitHub repository to Vercel', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('10', cell_style), Paragraph('Add environment variables in Vercel', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('11', cell_style), Paragraph('Deploy to Vercel', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('12', cell_style), Paragraph('Test application functionality', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('13', cell_style), Paragraph('Generate Windows MSIX via PWA Builder', cell_style), Paragraph('[ ]', cell_style)],
    [Paragraph('14', cell_style), Paragraph('Generate Android APK via PWA Builder', cell_style), Paragraph('[ ]', cell_style)],
]

checklist_table = Table(checklist_data, colWidths=[1.5*cm, 10*cm, 3.5*cm])
checklist_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ('ALIGN', (2, 0), (2, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
story.append(checklist_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph("<b>Getting Help</b>", h2_style))
story.append(Paragraph("If you encounter issues not covered in this guide:", body_style))
story.append(Paragraph("- <b>GitHub Docs:</b> https://docs.github.com", bullet_style))
story.append(Paragraph("- <b>Supabase Docs:</b> https://supabase.com/docs", bullet_style))
story.append(Paragraph("- <b>Vercel Docs:</b> https://vercel.com/docs", bullet_style))
story.append(Paragraph("- <b>PWA Builder Docs:</b> https://docs.pwabuilder.com", bullet_style))
story.append(Paragraph("- <b>Next.js Docs:</b> https://nextjs.org/docs", bullet_style))

# Build PDF
doc.build(story)
print("PDF generated successfully!")
