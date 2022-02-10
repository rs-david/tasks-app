<?php
session_start();

$data = json_decode($_POST['data'], true);

$user_id = $_SESSION['user'];
$record = $data['record'];
$table = $data['table'];

$columns = 'user_id, ';
$values = ':user_id, ';
$execute_data[":user_id"] = $user_id;

foreach ($record as $column => $value) {
    $columns .= "$column, ";
    $values .= ":$column, ";
    if ($column != 'id') {
        $execute_data[":$column"] = "$value";
    } elseif ($column == 'id') {
        $execute_data[":$column"] = null;
    }
}

$columns = substr($columns, 0, -2);
$values = substr($values, 0, -2);

try {
    include('connection.php');

    $add = $conn->prepare("INSERT INTO $table($columns) VALUES($values)");
    $add->execute($execute_data);

    $response = ['content' => "¡Tarea Guardada!", 'type' => 'success'];
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['content' => "Error En El Servidor", 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
