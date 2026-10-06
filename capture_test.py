import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"c:\Users\HP\OneDrive\Desktop\Projets\VeriSightNX\screenshots"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1600, "height": 950},
        device_scale_factor=2,
        color_scheme="dark"
    )
    page = context.new_page()

    print("Navigating to http://localhost:3005...")
    page.goto("http://localhost:3005", wait_until="networkidle")
    time.sleep(1.5)

    # Click Quick Demo button
    quick_btn = page.locator("button:has-text('Inject Classified Security Tokens')")
    if quick_btn.count() > 0:
        print("Found quick access button, clicking...")
        quick_btn.click()
        time.sleep(0.5)

        # Click submit button
        submit_btn = page.locator("button[type='submit']")
        print("Clicking submit...")
        submit_btn.click()
        # Wait for biometric scan + transition
        time.sleep(4.5)

    # Wait for dashboard header
    page.wait_for_selector("header", timeout=10000)
    print("Dashboard loaded successfully!")
    
    # Remove any lingering confetti canvas and ensure dark mode
    page.evaluate("""() => {
        document.querySelectorAll('canvas').forEach(c => {
            if (c.style.position === 'fixed' || getComputedStyle(c).position === 'fixed') {
                c.remove();
            }
        });
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    }""")
    time.sleep(2)

    # 1. AI Command Center
    print("Capturing 01_ai_command_center.png...")
    page.screenshot(path=os.path.join(output_dir, "01_ai_command_center.png"))

    # 2. Evidence Vault
    print("Navigating to Evidence Vault...")
    page.locator("button:has-text('Evidence Vault')").click()
    time.sleep(2)
    print("Capturing 02_classified_evidence_vault.png...")
    page.screenshot(path=os.path.join(output_dir, "02_classified_evidence_vault.png"))

    # 3. Fraud Intelligence
    print("Navigating to Fraud Intelligence...")
    page.locator("button:has-text('Fraud Intelligence')").click()
    time.sleep(2)
    print("Capturing 03_fraud_intelligence.png...")
    page.screenshot(path=os.path.join(output_dir, "03_fraud_intelligence.png"))

    # 4. Investigator Map
    print("Navigating to Investigator Map...")
    page.locator("button:has-text('Investigator Map')").click()
    time.sleep(2.5)
    print("Capturing 04_investigator_tactical_map.png...")
    page.screenshot(path=os.path.join(output_dir, "04_investigator_tactical_map.png"))

    browser.close()
    print("All 4 screenshots captured successfully!")
