<?php
session_start();
$data = json_decode($_POST['data'], true);

$table = $data['table'];
$keys = $data['keys'];
$totalkeys = count($keys);

for ($i = 0; $i < $totalkeys; $i++) {
    $id = $keys[$i];
    $conditions .= "id = $id";
    if ($i < $totalkeys - 1) $conditions .= ' OR ';
}

try {
    require('connection.php');
    $user_id = $_SESSION["user"];

    $statement = $conn->prepare("DELETE FROM $table WHERE user_id = :user_id AND $conditions");
    $statement->execute([':user_id' => $user_id]);

    $response = ['content' => "¡$totalkeys Tareas Eliminadas!", 'type' => 'success'];
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['content' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
