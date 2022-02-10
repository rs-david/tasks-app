<?php
session_start();
$data = json_decode($_POST['data'], true);

$record = $data['record'];
$user_id = $_SESSION['user'];
$id = $data['id'];
$table = $data['table'];

$execute_data[":user_id"] = $user_id;
foreach ($record as $key => $value) {
    if ($key != 'id') {
        $setquery .= "$key = :$key, ";
        $execute_data[":$key"] = "$value";
    }
}

$setquery = substr($setquery, 0, -2);
$execute_data[':id'] = "$id";

try {
    include('connection.php');

    $statement = $conn->prepare("UPDATE $table SET $setquery WHERE id = :id AND user_id = :user_id");
    $statement->execute($execute_data);

    $response = ['content' => "¡Tarea Modificada!", 'type' => 'success'];
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['content' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
