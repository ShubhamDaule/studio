# MySpendWise AI Analyzer

This is a Next.js starter project for an AI-powered financial analytics dashboard. It allows users to upload PDF bank or credit card statements, extracts transaction data using a generative AI model, and provides interactive charts and insights to help users understand their spending habits.

## Core Technologies

- **Frontend**: Next.js, React, TypeScript
- **UI**: ShadCN UI, Tailwind CSS, Recharts
- **AI/Backend**: Genkit (with Google's Gemini models)
- **Authentication**: Firebase Auth

## Getting Started: Running Locally

To run this project on your local machine, follow these steps:

### 1. Prerequisites

-   Node.js (v18 or later recommended)
-   npm (or your preferred package manager)

### 2. Set Up Environment Variables

You'll need a Google AI API key to use the generative AI features.

1.  Create a copy of the environment variable template file:
    ```bash
    cp .env .env.local
    ```
2.  Open the newly created `.env.local` file and add your Google AI API key:
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

### 3. Install Dependencies

Install the necessary project dependencies using npm:
```bash
npm install
```

### 4. Run the Development Server

Start the Next.js development server with Turbopack:
```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

## Project Flow: From Upload to Dashboard

The data processing pipeline is designed to be transparent and give the user control over the data sent to the AI. Here is a step-by-step breakdown of the flow:

### 1. File Selection (Client-Side)

-   **Action**: The user clicks the "Upload" button in the header.
-   **File**: `src/components/layout/header.tsx`
-   **Logic**: The `handleFileUpload` function is triggered. It reads the PDF file(s) selected by the user from their local machine into an `ArrayBuffer` (a raw binary data format).

### 2. Initial Text Extraction & Pre-Analysis (Client & Server)

-   **Action**: The application needs to understand basic details about the statement (like the bank and date range) and estimate the AI processing cost *before* asking the user to confirm.
-   **Files**: `header.tsx` → `actions.ts` → `extract-transactions.ts`
-   **Logic**:
    1.  The `handleFileUpload` function uses the `pdfjs-dist` library to convert the *entire* PDF into raw text directly in the user's browser.
    2.  This raw text is sent to a server action called `preAnalyzeTransactions` with a special `skipAi: true` flag.
    3.  This action calls the `extractTransactions` flow, which runs a non-AI function (`detectBankAndStatementType`) to quickly find the bank name, statement type, and date range from the text. It also calculates an estimated token cost for the full AI analysis. This information is sent back to the client.

### 3. Confirmation & Page Editing (Client-Side)

-   **Action**: The application displays a confirmation dialog where the user can review files, see the estimated token cost, and edit the pages to be analyzed.
-   **Files**: `upload-confirmation-dialog.tsx` → `pdf-edit-dialog.tsx`
-   **Logic**:
    1.  The `UploadConfirmationDialog` lists each file with its detected details and token cost.
    2.  If the user clicks "Edit", the `PdfEditDialog` opens.
    3.  The user can deselect pages they wish to exclude. When "Apply Changes" is clicked, the dialog uses the `pdf-lib` library to create a **new, smaller PDF in memory** containing only the pages the user kept.
    4.  **Crucially, it then re-runs the text extraction (`pdfjs-dist`) on this new PDF.** The resulting text and a recalculated token cost are updated for that file.

### 4. Final AI Extraction (Client & Server)

-   **Action**: The user clicks the "Process File(s)" button to start the main AI analysis.
-   **Files**: `header.tsx` → `actions.ts` → `extract-transactions.ts`
-   **Logic**:
    1.  The `handleConfirmUpload` function sends the final text for each file (which contains text from only the selected pages) back to the `preAnalyzeTransactions` server action, this time *without* the `skipAi` flag.
    2.  The `extractTransactions` flow now performs its main task: it pre-processes the text to remove unnecessary headers/footers and sends this cleaned text to the Google AI model with a detailed prompt, instructing it to extract transactions into a structured JSON format.

### 5. Debug & Display (Client-Side)

-   **Action**: The AI returns its raw JSON output, which is first shown to the user for review before being added to the dashboard.
-   **Files**: `raw-json-dialog.tsx` → `dashboard-context.tsx`
-   **Logic**:
    1.  The raw JSON from the AI and the processed text that was sent to it are displayed in the `RawJsonDialog` for debugging and transparency.
    2.  When the user clicks "Continue to Dashboard," the `addUploadedTransactions` function in the `DashboardContext` is called.
    3.  This function validates the AI-generated data, adds the new transactions to the application's state, clears any mock data, and updates the date range filter. The dashboard then re-renders to show the new data.
