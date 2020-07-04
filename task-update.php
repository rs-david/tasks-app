<?php

$data = file_get_contents('php://input');
$data = json_decode($data, true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];

try {
    include('conexion.php');
    
    $statement = $conn->prepare("UPDATE tasks SET name = :name, description = :description WHERE id = :id");
    $statement->execute([':id'=>$id, ':name'=>$name, ':description'=>$description]);

    echo 'Tarea Modificada';
} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}
