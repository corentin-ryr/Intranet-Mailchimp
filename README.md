# Faster Email Campaigns *using Mailchimp API*

The goal of this project is to take advantage of the Mailchimp API to send quickly custom HTML-emails to a professional mailing-list.
As the mail we are sending are all using the same template, and as the only difference between them is the content of the sections, we are creating a website allowing users to write the text of these sections.
Then, the node.js backend creates the HTML content of the email from the content written, and creates a Mailchimp campaign.
Finally, a test email is sent to auditors for review.
