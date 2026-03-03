from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
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
output_path = '/home/z/my-project/download/Charcoal_Station_Deployment_Guide_v2.pdf'
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    title='Charcoal Station Deployment Guide v2',
    author='Z.ai',
    creator='Z.ai',
    subject='Deployment guide with GitHub API integration for persistent CSV storage'
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
story.append(Spacer(1, 100))
story.append(Paragraph('<b>Charcoal Station Business Manager</b>', title_style))
story.append(Paragraph('Deployment Guide with GitHub Integration', subtitle_style))
story.append(Spacer(1, 48))
story.append(Paragraph('Persistent CSV Storage via GitHub API', 
    ParagraphStyle(name='CenterText', fontName='Times New Roman', fontSize=14, alignment=TA_CENTER)))
story.append(Spacer(1, 24))
story.append(Paragraph('Version 2.0 | March 2025', 
    ParagraphStyle(name='CenterText2', fontName='Times New Roman', fontSize=12, alignment=TA_CENTER, textColor=colors.HexColor('#888888'))))
story.append(PageBreak())

# Section 1: Overview
story.append(Paragraph('<b>1. Overview</b>', heading1_style))
story.append(Paragraph(
    'The Charcoal Station Business Manager now includes GitHub API integration for persistent data storage. '
    'All changes made through the application are automatically committed to your GitHub repository, ensuring '
    'data persists across deployments. This guide will walk you through the complete setup process.',
    body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Key Features of GitHub Integration:</b>', heading2_style))
story.append(Paragraph('Automatic Data Sync - All data changes are immediately committed to your GitHub repository, '
    'creating a complete audit trail with commit messages describing each change.', body_style))
story.append(Paragraph('Manual CSV Editing - You can edit CSV files directly in GitHub and changes will appear in the app '
    'on the next data refresh.', body_style))
story.append(Paragraph('Version History - Every change is tracked in Git history, allowing you to recover previous data states.', body_style))
story.append(Paragraph('No Database Required - Your GitHub repository serves as the database, eliminating the need for '
    'external database services.', body_style))
story.append(PageBreak())

# Section 2: Prerequisites
story.append(Paragraph('<b>2. Prerequisites</b>', heading1_style))
story.append(Paragraph('<b>Required Accounts:</b>', heading2_style))
story.append(Paragraph('1. GitHub Account (github.com) - Will host your code and data', body_style))
story.append(Paragraph('2. Vercel Account (vercel.com) - Will host your live application', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Required Tools:</b>', heading2_style))
story.append(Paragraph('1. Git - Version control system', body_style))
story.append(Paragraph('2. Node.js 18+ - JavaScript runtime', body_style))
story.append(PageBreak())

# Section 3: GitHub Setup
story.append(Paragraph('<b>3. GitHub Repository Setup</b>', heading1_style))
story.append(Paragraph('<b>Step 3.1: Create Repository</b>', heading2_style))
story.append(Paragraph('1. Go to github.com and create a new repository named "charcoal-station-manager"', body_style))
story.append(Paragraph('2. Choose Public or Private based on your preference', body_style))
story.append(Paragraph('3. Do not initialize with README', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Step 3.2: Create GitHub Personal Access Token</b>', heading2_style))
story.append(Paragraph('1. Go to github.com Settings > Developer settings > Personal access tokens > Tokens (classic)', body_style))
story.append(Paragraph('2. Click "Generate new token (classic)"', body_style))
story.append(Paragraph('3. Give it a name like "Charcoal Station App"', body_style))
story.append(Paragraph('4. Select the following scopes: repo (full control of private repositories)', body_style))
story.append(Paragraph('5. Click "Generate token" and COPY IT IMMEDIATELY - you won\'t see it again!', body_style))
story.append(PageBreak())

# Section 4: Push Code to GitHub
story.append(Paragraph('<b>4. Push Code to GitHub</b>', heading1_style))
story.append(Paragraph('Run the following commands in your project directory:', body_style))
story.append(Spacer(1, 8))
story.append(Paragraph('git init', code_style))
story.append(Paragraph('git add .', code_style))
story.append(Paragraph('git commit -m "Initial commit: Charcoal Station Business Manager"', code_style))
story.append(Paragraph('git branch -M main', code_style))
story.append(Paragraph('git remote add origin https://github.com/YOUR_USERNAME/charcoal-station-manager.git', code_style))
story.append(Paragraph('git push -u origin main', code_style))
story.append(Spacer(1, 8))
story.append(Paragraph('Replace YOUR_USERNAME with your actual GitHub username.', body_style))
story.append(PageBreak())

# Section 5: Vercel Deployment
story.append(Paragraph('<b>5. Vercel Deployment</b>', heading1_style))
story.append(Paragraph('<b>Step 5.1: Connect Vercel to GitHub</b>', heading2_style))
story.append(Paragraph('1. Go to vercel.com and sign up using your GitHub account', body_style))
story.append(Paragraph('2. Click "Add New Project" and import your charcoal-station-manager repository', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Step 5.2: Configure Environment Variables (CRITICAL)</b>', heading2_style))
story.append(Paragraph('Before deploying, you MUST add the following environment variables:', body_style))
story.append(Spacer(1, 8))

# Environment variables table
header_style = ParagraphStyle(name='TableHeader', fontName='Times New Roman', fontSize=10, textColor=colors.white, alignment=TA_CENTER)
cell_style = ParagraphStyle(name='TableCell', fontName='Times New Roman', fontSize=9, textColor=colors.black, alignment=TA_LEFT)

env_data = [
    [Paragraph('<b>Variable</b>', header_style), Paragraph('<b>Example Value</b>', header_style), Paragraph('<b>Description</b>', header_style)],
    [Paragraph('GITHUB_TOKEN', cell_style), Paragraph('ghp_xxxxxxxxxxxx', cell_style), Paragraph('Your GitHub Personal Access Token', cell_style)],
    [Paragraph('GITHUB_REPO', cell_style), Paragraph('johndoe/charcoal-station-manager', cell_style), Paragraph('Your repository in owner/repo format', cell_style)],
    [Paragraph('GITHUB_BRANCH', cell_style), Paragraph('main', cell_style), Paragraph('Branch to use (default: main)', cell_style)],
    [Paragraph('GITHUB_DATA_PATH', cell_style), Paragraph('data', cell_style), Paragraph('Folder path for CSV files (default: data)', cell_style)],
]

env_table = Table(env_data, colWidths=[1.5*inch, 2*inch, 3*inch])
env_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(env_table)
story.append(Spacer(1, 12))

story.append(Paragraph('To add environment variables in Vercel:', body_style))
story.append(Paragraph('1. In the project configuration page, scroll to "Environment Variables"', body_style))
story.append(Paragraph('2. Add each variable with its value', body_style))
story.append(Paragraph('3. Make sure to add them for all environments (Production, Preview, Development)', body_style))
story.append(PageBreak())

story.append(Paragraph('<b>Step 5.3: Deploy</b>', heading2_style))
story.append(Paragraph('1. Click "Deploy" to start the deployment', body_style))
story.append(Paragraph('2. Wait for the build to complete (2-5 minutes)', body_style))
story.append(Paragraph('3. Your app will be live at https://your-project.vercel.app', body_style))
story.append(PageBreak())

# Section 6: How Data Works
story.append(Paragraph('<b>6. How Data Persistence Works</b>', heading1_style))
story.append(Paragraph('<b>Data Flow:</b>', heading2_style))
story.append(Paragraph('When you make changes in the app (add sale, add expense, etc.):', body_style))
story.append(Paragraph('1. The app calls the Vercel API', body_style))
story.append(Paragraph('2. The API uses GitHub API to read the current CSV file', body_style))
story.append(Paragraph('3. The new data is appended to the CSV', body_style))
story.append(Paragraph('4. GitHub API commits the change with a descriptive message', body_style))
story.append(Paragraph('5. Your GitHub repository is updated instantly!', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Manual CSV Editing:</b>', heading2_style))
story.append(Paragraph('You can also edit CSV files directly in GitHub:', body_style))
story.append(Paragraph('1. Navigate to the data/ folder in your GitHub repository', body_style))
story.append(Paragraph('2. Click on any CSV file', body_style))
story.append(Paragraph('3. Click the pencil icon to edit', body_style))
story.append(Paragraph('4. Make your changes and commit', body_style))
story.append(Paragraph('5. Refresh your app - changes will appear immediately!', body_style))
story.append(PageBreak())

# Section 7: Testing
story.append(Paragraph('<b>7. Testing Your Deployment</b>', heading1_style))
story.append(Paragraph('<b>Step 7.1: Check Storage Status</b>', heading2_style))
story.append(Paragraph('Visit https://your-app.vercel.app/api/status to check if GitHub integration is working.', body_style))
story.append(Paragraph('You should see: "storageMode": "github" and "configured": true', body_style))
story.append(Spacer(1, 12))

story.append(Paragraph('<b>Step 7.2: Test Data Persistence</b>', heading2_style))
story.append(Paragraph('1. Add a new product in the app', body_style))
story.append(Paragraph('2. Go to your GitHub repository > data folder > products.csv', body_style))
story.append(Paragraph('3. You should see your new product as a new row!', body_style))
story.append(Paragraph('4. Check the commit history - you\'ll see the commit with message "Add new product: [name]"', body_style))
story.append(PageBreak())

# Section 8: Troubleshooting
story.append(Paragraph('<b>8. Troubleshooting</b>', heading1_style))
story.append(Paragraph('<b>Storage Mode Shows "local" instead of "github":</b>', heading2_style))
story.append(Paragraph('Check that GITHUB_TOKEN and GITHUB_REPO environment variables are set correctly in Vercel. '
    'Make sure there are no extra spaces or quotes around the values.', note_style))
story.append(Spacer(1, 8))

story.append(Paragraph('<b>API Errors (401, 403, 404):</b>', heading2_style))
story.append(Paragraph('401 Unauthorized: Your GITHUB_TOKEN is invalid or expired. Generate a new token.', note_style))
story.append(Paragraph('403 Forbidden: Your token doesn\'t have the "repo" scope. Regenerate with correct permissions.', note_style))
story.append(Paragraph('404 Not Found: Your GITHUB_REPO path is incorrect. Use format: owner/repo', note_style))
story.append(Spacer(1, 8))

story.append(Paragraph('<b>Data Not Updating:</b>', heading2_style))
story.append(Paragraph('The app has a 30-second cache. Wait or refresh. Check browser console for errors. '
    'Verify GitHub API rate limits haven\'t been exceeded.', note_style))
story.append(PageBreak())

# Section 9: Summary
story.append(Paragraph('<b>9. Quick Reference</b>', heading1_style))

summary_data = [
    [Paragraph('<b>Step</b>', header_style), Paragraph('<b>Action</b>', header_style)],
    [Paragraph('1', cell_style), Paragraph('Create GitHub repository', cell_style)],
    [Paragraph('2', cell_style), Paragraph('Generate GitHub Personal Access Token with "repo" scope', cell_style)],
    [Paragraph('3', cell_style), Paragraph('Push code to GitHub', cell_style)],
    [Paragraph('4', cell_style), Paragraph('Create Vercel project and import repository', cell_style)],
    [Paragraph('5', cell_style), Paragraph('Add GITHUB_TOKEN and GITHUB_REPO environment variables', cell_style)],
    [Paragraph('6', cell_style), Paragraph('Deploy and test!', cell_style)],
]

summary_table = Table(summary_data, colWidths=[1*inch, 5.5*inch])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
story.append(summary_table)

# Build PDF
doc.build(story)
print(f"PDF generated: {output_path}")
