<?php

session_start();

if ($_SESSION['user']) {
    require 'index.view.php';
} else {
    header('location: login.php');
    exit;
}
