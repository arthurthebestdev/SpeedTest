<?php
header('Content-Type: application/octet-stream');
echo str_repeat("0", 1024 * 1024 * 10); // Send 10 MB of zeros
?>
