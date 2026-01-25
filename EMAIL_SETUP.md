# 📧 Email Automation Setup Guide (EmailJS)

Follow these 5 simple steps to enable real email delivery for your Policy Agent.

## Step 1: Create Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and Sign Up (it's free).
2. Once logged in, you will be on the Dashboard.

## Step 2: Create Email Service
1. Click on the **"Email Services"** tab (left sidebar).
2. Click **"Add New Service"**.
3. Select **"Gmail"** (or your preferred provider).
4. Click **"Connect Account"** and log in with the email account that you want to send emails *FROM*.
5. Click **"Create Service"**.
6. **Copy the "Service ID"** (e.g., `service_abc123`). You will need this later.

## Step 3: Create Email Template
1. Click on the **"Email Templates"** tab.
2. Click **"Create New Template"**.
3. In the **Subject** line, write something like:
   `New Policy Application: {{policy_name}} - {{to_name}}`
4. In the **Content** body, design your email. **Crucial:** Use the exact variable names below so the form data appears correctly:
   ```html
   <h2>New Application Received</h2>
   <p><strong>Applicant:</strong> {{to_name}}</p>
   <p><strong>Policy:</strong> {{policy_name}} ({{provider}})</p>
   <p><strong>Coverage:</strong> {{coverage}}</p>
   <hr>
   <h3>Full Details:</h3>
   <pre>{{applicant_details}}</pre>
   ```
5. Click **"Save"**.
6. **Copy the "Template ID"** (e.g., `template_xyz789`).

## Step 4: Get Public Key
1. Click on your name/avatar in the top-right corner -> **"Account"**.
2. Look for **"Public Key"**.
3. **Copy it** (e.g., `user_12345abcdef`).

## Step 5: Connect to Code
1. Open the file `src/Components/ApplicationFormModal.jsx` in VS Code.
2. Scroll to **Line 73** (inside `handleSubmit`).
3. Replace the placeholder strings with your copied keys:

```javascript
// BEFORE
const SERVICE_ID = 'service_placeholder';
const TEMPLATE_ID = 'template_placeholder';
const PUBLIC_KEY = 'public_key_placeholder';

// AFTER (Example)
const SERVICE_ID = 'service_8fd7s6';
const TEMPLATE_ID = 'template_9s8d7f';
const PUBLIC_KEY = 'vK_s9d8f7s9d8f';
```

## ✅ Done!
Go to your Policy Page, click **Apply Now**, and the email will be sent instantly to your inbox!
