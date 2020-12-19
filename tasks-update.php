<?php
session_start();
$data = json_decode($_POST['data'], true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];
$user_id = $_SESSION['user'];

try {
    include('connection.php');

    $statement = $conn->prepare("UPDATE tasks SET name = :name, description = :description WHERE id = :id AND user_id = :user_id");
    $statement->execute([':name' => $name, ':description' => $description, ':id' => $id, ':user_id' => $user_id]);

    $response = ['content' => "¡Tarea Modificada!", 'type' => 'success'];
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['content' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
