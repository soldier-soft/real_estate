<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------------- Logger ----------------
function log_line(string $msg): void {
    $dir = __DIR__ . '/logs';
    if (!is_dir($dir)) @mkdir($dir, 0777, true);
    @file_put_contents($dir.'/app.log', '['.date('Y-m-d H:i:s')."] $msg\n", FILE_APPEND);
}

require_once __DIR__ . '/env.php';

if (!function_exists('env_get')) {
    function env_get($key, $default) {
        $val = getenv($key);
        return ($val !== false && $val !== '') ? $val : $default;
    }
}

// ---------------- Credentials ----------------
if (!defined('MAIL_FROM')) define('MAIL_FROM', env_get('EMAIL_FROM', 'zitersempire004@gmail.com'));
if (!defined('MAIL_FROM_NAME')) define('MAIL_FROM_NAME', env_get('EMAIL_FROM_NAME', 'Sri Chakra Real Estate'));
if (!defined('MAIL_USERNAME')) define('MAIL_USERNAME', env_get('EMAIL_USER', 'zitersempire004@gmail.com'));
if (!defined('MAIL_PASSWORD')) define('MAIL_PASSWORD', env_get('EMAIL_PASS', 'ghgfegnkttsobcev'));
if (!defined('SMTP_HOST')) define('SMTP_HOST', env_get('SMTP_HOST', 'smtp.gmail.com'));
if (!defined('SMTP_PORT')) define('SMTP_PORT', (int)env_get('SMTP_PORT', 587));
if (!defined('SMTP_SECURE')) define('SMTP_SECURE', env_get('SMTP_SECURE', 'tls'));

if (!defined('WHATSAPP_ACCESS_TOKEN')) define('WHATSAPP_ACCESS_TOKEN', env_get('WHATSAPP_ACCESS_TOKEN', ''));
if (!defined('WHATSAPP_PHONE_NUMBER_ID')) define('WHATSAPP_PHONE_NUMBER_ID', env_get('WHATSAPP_PHONE_NUMBER_ID', ''));

if (!defined('OWNER_EMAIL')) define('OWNER_EMAIL', env_get('OWNER_EMAIL', 'info@srichakrarealestate.in,gmuruganpoigai@gmail.com'));
if (!defined('OWNER_PHONE')) define('OWNER_PHONE', env_get('OWNER_PHONE', '916381373309'));

// ---------------- Debug Log (Password masked) ----------------
log_line("INIT: SMTP_HOST=" . SMTP_HOST . ", PORT=" . SMTP_PORT . ", SECURE=" . SMTP_SECURE . ", USER=" . MAIL_USERNAME . ", FROM=" . MAIL_FROM . ", OWNER_EMAILS=" . OWNER_EMAIL);

// ---------------- Send WhatsApp ----------------
function sendWhatsAppMessage(string $to, string $message): bool {
    $token   = WHATSAPP_ACCESS_TOKEN;
    $phoneId = WHATSAPP_PHONE_NUMBER_ID;

    if (!$token || !$phoneId) {
        log_line("WA skipped: missing token or phone ID");
        return false;
    }

    $to = preg_replace('/\D/', '', $to);
    if ($to === "") {
        log_line("WA skipped: invalid recipient number");
        return false;
    }

    $url = "https://graph.facebook.com/v19.0/$phoneId/messages";
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "text",
        "text" => ["body" => $message]
    ];

    $options = [
        "http" => [
            "header" => "Authorization: Bearer $token\r\nContent-Type: application/json\r\n",
            "method" => "POST",
            "content" => json_encode($data),
            "timeout" => 10
        ]
    ];

    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);

    if ($result === false) {
        $err = error_get_last();
        log_line("WA send error to $to: ".($err['message'] ?? 'unknown'));
        return false;
    }

    log_line("WA sent successfully to $to: $result");
    return true;
}

// ---------------- Send Email ----------------
function sendEmail($to, string $subject, string $body, ?string $replyTo = null, ?string $replyToName = null, bool $isHtml = true): bool {
    $recipients = is_array($to) ? $to : array_filter(array_map('trim', explode(',', $to)));
    if (empty($recipients)) {
        log_line("⚠️ sendEmail error: empty recipient list");
        return false;
    }

    $validRecipients = [];
    foreach ($recipients as $recipient) {
        if (filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            $validRecipients[] = $recipient;
        } else {
            log_line("⚠️ Invalid email skipped: $recipient");
        }
    }

    if (empty($validRecipients)) {
        return false;
    }

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = MAIL_USERNAME;
        $mail->Password   = MAIL_PASSWORD;
        
        // Gmail SSL on 465 or TLS on 587
        if (strtolower(SMTP_SECURE) === "ssl" || SMTP_PORT === 465) {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }
        $mail->Port       = SMTP_PORT;
        $mail->Timeout    = 15;
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        $mail->CharSet    = 'UTF-8';
        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        
        foreach ($validRecipients as $recipient) {
            $mail->addAddress($recipient);
        }

        if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($replyTo, $replyToName ?: $replyTo);
        } else {
            $mail->addReplyTo('info@srichakrarealestate.in', 'Sri Chakra Real Estate');
        }

        $mail->isHTML($isHtml);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>', '</div>'], "\n", $body));

        $mail->send();
        log_line("✅ Email sent successfully to " . implode(', ', $validRecipients) . ": $subject");
        return true;
    } catch (Exception $e) {
        log_line("❌ Email error to " . implode(', ', $validRecipients) . ": " . $mail->ErrorInfo);
        return false;
    }

    return $allSuccess;
}

// ---------------- HTML Email Templates ----------------
function generateOwnerLeadHtml(array $data, string $formType): string {
    $clientName    = htmlspecialchars($data['name'] ?? 'N/A');
    $clientPhone   = htmlspecialchars($data['phone'] ?? 'N/A');
    $clientEmail   = htmlspecialchars($data['email'] ?? 'Not Provided');
    $cleanPhone    = preg_replace('/\D/', '', $clientPhone);
    $waPhone       = strlen($cleanPhone) === 10 ? '91' . $cleanPhone : $cleanPhone;
    
    $propertyTitle = htmlspecialchars($data['property_title'] ?? ($data['propertyTitle'] ?? ''));
    $propertyId    = htmlspecialchars($data['property_id'] ?? ($data['propertyId'] ?? ''));
    $interest      = htmlspecialchars($data['interest'] ?? '');
    $budget        = htmlspecialchars($data['budget'] ?? '');
    $location      = htmlspecialchars($data['location'] ?? '');
    $date          = htmlspecialchars($data['date'] ?? '');
    $time          = htmlspecialchars($data['time'] ?? '');
    $message       = htmlspecialchars($data['message'] ?? '');
    $reason        = htmlspecialchars($data['reason'] ?? '');
    $dateTime      = date('d M Y, h:i A T');

    $html = '
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Lead - Sri Chakra Real Estate</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
        .content { padding: 30px; }
        .section-title { font-size: 14px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px; }
        table.lead-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        table.lead-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: top; }
        table.lead-table td.label { width: 35%; font-weight: 600; color: #64748b; }
        table.lead-table td.value { width: 65%; font-weight: 600; color: #0f172a; }
        .btn-group { display: flex; gap: 10px; margin: 24px 0 10px 0; }
        .btn { display: inline-block; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; text-decoration: none; text-align: center; margin-right: 10px; }
        .btn-call { background: #2563eb; color: #ffffff !important; }
        .btn-wa { background: #059669; color: #ffffff !important; }
        .footer { background: #f8fafc; padding: 18px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="badge">🔥 New Website Lead</span>
          <h1>' . htmlspecialchars($formType) . ' Received</h1>
          <p style="margin: 6px 0 0 0; color: #93c5fd; font-size: 13px;">Sri Chakra Real Estate Lead Notification</p>
        </div>
        <div class="content">
          <div class="section-title">Client Information</div>
          <table class="lead-table">
            <tr>
              <td class="label">Customer Name</td>
              <td class="value">' . $clientName . '</td>
            </tr>
            <tr>
              <td class="label">Phone Number</td>
              <td class="value"><a href="tel:' . $clientPhone . '" style="color:#2563eb; text-decoration:none; font-weight:bold;">' . $clientPhone . '</a></td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value">' . ($clientEmail !== 'Not Provided' ? '<a href="mailto:' . $clientEmail . '" style="color:#2563eb; text-decoration:none;">' . $clientEmail . '</a>' : '<span style="color:#94a3b8;">Not Provided</span>') . '</td>
            </tr>';

    if ($propertyTitle) {
        $html .= '
            <tr>
              <td class="label">Property Inquired</td>
              <td class="value" style="color:#059669; font-weight:bold;">' . $propertyTitle . ($propertyId ? ' (ID: #' . $propertyId . ')' : '') . '</td>
            </tr>';
    }

    if ($interest) {
        $html .= '
            <tr>
              <td class="label">Interest / Type</td>
              <td class="value">' . $interest . '</td>
            </tr>';
    }

    if ($budget) {
        $html .= '
            <tr>
              <td class="label">Budget Range</td>
              <td class="value">' . $budget . '</td>
            </tr>';
    }

    if ($location) {
        $html .= '
            <tr>
              <td class="label">Preferred Location</td>
              <td class="value">' . $location . '</td>
            </tr>';
    }

    if ($date || $time) {
        $html .= '
            <tr>
              <td class="label">Requested Visit</td>
              <td class="value" style="color:#d97706; font-weight:bold;">' . $date . ' at ' . $time . '</td>
            </tr>';
    }

    if ($reason) {
        $html .= '
            <tr>
              <td class="label">Inquiry Reason</td>
              <td class="value">' . $reason . '</td>
            </tr>';
    }

    if ($message) {
        $html .= '
            <tr>
              <td class="label">Customer Note</td>
              <td class="value" style="font-weight:normal; line-height:1.5; background:#f8fafc; padding:8px 10px; border-radius:6px;">' . nl2br($message) . '</td>
            </tr>';
    }

    $html .= '
            <tr>
              <td class="label">Submission Date</td>
              <td class="value" style="color:#64748b; font-weight:normal;">' . $dateTime . '</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <a href="tel:' . $clientPhone . '" class="btn btn-call">📞 Call ' . $clientName . '</a>
            <a href="https://wa.me/' . $waPhone . '?text=' . urlencode("Hello $clientName, thank you for contacting Sri Chakra Real Estate regarding your enquiry. How can we assist you today?") . '" target="_blank" class="btn btn-wa">💬 WhatsApp Chat</a>
          </div>
        </div>
        <div class="footer">
          Sri Chakra Real Estate Notification Service • Walaja Road, Ranipet, Tamil Nadu<br>
          Sent automatically via Google SMTP to <b>' . htmlspecialchars(OWNER_EMAIL) . '</b>
        </div>
      </div>
    </body>
    </html>';

    return $html;
}

function generateClientResponseHtml(array $data, string $formType): string {
    $clientName    = htmlspecialchars($data['name'] ?? 'Valued Customer');
    $clientPhone   = htmlspecialchars($data['phone'] ?? '');
    $propertyTitle = htmlspecialchars($data['property_title'] ?? ($data['propertyTitle'] ?? ''));
    $location      = htmlspecialchars($data['location'] ?? '');
    $message       = htmlspecialchars($data['message'] ?? '');

    $html = '
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for contacting Sri Chakra Real Estate</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 30px; line-height: 1.6; }
        .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0; font-size: 13px; }
        .summary-box table { width: 100%; border-collapse: collapse; }
        .summary-box td { padding: 6px 0; }
        .contact-card { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px 20px; margin: 24px 0; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 11px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Sri Chakra Real Estate</div>
          <h1>Enquiry Received Successfully</h1>
          <p style="margin: 6px 0 0 0; color: #93c5fd; font-size: 13px;">Residential & Commercial Plots in Ranipet & Vellore</p>
        </div>
        <div class="content">
          <div class="greeting">Dear ' . $clientName . ',</div>
          <p>Thank you for reaching out to <b>Sri Chakra Real Estate</b>. We have received your <b>' . htmlspecialchars($formType) . '</b> request.</p>
          <p>Our dedicated property advisor will review your requirements and get in touch with you shortly at <b>' . $clientPhone . '</b> with verified plot layout maps, current pricing, DTCP approval details, and to arrange a free on-site visit.</p>

          <div class="summary-box">
            <div style="font-weight: 700; color: #475569; text-transform: uppercase; font-size: 11px; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Your Request Summary</div>
            <table>
              <tr>
                <td style="color:#64748b; width:40%;">Request Type:</td>
                <td style="font-weight:600; color:#0f172a;">' . htmlspecialchars($formType) . '</td>
              </tr>';

    if ($propertyTitle) {
        $html .= '
              <tr>
                <td style="color:#64748b;">Property Inquired:</td>
                <td style="font-weight:600; color:#059669;">' . $propertyTitle . '</td>
              </tr>';
    }

    if ($location) {
        $html .= '
              <tr>
                <td style="color:#64748b;">Preferred Location:</td>
                <td style="font-weight:600; color:#0f172a;">' . $location . '</td>
              </tr>';
    }

    if ($message) {
        $html .= '
              <tr>
                <td style="color:#64748b;">Your Note:</td>
                <td style="color:#334155;">' . nl2br($message) . '</td>
              </tr>';
    }

    $html .= '
            </table>
          </div>

          <div class="contact-card">
            <div style="font-weight: 700; color: #065f46; font-size: 13px; margin-bottom: 4px;">Need Immediate Assistance?</div>
            <div style="font-size: 13px; color: #047857;">
              Call us directly at <b>+91 97915 46491</b> or <b>+91 63813 73309</b>.<br>
              Office: Walaja Road, Ranipet, Tamil Nadu 632401
            </div>
          </div>

          <p style="margin-bottom: 0;">Warm regards,<br><b>Team Sri Chakra Real Estate</b><br><a href="https://srichakrarealestate.in" style="color:#2563eb; text-decoration:none;">https://srichakrarealestate.in</a></p>
        </div>
        <div class="footer">
          © ' . date('Y') . ' Sri Chakra Real Estate. All rights reserved.<br>
          This is an automated confirmation sent from zitersempire004@gmail.com
        </div>
      </div>
    </body>
    </html>';

    return $html;
}

// ---------------- Notify Owner & Client ----------------
function notifyClientAndOwner(array $data, string $formType, string $mode = 'mail+whatsapp'): void {
    // 1. Resolve Owner Emails (ensure BOTH info@srichakrarealestate.in and gmuruganpoigai@gmail.com are included)
    $ownerEmails = [];
    if (defined('OWNER_EMAIL')) {
        $parsed = array_filter(array_map('trim', explode(',', OWNER_EMAIL)));
        $ownerEmails = array_merge($ownerEmails, $parsed);
    }
    if (!in_array('info@srichakrarealestate.in', $ownerEmails)) {
        $ownerEmails[] = 'info@srichakrarealestate.in';
    }
    if (!in_array('gmuruganpoigai@gmail.com', $ownerEmails)) {
        $ownerEmails[] = 'gmuruganpoigai@gmail.com';
    }
    $ownerEmails = array_values(array_unique($ownerEmails));

    $clientName  = trim($data['name'] ?? 'Valued Customer');
    $clientPhone = trim($data['phone'] ?? '');
    $clientEmail = trim($data['email'] ?? '');

    // 2. Generate HTML & Plain text bodies
    $ownerHtml    = generateOwnerLeadHtml($data, $formType);
    $ownerSubject = "[New Lead - $formType] $clientName - Sri Chakra Real Estate";

    // Set reply-to to client email if provided so owner can simply hit Reply in their email client
    $ownerReplyTo = filter_var($clientEmail, FILTER_VALIDATE_EMAIL) ? $clientEmail : 'info@srichakrarealestate.in';
    $ownerReplyName = filter_var($clientEmail, FILTER_VALIDATE_EMAIL) ? $clientName : 'Sri Chakra Real Estate';

    // 3. Send email to BOTH owner/admin inboxes
    log_line("Dispatching query details to owner emails: " . implode(', ', $ownerEmails));
    sendEmail($ownerEmails, $ownerSubject, $ownerHtml, $ownerReplyTo, $ownerReplyName, true);

    // 4. Send Confirmation / Response email to client (if client email provided)
    if ($clientEmail && filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $clientHtml    = generateClientResponseHtml($data, $formType);
        $clientSubject = "Thank You for Contacting Sri Chakra Real Estate - We Received Your Enquiry";
        log_line("Dispatching confirmation response email to client: $clientEmail");
        sendEmail($clientEmail, $clientSubject, $clientHtml, 'info@srichakrarealestate.in', 'Sri Chakra Real Estate', true);
    } else {
        log_line("Client confirmation email skipped: no valid client email provided");
    }

    // 5. WhatsApp notification (if credentials configured)
    $ownerNumber = OWNER_PHONE;
    if ($ownerNumber) {
        $ownerWaMsg = "🏡 *New $formType Received!*\n\n"
                    . "🔹 *Name:* $clientName\n"
                    . "🔹 *Phone:* $clientPhone\n"
                    . "🔹 *Email:* " . ($clientEmail ?: 'N/A') . "\n"
                    . "🔹 *Property:* " . ($data['property_title'] ?? ($data['propertyTitle'] ?? 'General')) . "\n"
                    . "🔹 *Message:* " . ($data['message'] ?? 'N/A') . "\n\n"
                    . "Please follow up promptly!";
        sendWhatsAppMessage($ownerNumber, $ownerWaMsg);
    }
}
