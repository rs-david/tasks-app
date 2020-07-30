<?php

session_start();
$data = json_decode($_POST['data'], true);

for ($i = 0; $i < count($data); $i++) {
    $id = $data[$i];
    $condition .= "id = $id";
    if ($i < count($data) - 1) $condition .= ' OR ';
}

try {
    require('connection.php');
    $user_id = $_SESSION["user"];

    $statement = $conn->prepare("DELETE FROM tasks WHERE user_id = :user_id AND $condition");
    $statement->execute([':user_id' => $user_id]);

    $quantity = count($data);
    $response = ['content' => "¡$quantity Tareas Eliminadas!", 'type' => 'success'];
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['content' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
