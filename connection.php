<?php

$conn = new PDO('mysql:host=localhost;dbname=tasks-app;', 'user', 'password');
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
