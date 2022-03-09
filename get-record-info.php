<?php
session_start();
$data = json_decode($_POST['data'], true);

try {
    require('connection.php');
    $user_id = $_SESSION["user"];
    $id = (int) $data['id'];
    $table = $data['table'];

    $record = $conn->prepare("SELECT * FROM $table WHERE user_id = :user_id AND id = :id");
    $record->execute([':user_id' => $user_id, ':id' => $id]);
    $record = $record->fetch(PDO::FETCH_ASSOC);

    $response = $record;
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['error' => $error];
}

echo json_encode($response);
