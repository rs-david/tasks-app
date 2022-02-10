<?php
session_start();
$data = json_decode($_POST['data'], true);

try {
    require('connection.php');
    $user_id = $_SESSION["user"];
    $id = (int) $data['id'];
    $table = $data['table'];

    $row = $conn->prepare("SELECT * FROM $table WHERE user_id = :user_id AND id = :id");
    $row->execute([':user_id' => $user_id, ':id' => $id]);
    $row = $row->fetch(PDO::FETCH_ASSOC);

    $response = $row;
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['message' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
