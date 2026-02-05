# SentinAI V1 - Beginner's Run Guide

This guide contains exact **Copy & Paste** commands to run the SentinAI project on Windows (PowerShell).

## Prerequisites
- **Google Chrome** installed.
- **Python 3.10+** (provided via the `pokemon` virtual environment).

---

## Part 1: Start the Backend Logic
The backend must be running for SentinAI to fully analyze pages. It uses the **pokemon** virtual environment.

1. Open **VS Code**.
2. Open a **New Terminal** (`Ctrl` + `Shift` + `Backtick`).
3. **Copy and Paste** the following block into the terminal and press **Enter**:

```powershell
# 1. Go to the backend folder
cd "d:\SentinAI\backend"

# 2. Run the SentinAI server using the 'pokemon' environment
..\pokemon\Scripts\python -m uvicorn app.main:app --port 8000 --reload
```

> **Success?** You should see lines like: `Uvicorn running on http://127.0.0.1:8000`
>
> **Keep this terminal OPEN.** Do not close it.

---

## Part 2: Load the Chrome Extension

1. Open **Google Chrome**.
2. In the address bar, paste this URL and press Enter:
   `chrome://extensions/`
3. Look at the **top right corner**. Turn the **Developer mode** toggle **ON**.
4. Click the **Load unpacked** button (it appears on the top left).
5. A folder selection window will open.
   - Navigate to `D:` drive.
   - Open `SentinAI` folder.
   - Select the `extension` folder.
   - Click **Select Folder**.

> **Success?** You will see a new card called **"SentinAI - Scam & Risk Detector"** in your list.

---

## Part 3: How to Test
Now that both parts are running, let's see it in action.

### Test 1: Real Website
1. Go to any normal website (news, blog, etc.).
2. Click the **SentinAI Shield Icon** in your Chrome extensions bar.
3. It should show a **Low Risk** status.

### Test 2: Scam Simulation
To see a High Risk warning, we need a page with scam words.

1. Create a new file on your Desktop named `scam_test.html`.
2. Paste this text into it and save:
   ```html
   <h1>Urgent Account Notice</h1>
   <p>Your account is locked. Call +1-555-0199 immediately.</p>
   ```
3. Drag and drop this file into a Chrome tab.
4. Click the SentinAI Shield Icon.
5. **Result**: Shows a **High Risk** or **Medium Risk** warning and explains why (urgency, phone scam language).

### Note: Limited Protection Mode
If the backend terminal is closed or not running:
- The extension works in **Limited Protection Mode**.
- It uses basic offline rules (built into the extension).
- It will **not** show High Risk warnings (only Medium or Low).
- You will see a note: *"Limited protection mode (Backend unavailable)"*.
