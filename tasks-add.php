<?php
session_start();

$data = json_decode($_POST['data'], true);

$name = $data['name'];
$description = $data['description'];
$user_id = $_SESSION['user'];

try {
    include('connection.php');

    $add = $conn->prepare("INSERT INTO tasks(user_id, name, description) VALUES(:user_id, :name, :description)");
    $add->execute([':user_id' => $user_id, ':name' => $name, ':description' => $description]);

    $response = ['content' => "¡Tarea Guardada!", 'type' => 'success'];
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['content' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
