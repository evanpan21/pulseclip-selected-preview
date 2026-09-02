# PulseClip Wix Setup

## Recommended production structure

Use this package as the visual body of the page, then place a native Wix Form over the hero form position and another instance in the final waitlist section. Both forms should submit to the same Wix form schema so every valid email appears in one Wix Contacts list.

## Wix Form schema

1. Confirm Wix Forms is installed for the site.
2. Create a form named `PulseClip Waitlist` in namespace `wix.form_app.form`.
3. Add one required input field:
   - `identifier`: `CONTACTS_EMAIL`
   - `inputType`: `STRING`
   - `format`: `EMAIL`
   - label: `Email address`
4. Add the standard `SUBMIT_BUTTON` display field with the label `Join the waitlist`.
5. Enable advanced spam protection.
6. Configure `postSubmissionTriggers.upsertContact` with the email target mapped to `{ "contactField": "EMAIL" }`.
7. Use a thank-you message only after Wix confirms the submission: `You are on the PulseClip list.`

## Required contact behavior

The field target used by the email input must be the same key used in `upsertContact.fieldsMapping`. Each submission must create or update a Wix Contact rather than only storing a detached form response.

## Verification

1. Publish or preview the Wix page with the native form connected.
2. Submit one unique test email that you control.
3. Open Wix Dashboard → Forms & Submissions and confirm the new submission is present.
4. Open Wix Dashboard → Contacts and confirm the same email exists as a contact.
5. Remove the test contact after verification if it should not remain in the launch list.

Dashboard form path: `https://manage.wix.com/dashboard/{siteId}/forms`

## Local preview behavior

The included HTML forms intentionally have a blank `data-endpoint`. Until the native Wix form or a Wix-backed endpoint is connected, they validate the address but display `This preview is not collecting emails yet.` and never show a false success message.
