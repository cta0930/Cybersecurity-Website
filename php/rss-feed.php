<?php
// RSS feed URLs x2 that had CORS errors || sources: https://www.w3schools.in/php/php-rss-feed and https://phppot.com/php/php-rss-feed-read-and-list/ aaand https://www.php.net/manual/en/index.php //
$feeds = [
    "https://www.cisa.gov/news.xml", // CORS Error
    "https://krebsonsecurity.com/feed", // CORS Error
    "https://www.recordedfuture.com/feed"
];
$allFeeds = [];
foreach ($feeds as $feed_url) {
    libxml_use_internal_errors(true);
    $rss = simplexml_load_file($feed_url);
    if ($rss === false) {
        $errors = libxml_get_errors();
        foreach ($errors as $error) {
            error_log($error->message);
        }
        $allFeeds[] = ["error" => "Error loading the feed."];
    } else {
        $feedItems = [];
        foreach ($rss->channel->item as $item) {
            $feedItems[] = [
                "title" => (string) $item->title,
                "link" => (string) $item->link,
                "description" => (string) $item->description,
                "image" => (string) $item->enclosure['url'] ?: 'https://cdn.pixabay.com/photo/2020/02/21/17/06/security-4868165_1280.jpg', // default image when not available from pixabay
            ];
        }
        $allFeeds[] = $feedItems;
    }
}
header('Content-Type: application/json');
echo json_encode($allFeeds);
?>