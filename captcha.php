<?php
// Most of this was created using the google developer recaptcha guide with minor tweaking for saving emails to a txt file until I figure out the database issues. Source: https://cloud.google.com/recaptcha/docs/overview //
header('Content-Type: application/json');

require __DIR__ . '/vendor/autoload.php';

use Google\Cloud\RecaptchaEnterprise\V1\RecaptchaEnterpriseServiceClient;
use Google\Cloud\RecaptchaEnterprise\V1\Event;

// Service account key path
putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/u668020949/domains/ctccybersecurity.com/public_html/.private/recaptcha-service-account.json');

$recaptchaToken = $_POST['g-recaptcha-response'] ?? '';
$email = $_POST['email'] ?? '';

if (!$recaptchaToken || !$email) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields',
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid email address',
    ]);
    exit;
}

function create_assessment($recaptchaKey, $token, $project, $action) {
    try {
        $client = new RecaptchaEnterpriseServiceClient();
        $projectName = $client->projectName($project);

        $event = (new Event())
            ->setSiteKey($recaptchaKey)
            ->setToken($token);

        $assessment = (new Google\Cloud\RecaptchaEnterprise\V1\Assessment())
            ->setEvent($event);

        $response = $client->createAssessment($projectName, $assessment);

        if ($response->getTokenProperties()->getValid() === false) {
            $invalidReason = $response->getTokenProperties()->getInvalidReason();
            throw new Exception('Invalid token: ' . $invalidReason);
        }

        if ($response->getTokenProperties()->getAction() !== $action) {
            throw new Exception('Action mismatch: Expected ' . $action . ' but got ' . $response->getTokenProperties()->getAction());
        }

        return [
            'status' => 'success',
            'score' => $response->getRiskAnalysis()->getScore(),
            'reasons' => $response->getRiskAnalysis()->getReasons(),
            'message' => 'Congrats, you are now subscribed!',
        ];
    } catch (Exception $e) {
        error_log('Error creating assessment: ' . $e->getMessage());
        return [
            'status' => 'error',
            'message' => $e->getMessage(),
        ];
    }
}

$response = create_assessment(
    '6LexB5EqAAAAACqKKbpcKBFSERNyj3nO7i33jMkc',
    $recaptchaToken,
    'ctc-cybersecurity-website',
    'submit'
);

if ($response['status'] === 'success' && $response['score'] >= 0.5) {
    $filePath = __DIR__ . '/subscriptions.txt';
    file_put_contents($filePath, $email . PHP_EOL, FILE_APPEND);
}

echo json_encode($response);
?>